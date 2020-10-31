// pages/personal/personal.js
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: null,
    picker: ['男', '女'],
    userInfo: {}
  },
  PickerChange(e) {
    this.setData({
      index: e.detail.value
    });
    this.saveinfo(Number(e.detail.value)+1);
  },
  // 修改性别
  async saveinfo(value){
    try {
      const message = await confing.updateResturant({'url':'/user/saveinfo',data:{
        user_id: JSON.parse(wx.getStorageSync('user_info')).id,
        index:'sex',
        value
      }})
    } catch (error) {
      
    }
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
    this.getinfoData();
  },
  async getinfoData() {
    try {
      const getinfo = await confing.updateResturant({
        'url': '/user/getinfo',
        data: {
          user_id: JSON.parse(wx.getStorageSync('user_info')).id
        }
      });
      this.setData({
        userInfo: getinfo.data.data,
        index:getinfo.data.data.sex < 2 ? 0 : 1
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

  }
})