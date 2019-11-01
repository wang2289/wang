// pages/Logisticsdetails/Logisticsdetails.js
const api = require('../../service/confirmanorder.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    prouId: 0,
    orderLogisticsInfo: [],   //物流信息
    ordemass:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      prouId: options.currentItemId
    })
    this.refundDetailNew()
  },
  refundDetailNew: function () {   //  获取物流详情
    var val = {
      id: this.data.prouId
    }
    console.log(val)
    var that = this;
    api.refundDetailNew(val, function (data) {
      console.log("退货详情：",data)
      if (data.firstErrorMessage == "") {
        that.setData({
          orderLogisticsInfo: data.objectLogList,
          ordemass: data.refund,
          pictureUrl: data.pictureUrl
        })
        console.log("daying", that.data.ordemass.status)
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