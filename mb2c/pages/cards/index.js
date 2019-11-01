// pages/giftCard/giftCard.js
var app = getApp();
var api = require('../../service/personalcenter.js');
var utils = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    rest: '200.00',
    use: '2020年12月31号',
    Giftcarddetails:[],  //礼品卡详情
    GiftcardCount: 0,
    pageSize: 25,
    pageNumber: 1,
    flags:false
  },
  purChase: function() {
    wx.navigateTo({
      url: '../purChase/purChase',
    })
  },
  Binding: function() {
    wx.navigateTo({
      url: '../bindCard/bindCard',
    })
  },
  prePaidCardEntity: function (loadType = 'refresh') {
    var val = {
      memberId: app.globalData.memberId,
      isAvailable: true,
      pageSize: this.data.pageSize,
      pageNumber: this.data.pageNumber,
      bindMemberId: app.globalData.memberId
    }
    var that = this
    api.prePaidCardEntity(val, function (data) {
      console.log(data)
      if (data.result != "") {
        if (that.data.pageNumber < Math.round(data.totalCount / that.data.pageSize)){
          that.setData({
            flags: true
          })
          var Giftcarddetails = that.data.Giftcarddetails;
          if (loadType === 'refresh') {
            that.setData({
              Giftcarddetails: data.result,
              GiftcardCount: data.totalCount
            })
          } else if (loadType === 'push') {
            that.setData({
              Giftcarddetails: Giftcarddetails.concat(data.result),
              GiftcardCount: data.totalCount,
              pageNumber: that.data.pageNumber + 1
            })
          }
        }else{
          that.setData({
            flags: false
          })
          var Giftcarddetails = that.data.Giftcarddetails;
          if (loadType === 'refresh') {
            that.setData({
              Giftcarddetails: data.result,
              GiftcardCount: data.totalCount
            })
          } else if (loadType === 'push') {
            that.setData({
              Giftcarddetails: Giftcarddetails.concat(data.result),
              GiftcardCount: data.totalCount,
              pageNumber: that.data.pageNumber + 1
            })
          }
        }
      } else {
        // wx.showModal({
        //   title: '提示',
        //   content: data.firstErrorMessage,
        // })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.prePaidCardEntity('refresh')
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
    // var pageNumber = this.data.pageNumber + 1;
    // var GiftcardCount = this.data.totalCount;
    // var pageSize = this.data.pageSize;
    // if (pageNumber > Math.round(GiftcardCount / pageSize)) {
    //   wx.showToast({
    //     title: '没有更多啦！',
    //   })
    //   return false;
    // }
    // this.prePaidCardEntity('push');
  },
  scrollbottom: function () { //滚动到底部进行分页
    console.log("112515")
    console.log(this.data.flags)
    if (this.data.flags) { //判断是否可以分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          pagenumber: parseInt(thisobj.data.pagenumber) + 1
        });
        thisobj.prePaidCardEntity('push');
      }, 500);
    } else {
      // wx.showToast({
      //   title: '没有更多啦',
      // })
    }
  }
})