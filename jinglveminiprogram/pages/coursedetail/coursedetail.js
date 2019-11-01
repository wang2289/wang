import polyv from '../../utils/polyv.js';
const app = getApp()
var utilMd5 = require('../../utils/md5.js');
const util = require('../../utils/util.js')
const WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    videoSrc: null,
    vid: "",
    videoName: "",
    videNumber: 3,
    courseName: "",
    aomId: 1008,
    useMonths: 6,
    iscollect: false,
    isbuy: false,
    money: 0,
    personnum: 0,
    teacher: "",
    taocan: [],
    cartnum: 0, //  购物车数量
    taocanshow: false,
    isIos: null

  },
  //点击播放
  onPlay(e) {


    // var url = 'api/QX/CheckIsBuy?'
    // var result = util.requestsendtoken(url, null, {
    //   aomid: this.data.aomId
    // }, res => {
    console.log(e);
    let isfree = e.currentTarget.dataset.isfree;
    if (this.data.isbuy || isfree) {
      this.setData({
        vid: e.currentTarget.dataset.vid,
        videoName: e.currentTarget.dataset.videoName,
      })
      let that = this;
      let vid = this.data.vid;

      //播放web加密需要添加ts和sign参数。
      var timestamp = Date.parse(new Date());
      // console.log("当前时间戳为：" + timestamp);
      var secretKey = "N0gieHhoou";
      var ts = timestamp;
      var sign = utilMd5.hexMD5(secretKey + vid + ts);
      // console.log(sign);
      /*获取视频数据*/
      let obj = {
        vid: vid,

        callback: function(videoInfo) {
          that.setData({
            videoSrc: videoInfo.src[0]
          });
        },
        /*params: {
          'param2': 'polyv'
        },
        sid: 'polyvsid',*/
        ts: ts,
        sign: sign
      };
      polyv.getVideo(obj);
    } else {
      wx.showToast({
        title: '您还没有购买该课程',
        icon: "none"
      })
    }
    // })



  },
  //跳转购物车
  gouwuche: function() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    })

  },
  // 加入购物车
  addcart: function() {
    var aomid = this.data.aomId
    util.requestsendtoken('api/UserShopping/AddUserShopping?', null, {
      aomid: aomid,
      typeid: 1
    }, res => {
      console.log(res.data);
      if (res.data) {
        wx.showToast({
          title: '已加入购物车！',
        })
        let number = this.data.cartnum + 1;
        this.setData({
          cartnum: number,
        })

      } else {
        wx.showToast({
          title: '购物车已存在！',
        })
      }

      // wx.navigateTo({
      //   url: '/pages/cart/cart'
      // })

    })
  },
  // 立即购买  
  immeBuy: function() {
    var aomid = this.data.aomId
    util.requestsendtoken('api/UserShopping/AddUserShopping?', null, {
      aomid: aomid,
      typeid: 1
    }, res => {
      console.log(res.data);

      wx.navigateTo({
        url: '/pages/cart/cart'
      })

    })
  },
  immeBuyPackage: function(e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id
    util.requestsendtoken('api/UserShopping/AddUserShopping?', null, {
      aomid: id,
      typeid: 0
    }, res => {
      console.log(res.data);

      wx.navigateTo({
        url: '/pages/cart/cart'
      })

    })
  },
  //点击最外层列表展开收起
  listTap(e) {
    console.log('触发了最外层');
    let Index = e.currentTarget.dataset.parentindex, //获取点击的下标值
      list = this.data.list;
    list[Index].show = !list[Index].show || false; //变换其打开、关闭的状态
    if (list[Index].show) { //如果点击后是展开状态，则让其他已经展开的列表变为收起状态
      this.packUp(list, Index);
    }

    this.setData({
      list
    });
  },
  //点击里面的子列表展开收起
  listItemTap(e) {
    let parentindex = e.currentTarget.dataset.parentindex, //点击的内层所在的最外层列表下标
      Index = e.currentTarget.dataset.index, //点击的内层下标
      list = this.data.list;
    console.log(list[parentindex].item, Index);
    list[parentindex].item[Index].show = !list[parentindex].item[Index].show || false; //变换其打开、关闭的状态
    if (list[parentindex].item[Index].show) { //如果是操作的打开状态，那么就让同级的其他列表变为关闭状态，保持始终只有一个打开
      for (let i = 0, len = list[parentindex].item.length; i < len; i++) {
        if (i != Index) {
          list[parentindex].item[i].show = false;
        }

      }
    }
    this.setData({
      list
    });
  },
  //让所有的展开项，都变为收起
  packUp(data, index) {
    for (let i = 0, len = data.length; i < len; i++) { //其他最外层列表变为关闭状态
      if (index != i) {
        data[i].show = false;
        for (let j = 0; j < data[i].item.length; j++) { //其他所有内层也为关闭状态
          data[i].item[j].show = false;
        }
      }
    }
  },


  timeUpdate: function(e) {
    polyv.timeUpdate(e);
  },
  //swiper切换时会调用
  pagechange: function(e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用
  titleClick: function(e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  },
  // 分享
  bindshare: function(e) {
    wx.onShareAppMessage();
  },
  // 显示套餐
  taocanshowclick: function() {
    this.setData({
      taocanshow: true,
    })
  },
  // 关闭套餐
  taocanclose: function() {
    this.setData({
      taocanshow: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //收藏事件
  oncollect: function(event) {
    let aomid = event.currentTarget.dataset.aomid //获取点击的下标值
    // console.log("收藏id" + aomid)
    if (this.data.iscollect) {
      util.requestsendtoken("api/UserCollect/DelUserCollect?", null, {
        aomid: this.data.aomId
      }, res => {
        // console.log("删除收藏：" + res.code)
        wx.showToast({
          title: '取消收藏成功！',
        })
        if (res.code == 0) {
          this.setData({
            iscollect: false
          })
        }
      })
    } else {
      util.requestsendtoken("api/UserCollect/AddUserCollect?", null, {
        aomid: this.data.aomId,
        typeid: 1
      }, res => {
        // console.log("添加收藏：" + res.code)
        wx.showToast({
          title: '收藏成功！',
        })
        if (res.code == 0) {
          this.setData({
            iscollect: true
          })
        }
      })
    }


  },
  onLoad: function(options) {
    var aomid = options.aomid;
    this.setData({
      isIos: app.globalData.isIos
    })
    util.requestsend("api/GetVideo/GetShiPingbylist?", null, {
      aomid: aomid
    }, this.processData)
    if (wx.getStorageSync("userName") != "") {
      util.requestsendtoken("api/UserCollect/CheckIsCanCollect?", null, {
        aomid: aomid
      }, res => {
        if (res.code == 1) {

          this.setData({
            iscollect: true
          })
        }
      });
      //购物车数量
      util.requestsendtoken("api/UserShopping/GetUserShoppingCount", null, {}, res => {


        this.setData({
          cartnum: res.data
        })

      });
    }
    var url = 'api/QX/CheckIsBuy?'
    var result = util.requestsendtoken(url, null, {
      aomid: aomid
    }, res => {
      // console.log("util获取的值" + res.msg)
      if (res.code == 0) {
        this.setData({
          isbuy: true
        })
      }
    })
  },
  processData: function(res) {
    console.log(res.data);
    var that = this
    that.setData({
      money: res.data.money,
      personnum: res.data.personnum,
      vid: res.data.vid,
      videoName: res.data.videoName,
      videNumber: res.data.videNumber,
      courseName: res.data.courseName,
      aomId: res.data.aomId,
      useMonths: res.data.useMonths,
      introduction: res.data.introduction,
      list: res.data.list,
      teacher: res.data.teacher,
      taocan: res.data.package,
    })
    wx.setNavigationBarTitle({
      title: this.data.courseName,
    })
    WxParse.wxParse('article', 'html', that.data.introduction, that, 0);
    WxParse.wxParse('teacherarticle', 'html', that.data.teacher, that, 0);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

    let that = this;
    let vid = this.data.vid;
    console.log("免费vid" + vid)
    //播放web加密需要添加ts和sign参数。
    var timestamp = Date.parse(new Date());
    console.log("当前时间戳为：" + timestamp);
    var secretKey = "N0gieHhoou";
    var ts = timestamp;
    var sign = utilMd5.hexMD5(secretKey + vid + ts);
    // console.log(sign);
    /*获取视频数据*/
    let obj = {
      vid: vid,

      callback: function(videoInfo) {
        that.setData({
          videoSrc: videoInfo.src[0]
        });
      },
      /*params: {
        'param2': 'polyv'
      },
      sid: 'polyvsid',*/
      ts: ts,
      sign: sign
    };
    polyv.getVideo(obj);

  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    polyv.destroy();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})