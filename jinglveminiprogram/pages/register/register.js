//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../wxapi/main')
import Toast from 'vant-weapp/toast/toast';
import {
  Config
} from '../../utils/config';
import {
  Token
} from '../../utils/token.js'
Page({
  data: {
    motto: 'Hello 微信小程序',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    ispassword: false,
    eyeimgurl: "../../images/input_eye_hig@2x.png",
    eyeclose: true,
    username: "",
    password: "",
    returnurl: '',
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      returnurl: options.returnurl
    })
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
  onShow: function(){
    this.setData({
      ispassword: true
    })
  },
  getUserInfo: function(e) {
    console.log(e)
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
  bindusername: function(e) {
    var value = e.detail.value
    this.setData({
      username: e.detail.value
    })
    //console.log(this.data.username)
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
  //点击登陆按钮
  loginin: function(){
    var that = this
    if(that.data.username =="" || that.data.password ==""){
      Toast.fail("账号或密码不能为空")
      return
    }
    Toast.loading({
      mask: true,
      duration: 0,
      message: '登录中...'
    });
    
    
    var parms = {
      username: that.data.username,
      password: that.data.password,
      grant_type: 'password',
      client_id: 'weixin',
      client_secret: 'secret',
      classid: Config.classid
    };
    wx.request({
      url: Config.tokenUrl + '/connect/token',
      method: "POST",
      data: parms,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.hasOwnProperty("error")) {
          Toast.clear();
          Toast.fail("账号或密码错误！")
        } else {
          Toast.clear();
          Toast.success({
            mask: false,
            duration: 1500,
            message: "登录成功",
            onClose: function(){
              wx.setStorageSync('userName', that.data.username);
              wx.setStorageSync('userPassword', that.data.password);
              wx.setStorageSync('active', 0);
              let timestamp = Date.parse(new Date());
              wx.setStorageSync('token', res.data.access_token);
              wx.setStorageSync('data_expiration', timestamp + (res.data.expires_in - 60) * 1000);

              if (that.data.returnurl == '') {
                wx.switchTab({
                  url: '../personal/personal',
                })
              } else {
                wx.navigateBack({
                  delta: 1
                })
              }

            }
          })
          

        }

      }
    })
    // WXAPI.logininwangxiao({
    //   username: this.data.username,
    //   password: this.data.password,
    // }).then(function (res) {
    //   console.log(res)
    //   if (res.code == 404 || res.code == 700) {
    //     Toast.clear();
    //     Toast.success("登录成功")
    //     setTimeout(function(){
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     }, 1500)
        
    //     return
    //   }
      
    // })
  },
  //点击立即注册跳转注册页面
  gotojoinnow: function(){
    wx.navigateTo({
      url: '/pages/joinnow/joinnow?returnurl=' + this.data.returnurl
    })
  },
  gotojoinnowbyup: function(){
    wx.navigateTo({
      url: '/pages/joinnowbyup/joinnowbyup'
    })
  },
  getloaginAjax: function (res) {
    console.log(res)
    Toast.clear();
  }
})
