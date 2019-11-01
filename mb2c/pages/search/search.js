// pages/search/search.js
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    val:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  startinput: function (e) {
    this.setData({
      val: e.detail.value
    });
  },
  search: function () {
    var thisobj = this;
 
      if (!$.isNull(thisobj.data.val)) {
        console.log(thisobj.data.val)
        wx.setStorage({
          key: 'orderNum',
          data: thisobj.data.val,
        })
        wx.switchTab({
          url: "../productcenter/productcenter",
          fail: function (data) {
            console.log("跳转失败!", data);
          }
        })
      } else {
        $.confirm("请输入商品名称");
      }
   
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