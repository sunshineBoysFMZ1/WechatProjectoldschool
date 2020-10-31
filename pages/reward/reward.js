// pages/reward/reward.js
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    page: 1,
    Data: [],
    Detail:[]
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      TabCur: e.detail.current
    });
    this.checkCor();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.redLog();
  },
  async redLog() {
    try {
      const redLogData = await confing.updateResturant({
        'url': '/order/redLog',
        data: {
          page: 1,
          size: 10
        }
      })
      this.setData({
        Data: redLogData.data.data,
        Detail:redLogData.data.data.data
      })
    } catch (error) {

    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: 'laoding',
    });
    setTimeout(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      this.redLog();
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let p = this.data.page < 2 ? 2 : this.data.page;
    confing.updateResturant({
      'url': '/order/redLog',
      data: {
        page: p,
        size: 10
      }
    }).then((res) => {
      if (res.data.data.length) {
        this.data.Detail.concat(res.data.data.data);
        p++;
        this.setData({
          Detail: this.data.Detail,
          page: p
        })
      } else {
        wx.showToast({
          title: '没有更多的奖励信息',
          icon: "none"
        })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})