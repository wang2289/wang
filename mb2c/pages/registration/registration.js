// pages/registration/registration.js
const tenantId = require('../../config').tenantId;
const xnService = require('../../service/service.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registrationInfo:"",
    registration:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var val={
    //   tenantId: tenantId, 
    //   systemType: "B2C"
    // }
    // var that = this;
    // xnService.registrationAgreementNew(val,function(data){
    //   console.log(data)
    //   that.setData({
    //     registrationInfo: data.result[0].description
    //   })
    // })
    //<table style="word-break:break-all; word-wrap:break-all;">
    this.setData({
      registrationInfo: app.globalData.registrationInfo[0].description
    })
    // var content = this.data.registrationInfo.replace(/\<table/gi, '<table  class="tab-class" '); //防止富文本图片过大
    // var contenta = content.replace(/\<td/gi, '<td class="td-class" ');
    
    // this.setData({
    //   registration: registrationInfo
    // })
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