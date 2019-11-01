// pages/Accountsecurity/Accountsecurity.js
var app = getApp();
var personapi = require('../../service/personalcenter.js');
var $ = require('../../utils/util.js');
var productapi = require('../../service/product.js');
var api = require('../../service/userauthorization.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:"",
    mobilePhone:"",
    sutry:"",
    operatingUnitId: app.globalData.operatingUnitId //获取经营单元id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app)
  this.setData({
    account: app.globalData.account,
    mobilePhone: app.globalData.mobilePhone,
    sutry: options.sutry
  })
  },
  changepassword: function () {
    wx.navigateTo({
      url: '../changepassword/changepassword',
    })
  },
  changephonenumber: function () {
    wx.navigateTo({
      url: '../changephonenumber/changephonenumber',
    })
  },
  paymentpassword:function(){
    wx.navigateTo({
      url: '../paymentpassword/paymentpassword?sutry=' + this.data.sutry,
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