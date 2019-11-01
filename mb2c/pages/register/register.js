// pages/register /register .js
var interval = null;
var app = getApp()
const xnService = require('../../service/service.js');
const tenantId = require('../../config').tenantId;
const MD5 = require('../../utils/md5.js');
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '获取验证码', //倒计时 
    showViews: true,
    disableds: "",
    currentTime:61,
    PhoneVal: "",
    passwordVal: "",
    passimageVal: "",
    isInput: false,
    Typenumber: 0,
    passimage: "",
    IDENTITY_VERIFY: "",
    UId: "",
    typeInfo:"",
    regisTitle:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app)
    console.log(options)
    app.agreement()
    this.setData({
      disableds: "disabled",
      Typenumber: options.num,
      regisTitle: app.globalData.registrationInfo[0].title || ''
    })
    if (options.num == 1) {
      wx.setNavigationBarTitle({
        title: '注册',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '忘记密码',
      })
    }
    var that = this;
    xnService.ImageVerification({}, function(data) {
      console.log(data)
      that.setData({
        passimage: 'data:image/png;base64,' + data.verifyCode.img,
        UId: data.verifyCode.uID
      })
    })
    
  },
  clickpassimage: function() {
    var that = this;
    xnService.ImageVerification({}, function(data) {
      that.setData({
        passimage: 'data:image/png;base64,' + data.verifyCode.img,
        UId: data.verifyCode.uID
      })
    })
  },
  verify: function() { //获取验证码
    if (!(/^1\d{10}$/.test(this.data.PhoneVal))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
   
    var thobj = this
    if (thobj.data.Typenumber == 0) {
      this.setData({
        typeInfo:"CHECK"
      })
    }else{
      this.setData({
        typeInfo: "REGISTER"
      })
    }
    var val = {
      mobilePhone: thobj.data.PhoneVal,
      type: thobj.data.typeInfo,
      tenantId: tenantId
    }
    console.log(val)
    app.globalData.userName = thobj.data.PhoneVal
    xnService.mobileVerificationCode(val, function(res) {
      if (res.firstErrorMessage != '') {
        $.confirm(res.firstErrorMessage);
        return;
      }
      thobj.getVerificationCode()
    });
  },
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function() {
      currentTime--;
      that.setData({
        time: currentTime + 's',
        color: '#999999',
      })

      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false,
          showViews: true,
          color:"#EA281A"
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    if ((this.data.inputphone == "")) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }

      })
      return false;
    }
    this.getCode();

    var that = this
    that.setData({
      disabled: true,
      showViews: false,
    })
  },
  PhoneInfo: function(e) {
    console.log(e)
    if (e.detail.value == "") {
      // this.setData({
      //   isInput: false
      // })
    } else {
      this.setData({
        PhoneVal: e.detail.value,
      })
    }
    if (this.data.PhoneVal != "" && this.data.passwordVal != "" && this.data.passimageVal != "") {
      this.setData({
        isInput: true
      })
    }
  },
  passwordInfo: function(e) {
    console.log(e)
    if (e.detail.value == "") {
      // this.setData({
      //   isInput: false
      // })
    } else {
      this.setData({
        passwordVal: e.detail.value,
      })
    }
    if (this.data.PhoneVal != "" && this.data.passwordVal != "" && this.data.passimageVal != "") {
      this.setData({
        isInput: true
      })
    }
  },
  passimage: function(e) {
    console.log(e)
    if (e.detail.value == "") {
      // this.setData({
      //   isInput: false
      // })
    } else {
      this.setData({
        passimageVal: e.detail.value,
      })
      if (this.data.PhoneVal != "" && this.data.passwordVal != "" && this.data.passimageVal != "") {
        this.setData({
          isInput: true
        })
      }
    }

  },
  nextstep: function() {
    if ($.isNull(this.data.PhoneVal)) {
      $.confirm("请输入您的手机号")
      return;
    }
    console.log($.isNull(this.data.PhoneVal))
    if (!(/^1\d{10}$/.test(this.data.PhoneVal))) {
      $.confirm("请输入正确的手机号")
      return;
    }
    if ($.isNull(this.data.passwordVal)) {
      $.confirm("请输入验证码")
      return;
    }
    if ($.isNull(this.data.passimageVal)) {
      $.confirm("请输入图形验证码")
      return;
    }
    console.log($.isNull(this.data.passwordVal))
    var vas = {
      code: this.data.passwordVal,
      type: 'SHORT_MOBILE',
    }
    console.log(vas)
    var that = this;
    xnService.mobileVerificationCodecheck(vas, function(res) {
      console.log(res)
      if (res.isVerificated==true) {
        var par = {
          code: that.data.passimageVal,
          id: that.data.UId
        }
        console.log(par)
        xnService.Imagecheck(par, function(res) {
          console.log(res)
          if (res.verified==true) {
            if (that.data.Typenumber == 1) {
              wx.navigateTo({
                url: '../loginpassword/loginpassword?num=' + 1,
              })
            } else {
              wx.navigateTo({
                url: '../loginpassword/loginpassword?num=' + 0 + "&Code=" + that.data.passwordVal,
              })
            }
          } else{
            $.confirm("图形验证码错误");
            that.clickpassimage();
            return;
          }
        })
      } 
      else {
        $.confirm("验证码错误");
        that.clickpassimage();
        return;
      }
      // else {
      //   wx.showModal({
      //     title: '提示',
      //     content: '校验失败',
      //     showCancel: false,
      //     success: function(res) {
      //       if (res.confirm) {
      //         console.log('用户点击确定')
      //       }
      //     }
      //   })
      // }
    })
  },
  registration: function () {
    wx.navigateTo({
      url: '../registration/registration',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})