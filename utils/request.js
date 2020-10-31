
// 请求接口
const http = 'https://caiyuan.1565.com.cn/api';
const updateResturant = param => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: http + param.url,
      data: param.data,
      header:{
        tokens:wx.getStorageSync('tokens')
      },
      method: "POST",
      success: (res) => {
        resolve(res)
      }
    })
  })
};


module.exports = {
  updateResturant,
  http
}
