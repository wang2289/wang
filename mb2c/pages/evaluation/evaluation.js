// pages/evaluation/evaluation.js
const tenantId = require('../../config').tenantId;
const requestService = require('../../service/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPictureCount: 0,
    allCommentCount: 0,
    comments: [],
    pictures: [
      'http://5b0988e595225.cdn.sohucs.com/images/20171127/7f3e10af404e4b0aba88447d55e3b6d6.jpeg',
      'http://5b0988e595225.cdn.sohucs.com/images/20171127/8a6380c3c84f47c5a3c1c795e2955d67.jpeg',
      'http://s15.sinaimg.cn/mw690/00707H0Qzy7geFtwNQObe&690'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    this.getCommentCount();
    // var params = {
    //   method: 'goods.comments.index',
    //   tenantId: tenantId,
    // }

    // requestService.request(params, function (res) {
    //   var comments = res.result;

    // });
  },

  getCommentCount: function () {
    var params = {
      method: 'goods.comments.count',
      operatingUnitId: app.globalData.operatingUnitId,
      systemType: 'B2C',
      deviceType: 'mobile',
      tenantId: tenantId,
    };

    requestService.request(params, function (res) {
      console.log(res);return;
    });
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

  },


  /**
   * 点击放大图片
   */
  onShowBigImageTap: function(event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})