//index.js
//获取应用实例
const app = getApp()
const WXAPI = require('../../wxapi/main')
import Toast from 'vant-weapp/toast/toast';
import {
  Config
} from '../../utils/config.js'
Page({
  data: {

    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    phonenum: "",
    time: 60,
    code: null,
    reget: false,
    topTips: false,
    code_isFocus: true, //控制input 聚焦
    code: [],
    focus_status: [],
    length: 0, //已经输入的长度
    returnurl: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function(options) {
    var that = this;
    console.log(options)
    that.setData({
      phonenum: options.phonenum,
      returnurl: options.returnurl
    })
    console.log(that.data.phonenum)
    //倒计时函数
    that.getCode();
    that.set_Focus();
  },


  //验证码输入时获取验证码
  get_code: function(e) {
    var that = this;
    that.setData({
      code: e.detail.value
    });
    if (that.data.code.length == 0) {
      that.setData({
        focus_status: "100000"
      });
    }
    if (that.data.code.length == 1) {
      that.setData({
        length: e.detail.value.length,
        focus_status: "010000"
      });
    }
    if (that.data.code.length == 2) {
      that.setData({
        length: e.detail.value.length,
        focus_status: "001000"
      });
    }
    if (that.data.code.length == 3) {
      that.setData({
        length: e.detail.value.length,
        focus_status: "000100"
      });
    }
    if (that.data.code.length == 4) {
      that.setData({
        length: e.detail.value.length,
        focus_status: "000010"
      });
    }
    if (that.data.code.length == 5) {
      that.setData({
        length: e.detail.value.length,
        focus_status: "000001"
      });
    }
    if (that.data.code.length == 6) {
      that.setData({
        length: e.detail.value.length
      })
      console.log(that.data.code)
      console.log(that.data.phonenum)
      // 模拟跳转到设定密码
      //http://192.168.1.72:5001 群哥本地
      wx.request({
        url: Config.apiUrl + '/api/OrgUsers/CheckCode',
        data: {
          Tel: that.data.phonenum,
          code: that.data.code
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          if (res.data.code == 0) {
            wx.navigateTo({
              url: '/pages/setpwd/setpwd?phonenum=' + that.data.phonenum + '&returnurl=' + that.data.returnurl,
            })
          } else {
            Toast.fail(res.data.msg)
          }

        },
        // fail(res){
        //   Toast.fail("服务器错误")
        // }
      })
      // WXAPI.joinnowbysmscode({
      //   smscode: that.data.code
      //   }).then(
      //     function(res){
      //       if (res.code == 404 || res.code == 700) {
      //         wx.navigateBack({
      //           delta: 2
      //         })
      //       }  
      //     }
      //   )

    }
  },
  set_Focus: function() { //聚焦focus
    var that = this
    that.setData({
      code_isFocus: true
    })
  },
  //倒计时函数
  getCode: function() {
    var that = this;
    var currentTime = that.data.time
    var interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: "",
          currentTime: 11,
          disabled: false,
          reget: true,
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  //重新获取验证码
  reGetCode: function() {
    var that = this
    var phonenum = that.data.phonenum
    var returnurl = that.data.returnurl
    that.setData({
      time: 60,
      reget: false
    })
    
    wx.request({
      url: 'http://192.168.1.72:5001/api/OrgUsers/GetCode',
      data: {
        Tel: phonenum
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var res = JSON.stringify(res)
        var res1 = res.replace('\n', '')
        var res = JSON.parse(res1)
        if (res.data.code == 0) {
          Toast.success(res.data.msg);
          console.log(res.data.data)
          // wx.navigateTo({
          //   url: '../smscode/smscode?phonenum=' + phonenum + '&returnurl' + returnurl + '&code=' + res.data.data
          // })
        } else {
          Toast.fail(res.data.msg)
          console.log(res.data.data)
        }
      }
    })
    var currentTime = that.data.time
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime,
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: "",
          // currentTime: 11,
          // disabled: false,
          reget: true,
          currentTime: 61,
          // disabled: false
        })
      }
    }, 1000)
  },
})