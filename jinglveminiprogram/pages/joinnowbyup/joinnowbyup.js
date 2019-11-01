//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../wxapi/main')
import Toast from 'vant-weapp/toast/toast';
import { checkusername, checkpassword, checkrepassword} from '../../utils/common.js'
import {
  Config
} from '../../utils/config';
import {
  Token
} from '../../utils/token.js'
import {requestsend} from '../../utils/util.js'
Page({
  data: {
    motto: 'Hello 微信小程序',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ispassword: false,
    isconformpassword: false,
    eyeimgurl: "../../images/input_eye_hig@2x.png",
    conformeyeimgurl: "../../images/input_eye_hig@2x.png",
    eyeclose: true,
    conformeyeclose: true,
    username: "",
    password: "",
    conformpassword: "",
    returnurl: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
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
  getUserInfo: function(e) {
    //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  checkinput: function(e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    if (pos != -1) {
      //光标在中间
      var left = e.detail.value.slice(0, pos)
      //计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    this.setData({
      password: value.replace(/[\W]/g, '')
    })
    //console.log(this.data.password)
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/[\W]/g, ''),
      cursor: pos,
      
    }
  },
  conformcheckinput: function(e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    if (pos != -1) {
      //光标在中间
      var left = e.detail.value.slice(0, pos)
      //计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    this.setData({
      conformpassword: value.replace(/[\W]/g, '')
    })
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/[\W]/g, ''),
      cursor: pos,
      
    }
  },
  bindusername: function(e) {
    var value = e.detail.value
    var pos = e.detail.cursor
    if (pos != -1) {
      //光标在中间
      var left = e.detail.value.slice(0, pos)
      //计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    this.setData({
      username: value.replace(/[\W]/g, '')
    })
    //console.log(this.data.username)
    return {
      value: value.replace(/[\W]/g, ''),
      cursor: pos,

    }
  },
  changeeye: function(){
    //console.log(123)
    if(this.data.eyeclose){
      this.setData({
        eyeclose: false,
        ispassword: false,
        eyeimgurl: "../../images/input_eye_nor@2x.png"
      })
    } else {
      this.setData({
        eyeclose: true,
        ispassword: true,
        eyeimgurl: "../../images/input_eye_hig@2x.png"
      })
    }
  },
  conformchangeeye: function(){
    //console.log(123)
    if(this.data.conformeyeclose){
      this.setData({
        conformeyeclose: false,
        isconformpassword: false,
        conformeyeimgurl: "../../images/input_eye_nor@2x.png"
      })
    } else {
      this.setData({
        conformeyeclose: true,
        isconformpassword: true,
        conformeyeimgurl: "../../images/input_eye_hig@2x.png"
      })
    }
  },
  //点击注册按钮
  joinnowbyup: function(){
    Toast.loading({
      mask: true,
      duration: 0,
      message: '登录中...'
    });
    var that = this
    var username = that.data.username
    var password = that.data.password
    var conformpassword = that.data.conformpassword
    checkusername(username)
    checkpassword(password)
    checkrepassword(password, conformpassword)
    var params = {
      UserName: username,
      UserPwd: password,
      ClassId: Config.classid
    } 
    //console.log(params)
    var url = Config.apiUrl + '/' + 'api/OrgUsers/RegUser';
    wx.request({
      url: url,
      data: params,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        Toast.clear();
        if(res.data.code == 0){
          Toast.success({
            mask: false,
            duration: 1500,
            message: res.data.msg,
            onClose: function () {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2]
              //console.log(res)
              prevPage.setData({
                username: username
              })
              wx.navigateBack({
                delta: 1
              })
            }
          });
        } else {
          Toast.fail({
            mask: false,
            duration:1500,
            message: res.data.msg
          })
        }
        
      },
      fail: function (error) {
        Toast.fail("服务器出现问题,请稍后重试")
      }
    })
    //requestsend('api/OrgUsers/RegUser','POST',params,this.reguserAjax)
  },
})
