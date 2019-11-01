const tenantId = require('../../config').tenantId;
const xnService = require('../../service/service.js');
const MD5 = require('../../utils/md5.js');
var app = getApp();
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isInput: false,
    PhoneVal: "",
    passwordVal: "",
    Typenumber: "",
    id: "", //注册获取主键id
    codeInfo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) { //Typenumber==1快速注册
    console.log(options)
    console.log(app)
    app.agreement()
    this.setData({
      Typenumber: options.num,
      codeInfo: options.Code,
      regisTitle: app.globalData.registrationInfo[0].title
    })
    if (options.num == 1) {
      wx.setNavigationBarTitle({
        title: '设置登录密码',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '设置新密码 ',
      })
    }
    var that = this;
    xnService.loginnewId({}, function(data) {
      that.setData({
        id: data
      })
    })
  },
  PhoneInfo: function(e) {
    console.log(e)
    if (e.detail.value == "") {
      this.setData({
        isInput: false
      })
    } else {
      this.setData({
        PhoneVal: e.detail.value,
      })
    }
  },
  passwordInfo: function(e) {
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
  //注册
  loginInfo: function() {
    if ($.isNull(this.data.PhoneVal)) {
      $.confirm("密码不能为空")
      return;
    }
    if (this.data.PhoneVal.length < 6) {
      $.confirm("请输入正确密码")
      return;
    }
    if (this.data.PhoneVal.length > 10) {
      $.confirm("请输入正确密码")
      return;
    }
    console.log(this.data.PhoneVal.length)
    if ($.isNull(this.data.passwordVal)) {
      $.confirm("确认密码不能为空")
      return;
    }
    if (this.data.PhoneVal != this.data.passwordVal) {
      $.confirm("两次输入的密码不一致")
      return;
    }
    var val = {
      id: this.data.id,
      isCustomer: false,
      isDistributor: false,
      isActive: true,
      userNameForAccount: app.globalData.userName,
      loginPassword: this.data.passwordVal,
      tenantId: tenantId,
      name: app.globalData.userName,
      mobilePhone: app.globalData.userName
    };

    var refereeId = app.getRefereeMemberId();
    if(refereeId){
        val.refereeType = "MEMBER";
        val.refereeId = refereeId;
    }

    xnService.register(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        wx.showToast({
          title: '注册成功',
          icon: 'success',
          duration: 3000,
        })
        setTimeout(function() {
          wx.redirectTo({
            url: '../login/login',
          });
        }, 1500)
        console.log('用户点击确定')
      }else{
        $.confirm(data.firstErrorMessage)
      }
    })
  },
  //更改密码
  loginpwd: function() {

    if ($.isNull(this.data.PhoneVal)) {
      $.confirm("新密码不能为空")
      return;
    }
    if (this.data.PhoneVal.length < 6) {
      $.confirm("请输入正确密码")
      return;
    }
    if (this.data.PhoneVal.length > 10) {
      $.confirm("请输入正确密码")
      return;
    }
    if ($.isNull(this.data.passwordVal)) {
      $.confirm("确认密码不能为空")
      return;
    }
    if (this.data.PhoneVal != this.data.passwordVal) {
      $.confirm("两次输入的密码不一致")
      return;
    }
    var val = {
      mobile: app.globalData.userName,
      sourceType:"MEMBER",
      tenantId: tenantId,
      password: MD5.hexMD5(this.data.passwordVal),
      code: this.data.codeInfo,
      verificationType: 'SHORT_MOBILE'
    };
    xnService.updateByVerifyCode(val, function(data) {
        if (data.firstErrorMessage == "") {
          wx.showToast({
            title: '更改成功',
            icon: 'success',
            duration: 3000,
          })
          setTimeout(function() {
            wx.redirectTo({
              url: '../login/login',
            })
          },1500)
          console.log('用户点击确定')
        }
    })
},
registration: function() {
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
onShow: function() {},

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