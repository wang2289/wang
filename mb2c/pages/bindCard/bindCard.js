// pages/bindCard/bindCard.js
var app = getApp();
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    electroniccardInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  electroniccard: function(e) {  //获取电子卡密号
    console.log(e)
    this.setData({
      electroniccardInfo: e.detail.value
    })
  },
  checkrest:function(){   //查询余额

  },
  bindgift:function(){  //绑定新卡

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