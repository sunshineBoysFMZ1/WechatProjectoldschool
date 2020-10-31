// pages/tongji/tongji.js
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    tongjinLis:[],
    page:1
  },
  DateChange(e) {
    let that = this;
    that.setData({
      date: e.detail.value,
    });
    that.tongjinData(e.detail.value)
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
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let now = new Date(),
    that = this;
    that.tongjinData([now.getFullYear(), now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1].join('-'));
    that.setData({
      date: [now.getFullYear(), now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1].join('-')
    })
  },
  async tongjinData(start_time) {
    let that = this;
    try {
      const tongjinum = await confing.updateResturant({
        'url': '/order/tongjinum', data: {
          start_time
        }
      });
      const tongjin = await confing.updateResturant({
        'url':'/order/tongjin',data:{
          page:1,
          size:10,
          start_time
        }
      })
      that.setData({
        tongjinum: tongjinum.data.data,
        tongjinLis:tongjin.data.data
      });
    } catch (error) {
      console.log(error)
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
    let that = this;
    wx.showLoading({
      title:"loading"
    });
    setTimeout(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.tongjinData(that.data.date);
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let p = that.data.page < 2 ? 2: that.data.page;
    confing.updateResturant({
      'url':'/order/tongjin',data:{
        page:p,
        size:10,
        start_time:that.data.date
      }
    }).then((res)=>{
      if(res.data.data.length){
        p++;
        that.data.tongjinLis.concat(res.data.data);
        that.setData({
          page:p,
          tongjinLis:that.data.tongjinLis
        })
      }else{
        wx.showToast({
          title: '没有更多的工单信息',
          icon:"none"
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