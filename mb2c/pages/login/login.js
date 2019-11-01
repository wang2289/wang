// pages/login/login.js
var app = getApp()
const xnService = require('../../service/service.js');
const tenantId = require('../../config').tenantId;
const MD5 = require('../../utils/md5.js');
var $ = require('../../utils/util.js');
var api = require('../../service/userauthorization.js');
var personapi = require('../../service/personalcenter.js');
var productapi = require('../../service/product.js');
var storeId = require('../../config.js').storeId

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInput: false,
    PhoneVal: "",
    passwordVal: "",
    username: "",
    password: '',
    operatingUnitId: app.globalData.operatingUnitId //获取经营单元id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)

  },
  PhoneInfo: function (e) {
    console.log(e)
    if (e.detail.value == "") {
      this.setData({
        isInput: false
      })
    } else {
      this.setData({
        PhoneVal: e.detail.value,
      })
      if (this.data.PhoneVal != "" && this.data.passwordVal != "") {
        this.setData({
          isInput: true
        })
      }
    }
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
      if (this.data.PhoneVal != "" && this.data.passwordVal != "") {
        this.setData({
          isInput: true
        })
      }
    }
  },
  login: function () {
    let _this=this;

    if ($.isNull(this.data.PhoneVal)) {
      $.confirm("请输入您的手机号")
      return;
    }
    if (!(/^1\d{10}$/.test(this.data.PhoneVal))) {
      $.confirm("请输入正确的手机号")
      return;
    }
    if ($.isNull(this.data.passwordVal)) {
      $.confirm("请输入密码")
      return;
    }
    var vm = {
      mobilePhone: this.data.PhoneVal,
      password: MD5.hexMD5(this.data.passwordVal),
      tenantId: tenantId
    }
    var that = this;
    xnService.login(vm, function (data) {
      if (!$.isNull(data.id)) {
        that.setData({
          isInput: false
        });
        wx.setStorageSync('passportId', data.id);
        wx.setStorageSync('memberId', data.memberId);
        app.globalData.memberId = data.memberId;
        app.globalData.userId = data.userId;
        that.securityuserOauthcreate();
      } else {
        $.confirm(data.errors[0].message);
        that.setData({
          isInput: true
        });
        return;
      }
    })



  },
  register: function () {
    wx.navigateTo({
      url: '../register/register?num=' + 1,
    })
  },
  register1: function () {
    wx.navigateTo({
      url: '../register/register?num=' + 0,
    })
  },
  //验证码登录
  loginByVerificationCode: function () {
    wx.navigateTo({
      url: '/pages/loginByVerificationCode/loginByVerificationCode',
    })
  },

  securityuserOauthcreate: function () { //手动登录   存储用户信息
    var val = {
      userId: app.globalData.userId, //用户ID
      tenantId: tenantId, //承租人ID 测试环境为852769418315444224
      openId: app.globalData.unionId, //接口1返回的
      openType: "WX_OPEN", //写死的值
    }
    var that = this;
    api.securityuserOauthFind(val, function (data) {
      if (data.firstErrorMessage == "" && data.totalCount == 0) {
        api.securityuserOauthcreate(val, function (res) {
          if (res.firstErrorMessage == "") {
          }
        })
      }
    })
    that.memberDetailIndexget();
  },
  memberDetailIndexget: function () { //获取用户信息
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      storeId: storeId
    }
    console.log(val)
    var that = this;
    personapi.memberDetailIndexget(val, function (data) {

      if (data.firstErrorMessage == "") {
        app.globalData.userId = data.user.id;
        app.globalData.account = data.user.account;
        app.globalData.memberId = data.member.id;
        app.globalData.mobilePhone = data.member.mobilePhone;
        app.globalData.imId = data.user.imId;
        wx.setStorageSync('imid', data.user.imId);
    
        wx.switchTab({
          url: '../index/index',
        })
      } else {
        $.confirm(data.message);
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
    // this.operatingUnit();
    app.getOperatingUnitId()
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