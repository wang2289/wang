//index.js
//获取应用实例
const app = getApp()
import Toast from 'vant-weapp/toast/toast';
import Dialog from 'vant-weapp/dialog/dialog';
Page({
  data: {
    motto: 'Hello 微信小程序',
    userInfo: {
      avatarUrl: "../../images/nologin.png",
      nickName: "未登录",
    },
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nologin: true,
    show: false,
    removelogin: false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function() {
    console.log("pageshow")
    var token = wx.getStorageSync("token")
    //var token = "123"
    if (token == '') {
      this.setData({
        show: true,
        nologin: true,
        removelogin: false
      })
    } else {
      this.setData({
        show: false,
        nologin: false,
        removelogin: true
      })
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
  gotoregister: function(e) {
    var token = wx.getStorageSync("token")
    //var token = "123"
    if (token == '') {
      this.setData({
        show: true,
        nologin: true,
        removelogin: false
      })
    } else {
      wx.navigateTo({
        url: '../register/register'
      })
    }

  },
  gotomycourse: function() {
    var token = wx.getStorageSync("token")
    //var token = "123"
    if (token == '') {
      this.setData({
        show: true,
        nologin: true,
        removelogin: false
      })
    } else {
      wx.setStorageSync('active',0);
      wx.switchTab({
        url: '/pages/mystudy/mystudy'
      })
    }
  },
  gotomyquestionbank: function() {
    var token = wx.getStorageSync("token")
    //var token = "123"
    if (token == '') {
      this.setData({
        show: true,
        nologin: true,
        removelogin: false
      })
    } else {
      wx.setStorageSync('active', 1);
      wx.switchTab({
        url: '/pages/mystudy/mystudy'
      })
    }
  },
  gotomycollect: function() {
    var token = wx.getStorageSync("token")
    //var token = "123"
    if (token == '') {
      this.setData({
        show: true,
        nologin: true,
        removelogin: false
      })
    } else {
      wx.navigateTo({
        url: '/pages/mycollect/mycollect'
      })
    }
  },
  //跳转购物车
  gotodashboard: function(){
    var token = wx.getStorageSync("token")
    if (token == '') {
      this.setData({
        show: true,
        nologin: true,
        removelogin: false
      })
    } else {
      // Toast.success("去购物车")
      wx.navigateTo({
        url: "/pages/cart/cart"
      })
    }
  },
  //跳转我的订单
  gotomyorder: function(){
    var token = wx.getStorageSync("token")
    if (token == '') {
      this.setData({
        show: true,
        nologin: true,
        removelogin: false
      })
    } else {
      wx.navigateTo({
         url: "/pages/myorder/myorder"
      })
    }
  },
  //跳转在线客服
  gotoonlineserver: function(){
   
  },
  gotologin: function() {
    wx.navigateTo({
      url: '/pages/register/register?returnurl=returnurl'
    })
  },
  //解绑账号
  removelogin: function(){
    Dialog.confirm({
      title: '解绑账号',
      message: '确认解绑账号?'
    }).then(() => {
      // on confirm
      wx.removeStorageSync('userName')
      wx.removeStorageSync('userPassword')
      wx.removeStorageSync('token')
      wx.removeStorageSync('data_expiration')
      var token = wx.getStorageSync("token")
      //var token = "123"
      if (token == '') {
        this.setData({
          show: true,
          nologin: true,
          removelogin: false
        })
      }
    }).catch(() => {
      // on cancel
    });
    

  }
})