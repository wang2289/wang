// pages/Pointsrecord/Pointsrecord.js
const requestService = require('../../service/request.js');
const tenantId = require('../../config.js').tenantId;
var api = require('../../service/confirmanorder.js');
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exchangeData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.pointExchangeRequest();
  },

  /**
   * 积分兑换记录接口
   */
  pointExchangeRequest: function() {
    var that = this;
    var params = {
      method: 'point.exchange',
      memberId: wx.getStorageSync('memberId'),
      systemType: 'POINT',
      isPaid: true,
      mobileType: 'MOBILE',
      tenantId: tenantId
    };
    console.log(params);

    requestService.request(params, function(res) {
      console.log(res)
      if (res.firstErrorMessage == '') {
        that.setData({
          exchangeData: res.result
        });
      }
    });
  },
  confirmReceipt: function(e) {
    console.log(e)
    var val = {
      id: e.currentTarget.dataset.order_id,
      signType:'MANUAL',
      rowVersion: e.currentTarget.dataset.row_version
    }
    var that = this;
    api.ordersign(val, function(data) {
      if (data.firstErrorMessage == '' && data.result){
          $.confirm('收货成功');
        that.pointExchangeRequest()
      }else{
        $.confirm(data.firstErrorMessage)
      }
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