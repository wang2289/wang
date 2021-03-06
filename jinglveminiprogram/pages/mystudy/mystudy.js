//index.js
//获取应用实例

const app = getApp()
const WXApi = require('../../wxapi/main')
import {
  Config
} from '../../utils/config';
import {
  Token
} from '../../utils/token.js'
import {
  requestsend,
  requestsendtoken
} from '../../utils/util.js'
import Toast from 'vant-weapp/toast/toast';
Page({
  data: {
    show: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    tabsindex: 1,
    active: 0,
    myshipinglist: [],
    lastlooklist: [],
    questionbanklist: [],
    lastquestionbanklist: [],
    errorlist: [],
    lasterrorlist: [],
    marklist: [],
    lastmarklist: [],
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  goToHome: function() {
    wx.reLaunch({
      url: '../home/home'
    })
  },
  onLoad: function(options) {
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    this.setData({
      active: wx.getStorageSync("active")
    })
  },
  onShow: function() {
    // Toast.loading({
    //   mask: false,
    //   message: '加载中...',
    //   duration: 0
    // });
    this.setData({
      active: wx.getStorageSync("active")
    })
    var token = wx.getStorageSync("token")
    //var token = "123"
    if (token == '') {
      this.setData({
        show: true, //临时修改
      })
    } else {
      this.setData({
        show: false,
      })
      this.getMyCourseList()
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
  changequesbank: function() {
    this.setData({
      tabsindex: 1
    })
  },
  changeerrbook: function() {
    this.setData({
      tabsindex: 2
    })
  },
  markbook: function() {
    this.setData({
      tabsindex: 3
    })
  },
  onChange(event) {
    // wx.showToast({
    //   title: `切换到标签 ${event.detail.index}`,
    //   icon: 'none'
    // });
  },
  gotologin: function() {
    wx.navigateTo({
      url: '/pages/register/register?returnurl=returnurl'
    })
  },
  //获取我的课程列表
  getMyCourseList: function() {
    var params = {}
    requestsendtoken('api/QX/GetMyShiPingAndTiKu', 'GET', params, this.getMyShiPingListAjax)
  },
  getMyShiPingListAjax: function(res) {
    if (res.code == 0) {
      Toast.clear()
      this.setData({
        myshipinglist: res.data.kecheng.mykecheng,
        lastlooklist: res.data.kecheng.lastkecheng,
        questionbanklist: res.data.tiku.mytiku.items,
        lastquestionbanklist: res.data.tiku.mytiku.lasttiku,
        errorlist: res.data.tiku.ctb.items,
        lasterrorlist: res.data.tiku.ctb.lastctb,
        marklist: res.data.tiku.bjt.items,
        lastmarklist: res.data.tiku.bjt.lastbjt
      })
    } else {
      Toast.clear()
      Toast.fail("服务器异常")
    }
  },
  //课程详情页
  gotoCourseDetail: function(e) {
    var aomid = e.currentTarget.dataset.aomid
    var sortid = e.currentTarget.dataset.sortid
    var isbegin = e.currentTarget.dataset.isbegin
    console.log(aomid)
    console.log(sortid)
    if (isbegin) {
      wx.navigateTo({
        url: '/pages/coursedetail/coursedetail?aomid=' + aomid + '&sortid=' + sortid,
      })
    } else {
      Toast("还未开课")
    }
  },
  //跳转题库详情页
  gotoQuestionBankDetail: function(e) {
    var aomid = e.currentTarget.dataset.aomid
    var sortid = e.currentTarget.dataset.sortid
    var isbegin = e.currentTarget.dataset.isbegin
    if (isbegin) {
      wx.navigateTo({
        url: '/pages/tidetail/tidetail?isbuy=true&aomid=' + aomid + '&sortid=' + sortid,
      })
    } else{
      Toast("还未开课")
    }
  },
  gotoQuestionBankErrorDetail: function(e) {
    var aomid = e.currentTarget.dataset.aomid
    var sortid = e.currentTarget.dataset.sortid
    wx.navigateTo({
      url: '/pages/onetidetail/onetidetail?isbuy=true&errormark=1&aomid=' + aomid + '&sortid=' + sortid,
    })
  },
  gotoQuestionBankMarkDetail: function(e) {
    var aomid = e.currentTarget.dataset.aomid
    var sortid = e.currentTarget.dataset.sortid
    wx.navigateTo({
      url: '/pages/onetidetail/onetidetail?isbuy=true&errormark=2&aomid=' + aomid + '&sortid=' + sortid,
    })
  }
})