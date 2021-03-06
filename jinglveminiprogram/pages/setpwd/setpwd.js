//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../wxapi/main')
import Toast from 'vant-weapp/toast/toast';
import { checkusername, checkpassword, checkrepassword} from '../../utils/common.js'
import {
  Config
} from '../../utils/config.js';
import {
  Token
} from '../../utils/token.js'
import {requestsend} from '../../utils/util.js'
Page({
  data: {
    ispassword: true,
    isconformpassword: true,
    eyeimgurl: "../../images/input_eye_hig@2x.png",
    conformeyeimgurl: "../../images/input_eye_hig@2x.png",
    eyeclose: true,
    conformeyeclose: true,
    //phonenum: "",
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
  onLoad: function (options) {
    var that = this;
    that.setData({
      username: options.phonenum,
      returnurl: options.returnurl
    })
    console.log(that.data.username)
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
  // bindusername: function(e) {
  //   var value = e.detail.value
  //   var pos = e.detail.cursor
  //   if (pos != -1) {
  //     //光标在中间
  //     var left = e.detail.value.slice(0, pos)
  //     //计算光标的位置
  //     pos = left.replace(/11/g, '2').length
  //   }
  //   this.setData({
  //     username: value.replace(/[\W]/g, '')
  //   })
  //   //console.log(this.data.username)
  //   return {
  //     value: value.replace(/[\W]/g, ''),
  //     cursor: pos,

  //   }
  // },
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
      message: '设置中...'
    });
    var that = this
    var phonenum = that.data.username
    //var phonenum = 18761605668
    var password = that.data.password
    var conformpassword = that.data.conformpassword
    checkpassword(password)
    checkrepassword(password, conformpassword)
    var params = {
      UserName: phonenum,
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
          that.login(res)
          // Toast.success({
          //   mask: false,
          //   duration: 1500,
          //   message: res.data.msg,
          //   onClose: function () {

          //     var pages = getCurrentPages();
          //     var prevPage = pages[pages.length - 2]
          //     var parms = {
          //       username: that.data.phonenum,
          //       //username: 18761605668,
          //       password: that.data.password,
          //       grant_type: 'password',
          //       client_id: 'weixin',
          //       client_secret: 'secret',
          //       classid: Config.classid
          //     };
          //     wx.request({
          //       url: Config.tokenUrl + '/connect/token',
          //       method: "POST",
          //       data: parms,
          //       header: {
          //         "content-type": "application/x-www-form-urlencoded"
          //       },
          //       success: function (res) {
          //         if (res.data.hasOwnProperty("error")) {
          //           Toast.clear();
          //           Toast.fail("账号或密码错误！")
          //         } else {
          //           Toast.clear();
          //           Toast.success({
          //             mask: false,
          //             duration: 1500,
          //             message: "登录成功",
          //             onClose: function () {
          //               wx.setStorageSync('userName', that.data.username);
          //               wx.setStorageSync('userPassword', that.data.password);
          //               let timestamp = Date.parse(new Date());
          //               wx.setStorageSync('token', res.data.access_token);
          //               wx.setStorageSync('data_expiration', timestamp + (res.data.expires_in - 60) * 1000);

          //               if (that.data.returnurl == '') {
          //                 wx.switchTab({
          //                   url: '../personal/personal',
          //                 })
          //               } else {
          //                 wx.navigateBack({
          //                   delta: 4
          //                 })
          //               }

          //             }
          //           })


          //         }

          //       }
          //     })
          //     //console.log(res)
          //     prevPage.setData({
          //       username: username
          //     })
          //     wx.navigateBack({
          //       delta: 1
          //     })
          //   }
          // });
        } else {
          Toast.fail({
            mask: false,
            duration:1500,
            message: res.data.msg
          })
        }
        
      },
      fail: function (error) {
        Toast.fail("服务器异常")
      }
    })
    //requestsend('api/OrgUsers/RegUser','POST',params,this.reguserAjax)
  },
  login: function(res){
    var that = this
    Toast.success({
      mask: false,
      duration: 1500,
      message: res.data.msg,
      onClose: function () {

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]
        console.log(that)
        var parms = {
          username: that.data.username,
          //username: 18761605668,
          password: that.data.password,
          grant_type: 'password',
          client_id: 'weixin',
          client_secret: 'secret',
          classid: Config.classid
        };
        console.log(parms)
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
                onClose: function () {
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
                      delta: 4
                    })
                  }

                }
              })


            }

          }
        })
        //console.log(res)
        // prevPage.setData({
        //   username: username
        // })
        // wx.navigateBack({
        //   delta: 4
        // })
      }
    });
  }
})
