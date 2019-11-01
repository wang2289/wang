// pages/paymentpassword/paymentpassword.js
var interval = null;
var app = getApp()
const xnService = require('../../service/service.js');
const tenantId = require('../../config').tenantId;
const MD5 = require('../../utils/md5.js');
const xmService = require('../../service/security.js');
var $ = require('../../utils/util.js')
Page({
  data: {
    send: true,
    alreadySend: false,
    second: 60,
    // disabled: true,
    // buttonType: 'default',
    phoneNum: '',
    code: '',
    mobilePhone: "",
    sutry:"",
    getcode:'获取验证码'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)
    this.setData({
      mobilePhone: app.globalData.mobilePhone,
      sutry: options.sutry
    })
  },

  // 手机号部分
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value
    console.log(phoneNum)
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.hideSendMsg()
    }
  },

  checkPhoneNum: function (phoneNum) {
    console.log(phoneNum)
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        image: '../../img/fail.png'
      })
      return false
    }
  },

  showSendMsg: function () {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },

  hideSendMsg: function () {
    this.setData({
      send: true,
      // disabled: true,
      // buttonType: 'default'
    })
  },

  sendMsg: function () {
    if (this.data.phoneNum.length!==11){
      $.confirm("请输入11位手机号码");
      return;
    }
    if (this.data.phoneNum !== app.globalData.mobilePhone) {
      $.confirm("与当前账户不一致");
      return;
    }

    var val = {
      mobilePhone: this.data.phoneNum,
      type:'CHECK',
      tenantId: tenantId
    }
    console.log(val)
    var that = this;
    xnService.mobileVerificationCode(val, function (e) {
      console.log(e)
      if (e.firstErrorMessage!=""){
        $.confirm(e.firstErrorMessage)
        return;
      }else{
      that.setData({
        alreadySend: true,
        send: false
      })
      }
      that.timer()
    })
  },

  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send:true,
              getcode: "重新获取"
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  // 验证码
  addCode: function (e) {
    this.setData({
      code: e.detail.value
    })
   // this.activeButton()
    console.log('code' + this.data.code)
  },

  // 按钮
  // activeButton: function () {
  //   let { phoneNum, code } = this.data
  //   console.log(code)
  //   if (phoneNum && code) {
  //     this.setData({
  //       disabled: false,

  //     })
  //   } else {
  //     this.setData({
  //       disabled: true,
  //       buttonType: 'default'
  //     })
  //   }
  // },

  onSubmit: function () {
    if ($.isNull(this.data.phoneNum) && this.data.phoneNum.length<11){
       $.confirm('请输入正确手机号')
       return;
     }
    if ($.isNull(this.data.code) && this.data.code.length <4) {
      $.confirm('请输入正确验证码')
      return;
     }
    var val = {
      mobilephone: this.data.phoneNum,
      code: this.data.code,
      type: 'SHORT_MOBILE',
      tenantId: tenantId
    }
    console.log(val)
    var that = this;
    xnService.mobileVerificationCodecheck(val, function (res) {
      console.log(res)
      if (res.firstErrorMessage != "") {
        $.confirm(res.firstErrorMessage)
        return;
      }
    if (res.isVerificated) {
        wx.showToast({
          title: '验证成功',
          icon: 'success'
        })
        wx.navigateTo({
          url: '../Sixpass/sixpass?sutry=' + that.data.sutry,
        })
      } else {
        wx.showToast({
          title: '验证码错误',
          image: '../../img/fail.png'
        })
      }
      // fail: function(res) {
      //   console.log(res)
      // }

    })
  }
})
