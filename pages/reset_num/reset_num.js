// pages/reset_name/reset_name.js;
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      mobile: options.mobile
    })
  },
  mobileData(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  async saveinfo() {
    try {
      const messgae = await confing.updateResturant({
        'url': '/user/saveinfo',
        data: {
          user_id: JSON.parse(wx.getStorageSync('user_info')).id,
          index: 'mobile',
          value: this.data.mobile
        }
      });
      if (messgae.data.code) {
        wx.showToast({
          title: messgae.data.msg,
          success: () => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 0,
              })
            }, 1000);
          }
        })
      }else{
        wx.showToast({
          title: messgae.data.msg,
          icon:"none"
        })
      }
    } catch (error) {
      console.log(error)
    }
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