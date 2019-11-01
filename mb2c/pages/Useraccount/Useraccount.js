// pages/Useraccount/Useraccount.js
var app = getApp();
const requestService = require('../../service/Integralmall.js');
const xnService = require('../../service/service.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    total:'0.00',
    rest:'0.00'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.userAccount();
    this.SelectmemberBalance();
  },
  userAccount:function(){
    var val={
      id: app.globalData.memberId,
    }
    console.log(val)
    var that=this;
    xnService.membership(val,function(res){
      console.log(res)
      that.setData({
        total: res.member.calSpendAmount
      })
    })
  },
//查询可用余额
  SelectmemberBalance: function () {
    var val = {
      memberId: app.globalData.memberId,
    }
    var that = this;
    requestService.memberBalanceget(val, function (data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        that.setData({
          rest: data.balance
        })
      }
    })
  },

  tradingRecord:function(){
    wx.redirectTo({
      url: '../tradingRecord/tradingRecord',
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