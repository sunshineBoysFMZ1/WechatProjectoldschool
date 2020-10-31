// pages/myrepair/myrepair.js
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: 0,
    scrollLeft: 0,
    index: [1, 2, 3, 4, 5],
    getlistData: [],
    page: 1,
    listnum: {},
    logo: true
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      page: 1
    });
    this.getlist(Number(e.currentTarget.dataset.id) + 1)
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      TabCur: e.detail.current,
      page: 1
    });
    this.getlist(Number(e.detail.current) + 1)
  },
  pingjia(e) {
    wx.navigateTo({
      url: '../appraise/appraise?data=' + JSON.stringify(this.data.getlistData[e.currentTarget.dataset.index]),
    })
  },

  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      TabCur: options.TabCur ? options.TabCur : 0
    })
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
    this.getlist(Number(this.data.TabCur) + 1)
  },
  async getlist(status) {
    try {
      const getlist = await confing.updateResturant({
        'url': '/order/getlist', data: {
          page: 1,
          size: 10,
          status
        }
      });
      // 工单数量
      const getlistnum = await confing.updateResturant({
        'url': '/order/getlistnum', 'data': {}
      });
      this.setData({
        getlistData: getlist.data.data,
        listnum: getlistnum.data.data,
        logo: false
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  scrolltolower() {
    let p = this.data.page < 2 ? 2 : this.data.page;
    confing.updateResturant({
      'url': '/order/getlist',
      'data': {
        page: p,
        size: 10,
        status: Number(this.data.TabCur) + 1
      }
    }).then((res) => {
      if (res.data.data.length) {
        p++;
        var content = this.data.getlistData.concat(res.data.data);
        this.setData({
          getlistData: content,
          page: p
        })
      } else {
        wx.showToast({
          title: '没有更多的工单信息',
          icon: "none"
        })
      }
    })
  },
})