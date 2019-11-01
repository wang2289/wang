// pages/paymentsuccess/paymentsuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 0,
    goodsAmount: 0, //商品总额
    paystatus:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      tab: options.tab,
      firstErrorMessage: options.firstErrorMessage,
      goodsAmount: options.goodsAmount
    })
    if (options.tab == 1) {
      this.setData({
        tab:1
      })
      wx.setNavigationBarTitle({
        title: "支付成功"
      })
    } 
     if(options.tab == 2) {
      this.setData({
        tab: 2
      })
      wx.setNavigationBarTitle({
        title: "支付失败"
      })
    }

  },
  dingdan: function() {
    wx.redirectTo({
      url: '../orders/index',
    })
  },
  Homepage: function() {
    wx.switchTab({
      url: '../index/index',
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