const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

Page({
  data: {

    imgUrls: [
      // 'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      // 'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      // 'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    number: 5,
    toView: 'yellow',
    scrollLeft: 0,
    isIos: null,
    //滚动的数组
    scrolls: [{
        name: '黄色',
        tag: 'yellow',
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
      {
        name: '黄色',
        tag: 'yellow',
      },
      {
        name: '绿色',
        tag: 'green',
      },
      {
        name: '红色',
        tag: 'red',
      },
    ],
    publiccourse: [], //公开课
    tujianvideo: [], //精品课程
    tujiantiku: [], // 精品题库
    tujianzuhe: [], //精品组合
  },
  //事件处理函数

  toTransList: function(e) {
    console.log(e.currentTarget)
    wx.navigateTo({
      url: "/pages/broadcast/broadcast?id=" + e.currentTarget.dataset.id + "&name=" + e.currentTarget.dataset.name
    })
  },
  bindpackedgmore: function() {
    wx.navigateTo({
      url: '/pages/packagemore/packagemore',
    })
  },
  bindtikumore: function() {
    wx.navigateTo({
      url: '/pages/tilist/tilist',
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    this.setData({
      isIos: app.globalData.isIos
    })
    util.requestsend("api/OrgCourseMoney/GetIndexImage?", null, {}, res => {

      this.setData({
        imgUrls: res.data

      })
    });

    util.requestsend("api/OrgCourseMoney/GetZhiBo?", null, {}, res => {

      this.setData({
        publiccourse: res.data

      })
      console.log(this.data.publiccourse)
    }); //公开课
    
    //判断用户
    if (wx.getStorageSync("userName") != "") {
      //登录状态的精品课程
      util.requestsendtoken("api/QX/GetShiPingLogin", null, {}, res => {
        this.setData({
          tujianvideo: res.data
        })
      });
      //登录状态的精品题库
      util.requestsendtoken("api/QX/GetTikuLogin", null, {}, res => {
        this.setData({
          tujiantiku: res.data
        })
      });
      //登录状态的精品组合课
      util.requestsendtoken("api/QX/GetTaoCanLogin", null, {}, res => {
        console.log(res.data);
        this.setData({
          tujianzuhe: res.data

        })
        wx.hideNavigationBarLoading()
      });

    }else{
      //未登录状态的精品课程
      util.requestsend("api/OrgCourseMoney/GetShiPing?", null, {}, res => {
        this.setData({
          tujianvideo: res.data

        })
      }); 
      //未登录状态的精品题库
      util.requestsend("api/OrgCourseMoney/GetTiku?", null, {}, res => {
        this.setData({
          tujiantiku: res.data

        })
      }); 
      //未登录状态的精品组合课
      util.requestsend("api/OrgCourseMoney/GetTaoCan?", null, {}, res => {
        console.log(res.data);
        this.setData({
          tujianzuhe: res.data

        })
        wx.hideNavigationBarLoading()
      }); 
    }

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindnavtovider: function(e) {
    console.log(e);
    let aomid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/coursedetail/coursedetail?aomid=' + aomid,
    })

  },
  bindnavtotiku: function(e) {
    console.log(e);
    let aomid = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/tidetail/tidetail?aomid=' + aomid,
    })

  },
  bindnavtopackage: function(e) {
    let id = e.currentTarget.dataset.id;
    console.log("传递的套餐id:");
    console.log(id);
    wx.navigateTo({
      url: '/pages/packagedetail/packagedetail?id=' + id,
    })

  },
  upper: function(e) {
    console.log('滚动到顶部')
  },
  lower: function(e) {
    console.log('滚动到底部')
  },
  goToWatch: function(e) {
    let id = e.currentTarget.dataset.zhiboid;
    console.log(e.currentTarget.dataset.zhiboid)
    wx.navigateTo({
      url: '../broadcastplay/broadcastplay?id=' + id,

    })
  },
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '下拉刷新中',
    })
    this.onLoad();
  }

})