//my.js
//获取应用实例
const app = getApp()
const confing = require('../../utils/request')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderNumData: {},
    is_login: false,
    type: 1,
    logo: true
  },

  order(e) {
    wx.navigateTo({
      url: '../myorder/myorder',
    })
  },
  navigator(e) {
    wx.navigateTo({
      url: '../myrepair/myrepair?TabCur=' + e.currentTarget.dataset.i,
    })
  },
  masterurl(e) {
    app.globalData.TabCur = e.currentTarget.dataset.i
    wx.switchTab({
      url: '../index/index',
    })
  },
  onLoad: function () {

  },
  onShow: function () {
    let that = this;
    if (wx.getStorageSync('is_login')) {
      that.myFun();
      that.setData({
        is_login: wx.getStorageSync('is_login'),
        type: JSON.parse(wx.getStorageSync('user_info')).type,
      })
    } else {
      that.setData({
        logo: false,
        is_login: wx.getStorageSync('is_login'),
      })
    }
  },
  async myFun() {
    let that = this;
    try {
      // 工单类型数量
      const orderNum = await confing.updateResturant({
        'url': '/order/orderNum',
        data: {}
      });
      // 获取用户信息
      const getinfo = await confing.updateResturant({
        'url': '/user/getinfo',
        data: {
          user_id: JSON.parse(wx.getStorageSync('user_info')).id
        }
      });
      that.setData({
        orderNumData: orderNum.data.data,
        userInfo: getinfo.data.data,
        logo: false
      });
      wx.setStorageSync('user_info', JSON.stringify(getinfo.data.data));
      if (orderNum.data.code != 1) {
        wx.login({
          complete: (res) => {
            app.indexCoceLoing(res.code).then((res) => {
              console.log('tokens 消失,重新获取');
              that.onShow();
            });
          },
        })
      }
    } catch (error) {
      that.setData({
        logo: false
      })
      console.log(error)
    }
  },
  /**授权登录 */
  bindGetUserInfo: function (e) {
    if (e.detail.errMsg == "getUserInfo:fail auth deny") {
      return;
    }
    app.getUsercode(e).then((res, status) => {
      this.onShow();
      wx.showToast({
        title: '登录成功',
      })
    })
  },
  onPullDownRefresh() {
    let that = this;
    wx.showLoading({
      title: "loading"
    });
    that.myFun();
    setTimeout(() => {
      wx.hideLoading();
      that.onShow();
      wx.stopPullDownRefresh();
    }, 1000);
  },
})