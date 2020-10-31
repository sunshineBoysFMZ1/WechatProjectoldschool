// pages/index/index.js
const dateTimePicker = require('../../utils/dateTimePicker.js');
const obj = dateTimePicker.dateTimePicker();
const confing = require('../../utils/request');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productInfo: [],
    photocount: 3,
    index: null,
    picker: [],
    getArea: [], //维修区域
    indexB: -1,
    pickerB: [],
    indexK: null,
    pickerK: [],
    getCategory: [], //维修分类
    imgList: [],
    modalName: null,
    textareaAValue: '',
    time: '',
    date: '',
    dateTime: obj.dateTime,
    dateTimeArray: obj.dateTimeArray,
    TabCur: 0,
    scrollLeft: 0,
    TimeShow: 0,
    rawTime: '2020-10-1 9:00',
    selectTime: [],
    length: [1, 2, 3, 4, 5],
    getlistData: [], //师父订单列表
    repair_area_id: 0, //维修区域id
    category_id: 0, //分类id
    repair_floor_id: 0, //楼栋id
    is_login: false,
    order_id: 0,
    page: 1,
    listnum: {},
    type: 1,
    logo: false,
    message: "",
    address: "",
    checked: true,
    textname: "",//用户输入
    texttel: ""
  },
  liuyan(e) {
    this.setData({
      message: e.detail.value
    })
  },
  /**
   * @method bindChange() 选择时间段~
   * @param {*} e  属性 
   */
  bindChange: function (e) {
    const val = e.detail.value,
      that = this;
    const [S1, S2, S3, S4, S5] = that.data.dateTimeArray;
    that.setData({
      "selectTime[0]": S1[val[0]],
      "selectTime[1]": S2[val[1]],
      "selectTime[2]": S3[val[2]],
      "selectTime[3]": S4[val[3]],
      "selectTime[4]": S5[val[4]]
    });
    const [A, B, C, ...D] = that.data.selectTime;
    const time = A + '-' + B + '-' + C + ' ' + D.join(':');
    that.setData({
      selectTime: time,
    })
    that.judgeTime(time);
  },
  // 关闭 or 开启 时间prick
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
    const nowTime = new Date().getTime() + 1800000;
    if (new Date(time).getTime() < nowTime) return wx.showToast({
      title: '请选择合理预约时间,当前时间段30分钟以后',
      icon: "none"
    });
  },
  // 选择订单状态
  tabSelect(e) {
    let that = this;
    that.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      getlistData: [],
      page: 1
    });
    app.globalData.TabCur = e.currentTarget.dataset.id;
    that.getList(Number(e.currentTarget.dataset.id) + 1)
  },
  // 滚动切换标签样式 选择订单状态
  switchTab: function (e) {
    let that = this;
    that.setData({
      TabCur: e.detail.current,
      getlistData: [],
      page: 1
    });
    app.globalData.TabCur = e.detail.current;
    that.getList(Number(e.detail.current) + 1)
  },
  // 订单列表
  async getList(status) {
    const getlist = await confing.updateResturant({
      'url': '/order/getlist',
      'data': {
        page: 1,
        size: 10,
        status
      }
    });
    this.setData({
      getlistData: getlist.data.data
    })
  },
  // 接单
  async receiving(e) {
    let that = this;
    try {
      const receiving = await confing.updateResturant({
        'url': '/order/receiving',
        data: {
          order_id: e.currentTarget.dataset.id
        }
      });
      if (receiving.data.code) {
        wx.showToast({
          title: receiving.data.msg,
        });
        that.getList(Number(that.data.TabCur) + 1);
        that.gdnumFn();
      } else {
        wx.showToast({
          title: receiving.data.msg,
          icon: "none"
        });
      }
    } catch (error) {

    }
  },
  // 签到打卡
  async signin(e) {
    let that = this;
    try {
      const signin = await confing.updateResturant({
        'url': '/order/signin',
        data: {
          order_id: e.currentTarget.dataset.id
        }
      });
      if (signin.data.code) {
        wx.showToast({
          title: signin.data.msg,
        });
        that.getList(Number(that.data.TabCur) + 1);
        that.gdnumFn();
      } else {
        wx.showToast({
          title: signin.data.msg,
          icon: "none"
        });
      }
    } catch (error) {

    }
  },
  // 操作弹框
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target,
      order_id: e.currentTarget.dataset.id
    })
  },
  // 操作弹框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 取消工单
  async cancel() {
    let that = this;
    if (that.data.textareaAValue == false) return wx.showToast({
      title: '请填写取消原因',
      icon: "none"
    });
    try {
      const cancel = await confing.updateResturant({
        'url': '/order/cancel', data: {
          order_id: that.data.order_id,
          cancel: that.data.textareaAValue
        }
      })
      if (cancel.data.code) {
        wx.showToast({
          title: cancel.data.msg,
        });
        that.hideModal();
        that.getList(Number(that.data.TabCur) + 1);
        that.gdnumFn();
      } else {
        wx.showToast({
          title: cancel.data.msg,
          icon: "none"
        });
        that.hideModal();
      }
    } catch (error) {

    }
  },

  // 维修区域：
  PickerChange(e) {
    let that = this,
      pickerB = [];
    // 获取维修区域维修楼栋
    for (let item of that.data.getArea[e.detail.value].son) {
      pickerB.push(item.name)
    };
    if (that.data.getArea[e.detail.value].son.length) {
      that.setData({
        index: e.detail.value,
        repair_area_id: that.data.getArea[e.detail.value].id,
        pickerB,
      })
    } else {
      return that.setData({
        index: e.detail.value,
      }), wx.showToast({
        title: '当前维修区域,还没添加维修楼栋',
        icon: "none"
      })
    }
  },
  // 维修楼栋：
  PickerChangeB(e) {
    let that = this;
    that.setData({
      indexB: e.detail.value,
      repair_floor_id: that.data.getArea[that.data.index].son[e.detail.value].id
    })
  },
  // 维修分类：
  PickerChangeK(e) {
    let that = this;
    that.setData({
      indexK: e.detail.value,
      category_id: that.data.getCategory[e.detail.value].id
    })
  },

  // 备注留言：
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  // unfinish 未完成跳转
  unfinish(e) {
    wx.navigateTo({
      url: '../unfinish/unfinish?id=' + e.currentTarget.dataset.id,
    })
  },
  // 完成维修跳转
  finish(e) {
    wx.navigateTo({
      url: '../finish/finish?id=' + e.currentTarget.dataset.id,
    })
  },
  // 改签时间
  change(e) {
    wx.navigateTo({
      url: '../changetime/changetime?data=' + JSON.stringify(this.data.getlistData[e.currentTarget.dataset.index]),
    })
  },
  // 联系方式
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tell,
    })
  },
  //提交
  formSubmit(e) {
    let that = this;
    for (let item in e.detail.value) {
      if (!e.detail.value[item] || that.data.productInfo.length == 0) {
        return wx.showToast({
          title: "带*号是必填信息,请填写完整",
          icon: "none"
        })
      }
    };
    const nowTime = new Date().getTime() + 1800000;
    if (that.data.selectTime < nowTime) return wx.showToast({
      title: '请选择合理预约时间,当前时间段30分钟以后',
      icon: "none"
    });
    if (that.data.checked) {
      that.setData({
        checked: false
      })
      that.create(e.detail.value);
    }
  },
  // 提交创建订单;
  async create(value) {
    let that = this;
    try {
      var respon = await confing.updateResturant({
        'url': '/order/create',
        data: {
          category_id: value.category_id,
          repair_area_id: value.repair_area_id,
          repair_floor_id: value.repair_floor_id,
          address: value.address,
          reserve_time: that.data.selectTime,
          username: value.username,
          mobile: value.mobile,
          message: value.message,
          images: that.data.productInfo.join(',')
        }
      });
      if (respon.data.code) {
        wx.showToast({
          title: '提交成功',
          duration: 1000,
          success: () => {
            that.setData({
              picker: [],
              pickerB: [],
              pickerK: [],
              index: null,
              indexB: -1,
              indexK: null,
              message: "",
              username: '',
              mobile: "",
              address: '',
              imgList: [],
              productInfo: [],
              photocount: 3,
              checked: true
            });
            if (wx.getStorageSync('is_login')) {
              wx.navigateTo({
                url: '../myrepair/myrepair',
              })
            } else {
              wx.switchTab({
                url: '../my/my',
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: respon.data.msg,
          icon: "none",
          success: () => {
            that.setData({
              checked: true
            })
          }
        })
      }
    } catch (error) {
      that.setData({
        checked: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.TabCur = 0;
  },
  async asyncFun() {
    let that = this;
    try {
      // 查询维修分类;
      const Param = {
        "getCategory": await confing.updateResturant({
          'url': '/index/getCategory',
          'data': {}
        }),
        "getArea": await confing.updateResturant({
          'url': '/index/getArea',
          'data': {}
        })
      }
      that.disposeFn([{
        name: 'getCategory',
        data: Param.getCategory.data.data
      }, {
        name: 'getArea',
        data: Param.getArea.data.data
      }]);
      // 订单列表
      const getlist = await confing.updateResturant({
        'url': '/order/getlist',
        'data': {
          page: 1,
          size: 10,
          status: Number(that.data.TabCur) + 1
        }
      });
      // 工单数量
      const getlistnum = await confing.updateResturant({
        'url': '/order/getlistnum', 'data': {}
      });
      if (getlist.data.code || getlistnum.data.code) {
        that.setData({
          getlistData: getlist.data.data,
          listnum: getlistnum.data.data
        })
      } else {
        wx.removeStorage({
          key: 'tokens',
          success(res) {
            wx.login({
              complete: (res) => {
                app.indexCoceLoing(res.code).then((res) => {
                  console.log('tokens 消失,重新获取');
                  that.onShow();
                });
              },
            })
          }
        });
      }
    } catch (error) {
      console.log(error)
    }
  },
  // 处理分类数据
  disposeFn(data) {
    let that = this,
      pickerK = [],
      picker = [],
      getArea = [],
      getCategory = [];
    for (let item of data) {
      for (let ii of item.data) {
        if (item.name == 'getCategory') {
          pickerK.push(ii.name);
          getCategory = item.data
        } else {
          picker.push(ii.name);
          getArea = item.data
        }
      }
    }
    that.setData({
      pickerK,
      picker,
      getCategory,
      getArea
    });
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
    let that = this;
    that.getUserinfo();
    that.asyncFun();
    that.updataMange();
    if (wx.getStorageSync('is_login')) {
      that.setData({
        type: JSON.parse(wx.getStorageSync('user_info')).type ? JSON.parse(wx.getStorageSync('user_info')).type : 1,
        is_login: wx.getStorageSync('is_login'),
      });
    };
    let nowTime = new Date();
    nowTime.setMinutes(nowTime.getMinutes() + 30)
    let FullYear = nowTime.getFullYear(),
      Month = nowTime.getMonth() + 1,
      Dates = nowTime.getDate(),
      Hours = nowTime.getHours(),
      Minutes = nowTime.getMinutes() < 10 ? '0' + nowTime.getMinutes() : nowTime.getMinutes();
    that.setData({
      rawTime: FullYear + '-' + Month + '-' + Dates + ' ' + Hours + ':' + Minutes,
      selectTime: FullYear + '-' + Month + '-' + Dates + ' ' + Hours + ':' + Minutes,
      TabCur: app.globalData.TabCur >= 0 ? app.globalData.TabCur : that.data.TabCur,
      scrollLeft: app.globalData.TabCur >= 0 ? (app.globalData.TabCur * 60) : that.data.TabCur
    });
  },
  // 工单数量
  async gdnumFn() {
    try {
      // 工单数量
      const getlistnum = await confing.updateResturant({
        'url': '/order/getlistnum', 'data': {}
      });
      this.setData({
        listnum: getlistnum.data.data
      })
    } catch (error) {

    }
  },
  // 用户输入信息
  userText(e) {
    console.log(e.currentTarget.dataset.i)
    if (e.currentTarget.dataset.i == 1) {
      this.setData({
        texttel: e.detail.value
      })
    } else {
      this.setData({
        textname: e.detail.value
      })
    }
    console.log(this.data.textname+':name')
    console.log(this.data.texttel+':tel')
  },
  // 用户信息
  async getUserinfo() {
    try {
      // 获取用户信息
      const getinfo = await confing.updateResturant({
        'url': '/user/getinfo',
        data: {
          user_id: JSON.parse(wx.getStorageSync('user_info')).id
        }
      });
      this.setData({
        username: this.data.textname ? this.data.textname : getinfo.data.data.username,
        mobile: this.data.texttel ? this.data.texttel : getinfo.data.data.mobile
      });
     
      wx.setStorageSync('user_info', JSON.stringify(getinfo.data.data))
    } catch (error) {

    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      logo: false
    });

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
      title: "loading"
    });
    that.getUserinfo();
    setTimeout(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      that.onShow();
    }, 1000);
  },
  scrolltolower() {
    let that = this;
    let p = that.data.page < 2 ? 2 : that.data.page;
    confing.updateResturant({
      'url': '/order/getlist',
      'data': {
        page: p,
        size: 10,
        status: Number(that.data.TabCur) + 1
      }
    }).then((res) => {
      if (res.data.data.length) {
        p++;
        var content = that.data.getlistData.concat(res.data.data);
        that.setData({
          getlistData: content,
          page: p
        });
      } else {
        wx.showToast({
          title: '没有更多的工单信息',
          icon: "none"
        })
      }
    })
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
  // 选择上传照片
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
  // 查看大图
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  // 删除上传图片；
  DelImg(e) {
    let that = this;
    let photocount = that.data.photocount;
    photocount++
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图片吗？',
      cancelText: '取消',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          that.data.imgList.splice(e.currentTarget.dataset.index, 1);
          that.data.productInfo.splice(e.currentTarget.dataset.index, 1)
          that.setData({
            imgList: that.data.imgList,
            productInfo: that.data.productInfo,
            photocount
          })
        }
      }
    })
  },
  // 更新小程序
  updataMange: function () {
    if (wx.canIUse("getUpdateManager")) {
      let updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调

      })
      updateManager.onUpdateReady(() => {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: (res) => {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            } else if (res.cancel) {
              return false;
            }
          }
        })
      })
      updateManager.onUpdateFailed(() => {
        // 新的版本下载失败
        wx.hideLoading();
        wx.showModal({
          title: '升级失败',
          content: '新版本下载失败，请检查网络！',
          showCancel: false
        });
      });
    }
  },
})