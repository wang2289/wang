// pages/integral/integral.js
var app = getApp()
const xnServiceapi = require('../../service/confirmanorder.js');
const xnService = require('../../service/service.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PointsInfo: 0,
    transactions: [],
    flags: true,
    pagenumber: 1,
    pageSize:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    that.MymemberPoint()
    that.PointsExchange()
  },
  MymemberPoint: function () {
    var val = {
      memberId: app.globalData.memberId,
    }
    console.log(val)
    var that = this;
    xnServiceapi.memberPoint(val, function (data) {
      console.log(data)
      that.setData({
        PointsInfo: data.point
      })
    })
  },
  Clickintegral: function () {
    wx.switchTab({
      url: '../h5jifen/h5jifen',
    })
  },
  PointsExchange: function () {
    var that = this;
    var val = {
      currencyCode: 'POT',
      memberId: wx.getStorageSync('memberId'),
     // pageNumber: this.data.pagenumber,
      pageSize:0,
    }
    console.log(val);
    xnService.memberTransactionNew(val, function (res) {
      console.log(res)
      if (res.firstErrorMessage == '') {
        for (var x in res.memberTransactionSummaryList) {
          for (var j in res.memberTransactionSummaryList[x].list) {
            var ManthMany = Math.round(res.memberTransactionSummaryList[x].list[j].changeAmount)
            res.memberTransactionSummaryList[x].list[j].changeAmount = ManthMany
          }
        }
        if (that.data.pagenumber == 1) {
          console.log(1)
          that.setData({
            transactions: res.memberTransactionSummaryList
          })
          if (res.totalCount <= that.data.pagenumber*that.data.pageSize) {
            that.setData({
              flags: false
            })
          }
        }
        else {
          console.log(2)
          that.setData({
            transactions: that.data.transactions.concat(res.memberTransactionSummaryList)
          })
          if (res.memberTransactionSummaryList.length >= that.data.pageSize) {
            that.setData({
              flags: true
            })
          } else {
            that.setData({
              flags: false
            })
          }
        }
      }
      console.log(that.data.transactions)
    })
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
     //   thisobj.PointsExchange();
      }, 500);
    } else {
      // wx.showToast({
      //   title: '没有更多啦',
      // })
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
  console.log('底部')
  }
})