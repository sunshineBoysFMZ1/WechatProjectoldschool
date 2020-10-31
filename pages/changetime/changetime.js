// pages/changetime/changetime.js
const dateTimePicker = require('../../utils/dateTimePicker.js');
const obj = dateTimePicker.dateTimePicker();
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateTime: obj.dateTime,
    dateTimeArray: obj.dateTimeArray,
    selectTime: [],
    rawTime: '2020-6-7 1:10',
    TimeShow: 0,
    Detail: {}
  },
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel,
    })
  },
  bindChange: function (e) {
    const val = e.detail.value,
      that = this;
    that.setData({
      "selectTime[0]": that.data.dateTimeArray[0][val[0]],
      "selectTime[1]": that.data.dateTimeArray[1][val[1]],
      "selectTime[2]": that.data.dateTimeArray[2][val[2]],
      "selectTime[3]": that.data.dateTimeArray[3][val[3]],
      "selectTime[4]": that.data.dateTimeArray[4][val[4]]
    });
    const [A, B, C, ...D] = that.data.selectTime;
    const time = A + '-' + B + '-' + C + ' ' + D.join(':');
    that.setData({
      selectTime: time
    })
    // that.judgeTime(time);
  },
  selectAdd(e) {
    this.setData({
      TimeShow: e.currentTarget.dataset.i
    });
  },
  /**
   * @method 判断选择时间是否合理;
   * @param {*} time 选择的时间
   */
  judgeTime(time) {
    const nowTime = new Date().getTime();
    if (new Date(time).getTime() < nowTime) return wx.showToast({
      title: '请选择合理的时间段',
      icon: "none"
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      Detail: JSON.parse(options.data),
      rawTime: JSON.parse(options.data).reserve_time
    })
  },
  // 改签时间
  async changes() {
    try {
      const changes = await confing.updateResturant({
        'url': '/order/changes', data: {
          order_id: this.data.Detail.id,
          reserve_time: this.data.selectTime
        }
      });
      if (changes.data.code) {
        wx.showToast({
          title: changes.data.msg,
          success: (res) => {
            setTimeout(() => {
              wx.navigateBack()
            }, 1000);
          }
        })
      } else {
        wx.showToast({
          title: changes.data.msg,
          icon: "none"
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