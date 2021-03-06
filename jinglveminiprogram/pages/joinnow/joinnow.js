//index.js
//获取应用实例
const app = getApp()
import {
  Config
} from '../../utils/config.js'
const WXAPI = require('../../wxapi/main')
import Toast from 'vant-weapp/toast/toast';
Page({
  data: {
    phonenumber: "",
    disabled: true,
    returnurl: ''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    console.log(options)
    console.log(Config.apiUrl)
    this.setData({
      returnurl: options.returnurl
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
    console.log(this.data.password)
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/[\W]/g, ''),
      cursor: pos,
      
    }
  },
  bindphonenumber: function(e) {
    var value = e.detail.value
    if(value.length === 11){
      this.setData({
        disabled: false,
        phonenumber: e.detail.value
      })
    console.log(this.data.phonenumber)
    } else{
      this.setData({
        disabled: true
      })
    }
  },
  //点击下一步按钮
  nextstep: function(){
    var phonenum= this.data.phonenumber
    var returnurl = this.data.returnurl
    console.log(returnurl)
    if (phonenum.length !== 11){
      Toast.fail("请输入正确位数的手机号")
      return
    }
    var telStr = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
    if (!(telStr.test(phonenum))) {
      Toast.fail("请输入正确的手机号")
      
      return
    }
    wx.request({
      url: Config.apiUrl + '/api/OrgUsers/GetCode', 
      data: {
        Tel: phonenum
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var res = JSON.stringify(res)
        var res1 = res.replace('\n','')
        var res = JSON.parse(res1)
        if(res.data.code== 0){
          Toast.success(res.data.msg);
          console.log(res.data.data)
          wx.navigateTo({
            url: '../smscode/smscode?phonenum=' + phonenum + '&returnurl' + returnurl + '&code=' + res.data.data
          })
        } else {
          Toast.fail(res.data.msg)
          console.log(res.data.data)
        }
      }
    })
    //临时跳转
    
    // WXAPI.joinnowwangxiao({
    //   phonenum: this.data.username,
    // }).then(function (res) {
    //   console.log(res)
    //   if (res.code == 404 || res.code == 700) {
    //     wx.navigateTo({
    //       url: '../smscode/smscode?phonenum=' + phonenum
    //     })
    //   }
      
    // })
  }
})
