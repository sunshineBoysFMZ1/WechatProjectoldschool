// pages/details/details.js
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Detail:{},
    Image:[],
    logo:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.details(options.id)
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  async details(order_id){
    try {
      const details = await confing.updateResturant({'url':'/order/details',data:{
        order_id
      }});
     this.setData({
      Detail:details.data.data,
      Image:details.data.data.images.split(','),
      logo:false
     });
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  ViewImage(e){
    wx.previewImage({
      urls: this.data.Image,
      current:e.currentTarget.dataset.url
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})