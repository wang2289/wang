var app = getApp();
var interval = null;
const xnService = require('../../service/service.js');
const tenantId = require('../../config').tenantId;
var productapi = require('../../service/product.js');
var $ = require('../../utils/util.js');
var storeId = require('../../config.js').storeId;
var personapi = require('../../service/personalcenter.js');
var api = require('../../service/userauthorization.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isReady: false,
    time: '获取验证码', //倒计时 
    mobilePhone:"", //用户的手机号码
    verificationCode:"",//用户获取到的验证码
    verificationCodeId : null,//验证码对应的ID
    currentTime: 61,//当前的倒计时时间
    operatingUnitId: app.globalData.operatingUnitId //默认经营单元id
  },


  onLoad: function () {

  },

  //获取验证码
  getVerificationCode: function () {
    //检验手机号码格式是否合法
    if (!(/^1\d{10}$/.test(this.data.mobilePhone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return;
    }
    //获取验证码所需要的变量
    let vm = {
      mobile : this.data.mobilePhone,
      send: true,
      tenantId: tenantId
    }
    if ((vm.mobilePhone == "")) {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return false;
    }
    var that = this;
    //调用接口获取验证码
    xnService.getVerificationCode(vm, function (res) {
      if (res.firstErrorMessage != '') {
        $.confirm(res.firstErrorMessage);
        return;
      }
      that.setData({
        verificationCodeId: res.id
      });
      that.getCode();
    });
  },

  //用户第一次获取验证码后，页面样式改变
  getCode: function () {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
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
          color: "#EA281A"
        })
      }
    }, 1000)
  },

  //输入手机号码后触发的事件
  mobilePhoneInfo: function (e) {
    if (e.detail.value == "") {
      this.setData({
        isReady: false
      })
    } else {
      this.setData({
        mobilePhone: e.detail.value,
      })
      if (this.data.mobilePhone != "" && this.data.verificationCode != "") {
        this.setData({
          isReady: true
        })
      }
    }
  },

  //输入验证码后触发的事件
  verificationCodeInfo: function (e) {
    if (e.detail.value == "") {
      this.setData({
        isReady: false
      })
    } else {
      this.setData({
        verificationCode: e.detail.value,
      })
      if (this.data.mobilePhone != "" && this.data.verificationCode != "") {
        this.setData({
          isReady: true
        })
      }
    }
  },
  //点击注册按钮
  register : function (){
    if (!this.data.isReady){
      return;
    }
    this.setData({
      isReady: false
    });
    //校验必填的字段是否有符合规范
    if ($.isNull(this.data.mobilePhone)) {
      $.confirm("请输入您的手机号");
      this.setData({
        isReady: true
      })
      return;
    }
    if (!(/^1\d{10}$/.test(this.data.mobilePhone))) {
      $.confirm("请输入正确的手机号");
      this.setData({
        isReady: true
      })
      return;
    }
    if ($.isNull(this.data.verificationCode)) {
      $.confirm("请输入验证码");
      this.setData({
        isReady: true
      })
      return;
    }
    //开始调用接口进行登录操作
    var that = this;
    let vm = {
      tenantId: tenantId,
      mobile: this.data.mobilePhone,
      codeId: this.data.verificationCodeId,
      code: this.data.verificationCode,
      unionId: app.globalData.unionId,
      openType: "WX_OPEN",
    };
    var refereeId = app.getRefereeMemberId();
    if(refereeId){
        vm.refereeType = "MEMBER";
        vm.refereeId = refereeId;
    }

    xnService.loginByVerificationCode(vm, function (res) {
      if (res.firstErrorMessage != '') {
        if (res.firstErrorMessage == '短信验证码ID不能为空'){
          $.confirm("短信验证码有误");
        }else {
          $.confirm(res.firstErrorMessage);
        }
        this.setData({
          isReady: true
        })
        return;
      }else {
        wx.setStorageSync('passportId', res.passport.id);
        wx.setStorageSync('memberId', res.memberId);
        app.globalData.memberId = res.memberId;
        app.globalData.userId = res.userId;
        that.memberDetailIndexget();

      }
    });
  },

  memberDetailIndexget: function () { //获取用户信息
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      storeId: storeId
    }
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



})