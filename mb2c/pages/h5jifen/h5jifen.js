// pages/h5jifen/h5jifen.js
var webviewsrcone = require('../../config.js').webviewsrcone;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webviewsrcone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadPage();
  },
  loadPage : function(){
    var url = "https://" + webviewsrcone + '/mpoint/index.htm';
    if (wx.getStorageSync("passportId")) {
      url = url + "?xnPassportId=" + wx.getStorageSync("passportId");
    }
    console.log(url);

    this.setData({
      url: url
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
    this.loadPage();
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