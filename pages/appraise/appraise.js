// pages/appraise/appraise.js
const confing = require('../../utils/request')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: [],
    photocount: 3,
    imgList: [],
    start: [{}, {}, {}, {}, {}],
    star: 0,
    Detail: {},
    desc: '',
    logo: false,
    checked: true
  },
  select(e) {
    let i = Number(e.currentTarget.dataset.i) + 1;
    new Promise((reslove, reject) => {
      for (let item = 0; item < 5; item++) {
        this.data.start[item].checked = false;
      };
      reslove()
    }).then(() => {
      for (let item = 0; item < i; item++) {
        this.data.start[item].checked = true;
      };
      this.setData({
        start: this.data.start,
        star: Number(e.currentTarget.dataset.i) + 1
      });
    })
  },
  textareaAInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
  ChooseImage: function (e) {
    var that = this;
    var imgList = that.data.imgList
    let photocount = that.data.photocount;
    if (photocount > 0) {
      wx.chooseImage({
        count: photocount, //最多可以选择的图片总数
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          if (res.tempFilePaths.length < 1) {
            imgList.push(res.tempFilePaths)
            that.setData({
              imgList: that.data.imgList
            });
          } else {
            for (var i = 0; i < res.tempFilePaths.length; i++) {
              imgList.push(res.tempFilePaths[i]);
              that.setData({
                imgList: that.data.imgList
              });
            }
          }
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          //启动上传等待中...
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 10000
          })
          that.uploadimg({
            path: res.tempFilePaths //这里是选取的图片的地址数组
          });
        }
      });
    }
  },
  //多张图片上传
  uploadimg: function (data) {
    var that = this;
    let photocount = that.data.photocount;
    var i = data.i ? data.i : 0; //当前上传的哪张图片
    var success = data.success ? data.success : 0; //上传成功的个数
    var fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: confing.http + '/upload/uploadfile',
      filePath: data.path[i],
      name: 'files',
      formData: {
        files: data.path[i],
      },
      header: {
        "Content-Type": "multipart/form-data"
      },
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        photocount--;
        console.log(JSON.parse(resp.data))
        var show_url = JSON.parse(resp.data).data.img;
        var productInfo = that.data.productInfo;
        productInfo.push(show_url);
        that.setData({
          productInfo: productInfo,
          photocount: photocount
        });
        let n = i + 1;
        wx.showLoading({
          title: n + '/' + data.path.length + '上传成功', //这里打印出 上传成功
        })
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
        wx.showLoading({
          title: (i + 1) + '/' + data.path.length + '上传失败', //这里打印出 上传成功
        })
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用     
          wx.hideLoading();
          if (success == i) {
            wx.showToast({
              title: '组图上传完成', //这里打印出 上传成功
              icon: 'success',
              duration: 1000
            })
          } else {
            wx.showModal({
              title: '组图上传失败', //这里打印出 上传成功
              content: '请稍后再试',
              showCancel: false
            })
          }
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    var photocount = this.data.photocount;
    photocount++;
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.productInfo.splice(e.currentTarget.dataset.index,1)
          this.setData({
            imgList: this.data.imgList,
            productInfo:this.data.productInfo,
            photocount
          })
        }
      }
    })
  },
  // 提交信息
  formSubmit(e) {
    if (e.detail.value.desc == false || this.data.productInfo == false || this.data.star == false) return wx.showToast({
      title: '请填写完整的评价信息',
      icon: "none"
    })
    if (this.data.checked) {
      this.setData({
        checked: false
      })
      this.appraise(e.detail.value.desc);
    }
    this.setData({
      logo: true
    })
  },
  async appraise(desc) {
    try {
      const appraise = await confing.updateResturant({
        'url': '/order/appraise', data: {
          order_id: this.data.Detail.id,
          star: this.data.star,
          desc,
          images: this.data.productInfo.join(',')
        }
      });
      if (appraise.data.code) {
        wx.showToast({
          title: appraise.data.msg,
          success: () => {
            this.setData({
              checked: true
            })
            setTimeout(() => {
              wx.navigateBack({
                complete: (res) => { },
              })
            }, 1000);
          }
        })
      } else {
        wx.showToast({
          title: appraise.data.msg,
          icon: "none"
        })
      }
    } catch (error) {

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      Detail: JSON.parse(options.data)
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