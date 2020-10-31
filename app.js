//app.js
const getData = require('./utils/request')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        this.indexCoceLoing(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  // 首页code登录
  indexCoceLoing(code) {
    return new Promise((reslove, reject) => {
      if (wx.getStorageSync('tokens') == false) {
        wx.request({
          url: getData.http + '/user/register',
          method: "POST",
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: {
            code
          },
          success: (res) => {
            if (res.data.code) {
              wx.setStorageSync('tokens', res.data.data.tokens);
              wx.setStorageSync('openid', res.data.data.openid);
              reslove()
              setTimeout(() => {
                this.clearToken();
              }, 604800);
            };
          }
        })
      };
    })

  },
  // tokens 清除时间
  clearToken() {
    wx.removeStorage({
      key: 'tokens',
      success(res) { }
    });
    this.onLaunch();
  },
  /**登录授权获取用户code */
  getUsercode: function (e) {
    var that = this;
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      return;
    }
    wx.setStorageSync('userInfo', e.detail.userInfo)
    return new Promise(function (reslove, reject) {
      that.userlogin(e.detail.userInfo).then((res) => {
        reslove(res)
      })
    }).catch((res) => {

    })
  },
  /**登录 */
  userlogin: function (userInfo) {
    return new Promise((reslove, reject) => {
      wx.request({
        url: getData.http + '/user/login',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          openid: wx.getStorageSync('openid'),
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        },
        success: (res) => {
          if (res.data.code != true) return wx.showToast({
            title: '登录失败',
            icon: "none"
          });
          wx.setStorageSync('user_info', JSON.stringify(res.data.data));
          wx.setStorageSync('is_login', true);
          reslove();
          setTimeout(() => {
            this.clearToken();
          }, 604800);
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    TabCur: -1
  }
})