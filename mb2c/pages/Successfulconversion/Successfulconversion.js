// pages/Successfulconversion/Successfulconversion.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    price: '0.00',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      showPoint: options.showPoint,
      price: options.price
    })
    if (options.tab == 1) {
      wx.setNavigationBarTitle({
        title: '兑换成功',
      })
    } else {
      wx.setNavigationBarTitle({
        title: '兑换失败',
      })
    }

  },

  dingdan: function() {
    wx.redirectTo({
      url: '/pages/Pointsrecord/Pointsrecord',
    })
  },

  Homepage: function() {
    wx.switchTab({
      url: '/pages/index/index',
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