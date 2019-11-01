// pages/changepassword/changepassword.js
const xnServiceful= require('../../service/security.js');
const tenantId = require('../../config').tenantId;
const xnService = require('../../service/service.js');
const MD5 = require('../../utils/md5.js');
var $ = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldpwd:"",
    newpwd:"",
    newpwd2:"",
    id: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    xnService.loginnewId({}, function (data) {
      that.setData({
        id: data
      })
    })
    this.setData({
      mobilePhone: app.globalData.mobilePhone
    })
  },
  changepassword:function(){
    if ($.isNull(this.data.oldpwd)) {
      $.confirm("原密码不能为空")
      return;
    }
    if ($.isNull(this.data.newpwd)) {
      $.confirm("新密码不能为空")
      return;
    }
    if (this.data.newpwd.length < 6) {
      $.confirm("请输入正确的新密码")
      return;
    }
    if (this.data.newpwd.length >10) {
      $.confirm("请输入正确的新密码")
      return;
    }
    if (this.data.newpwd == this.data.oldpwd) {
      $.confirm("新密码与原密码不能一致")
      return;
    }
    
    if ($.isNull(this.data.newpwd2)) {
      $.confirm("请确认密码")
      return;
    }
    if (this.data.newpwd !== this.data.newpwd2){
      $.confirm("两次的密码输入不一致")
      return;
    }
    var val = {
      id:this.data.id,
      oldPassword: MD5.hexMD5(this.data.oldpwd).toString(),
      password: MD5.hexMD5(this.data.newpwd).toString(),
    }
    console.log(val);
    var that = this;
    xnServiceful.loginPassword(val, function (e) {
      console.log(e)
      if (e.firstErrorMessage != '') {
        $.confirm(e.firstErrorMessage);
        return;
      }else{
        wx.showToast({
          title: '设置成功',
          duration: 3000,
        })
        setTimeout(function () {
      //     wx.redirectTo({
      //     url: '../Accountsecurity/Accountsecurity',
      // })
      wx.navigateBack({
        delta:-1
      })
        }, 1500)
        
      }
    })
  },
  previouspassword: function (e) {
    console.log(e)
    this.setData({
      oldpwd: e.detail.value,
    })
  },
  currentpassword: function (e) {
    console.log(e)
    this.setData({
      newpwd: e.detail.value,
    })
  },
  confirmpassword: function (e) {
    console.log(e)
    this.setData({
      newpwd2: e.detail.value,
    })
  },
  // forSubmit:function(e){
  //   console.log(e)
  //   var oldpwd=e.detail.value.oldpwd;
  //   var newpwd = e.detail.value.newpwd;
  //   var newpwd2 = e.detail.value.newpwd2;

  //   if(oldpwd=="" || newpwd==""|| newpwd2==""){
  //     wx.showToast({
  //       title: '密码不能为空',
  //       duration:1000
  //     })
  //   }
  //   else if(newpwd !=newpwd2){
  //     wx.showToast({
  //       title: '两次密码输入不一致',
  //       duration:1000
  //     })
  //   }
  //   else{
  //     that.changepassword()
  //   }
  // },
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