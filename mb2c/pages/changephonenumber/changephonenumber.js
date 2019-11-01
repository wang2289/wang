// pages/changephonenumber/changephonenumber.js
var app=getApp();
var interval;
const xnService = require('../../service/service.js');
const tenantId = require('../../config').tenantId;
Page({

  /**
   * 页面的初始数
   */
  data: {
    showViews: false,
    disabled: "",
    time:'获取验证码',
    PhoneVal:'',
    mobilePhone:'',
    currentTime:60,
    flag:false,
    passwordVal: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.setData({
      mobilePhone: app.globalData.mobilePhone
    })
      this.verify();
     
  },
  changephone:function(){
    wx.navigateTo({
      url: '../bindcellphone/bindcellphone',
    })
  },
  verify: function () {//获取验证码
console.log("1234545454")
    if (!(/^1\d{10}$/.test(this.data.mobilePhone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return;
    }
    var thobj = this
    var val = {
      mobilePhone: thobj.data.mobilePhone,
      type: 'SELF',
      tenantId: tenantId,
      memberId: app.globalData.memberId
    }
    console.log(val)
    var that=this;
    xnService.mobileVerificationCode(val, function (res) {
      console.log("获取登陆页面相关服务数据", res)
      if (res.firstErrorMessage=="")
      {
        that.getCode()
      }
      else
      {
        wx.showToast({
          title: '请稍后再试',
          image: '../../img/fail.png'
        })
      }
 
    });
  },
  getCode: function (options) {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })

      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false,
          showViews: true,
          flag:true
        })
      }
    }, 1000)
  },
  passwordInfo: function (e) {
    console.log(e)
    if (e.detail.value == "") {
      this.setData({
        isInput: false
      })
    } else {
      this.setData({
        passwordVal: e.detail.value,
      })
    }

  },
  nextstep: function () {
    var vas = {
      code: this.data.passwordVal,
      type: 'SHORT_MOBILE',
    }
    console.log(vas)
    var that = this;
    xnService.mobileVerificationCodecheck(vas, function (res) {
      console.log(res)
      if (res.isVerificated) {
        
        wx.navigateTo({
                url: '../bindcellphone/bindcellphone?num=' + 0 + "&Code=" + that.data.passwordVal,

              })
            } else {
        wx.showModal({
          title: '提示',
          content: '验证码错误',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }
    })
  },
  
    

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})