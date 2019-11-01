 // pages/coupon/coupon.js
var app = getApp()
const xnService = require('../../service/product.js');
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponInfo: [], //未使用优惠券列表
    notUseCouponList: [], //未使用
    usedCouponList: [], //已使用
    failureSoonCouponList: [], //即将过期
    failureCouponList: [], //已经过期
    tapindex: 1,
    isAvailable: true,
    pagenumber: 1,
    pageSize: 10,
    flags: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.couPonList()
  },
  scrollbottom: function() { //滚动到底部进行分页
    console.log("112515")
    console.log(this.data.flags)
    if (this.data.flags) { //判断是否可以分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          pagenumber: parseInt(thisobj.data.pagenumber) + 1
        });
        thisobj.couPonList();
      }, 500);
    } else {
      // wx.showToast({
      //   title: '没有更多啦',
      // })
    }
  },
  couPonList: function() {
    var val = {
      memberId: app.globalData.memberId,
    //  pageNumber: this.data.pagenumber,
      pageSize: 0,

      systemTypeList: ['ALL', 'B2C'],
    }
    if (this.data.tapindex == 1) {
      val.isAvailable = true
    }
    if (this.data.tapindex == 2) {
      val.isUsed = true
    }
    if (this.data.tapindex == 3) {
      val.isUsed = false
      val.isUsefulEndOut = true
    }
    console.log(val)
    var that = this;
    xnService.couponListNew(val, function(data) {
      console.log(data)
      console.log(data.totalCount)
      if (data.firstErrorMessage == '') {
        for (var x in data.result) {   //转换json
          data.result[x].profitConfig = JSON.parse(data.result[x].profitConfig)
        }
        // if (data.result.length >= 10) {
        //   that.setData({
        //     flags: true
        //   })
        //   if (that.data.tapindex == 1) {
        //     that.setData({
        //       notUseCouponList: that.data.notUseCouponList.concat(data.result)
        //     })
        //     console.log(that.data.notUseCouponList)
        //   }
        //   if (that.data.tapindex == 2) {
        //     that.setData({
        //       usedCouponList: that.data.usedCouponList.concat(data.result)
        //     })
        //   }
        //   if (that.data.tapindex == 3) {
        //     that.setData({
        //       failureCouponList: that.data.failureCouponList.concat(data.result)
        //     })
        //   }
        // } else {
        //   that.setData({
        //     flags: false
        //   })
        //   if (that.data.tapindex == 1) {
        //     that.setData({
        //       notUseCouponList: that.data.notUseCouponList.concat(data.result)
        //     })
        //   }
        //   if (that.data.tapindex == 2) {
        //     that.setData({
        //       usedCouponList: that.data.usedCouponList.concat(data.result)
        //     })
        //   }
        //   if (that.data.tapindex == 3) {
        //     that.setData({
        //       failureCouponList: that.data.failureCouponList.concat(data.result)
        //     })
        //   }
        // }
        if (that.data.tapindex == 1) {
            that.setData({
              notUseCouponList: that.data.notUseCouponList.concat(data.result)
            })
          }
          if (that.data.tapindex == 2) {
            that.setData({
              usedCouponList: that.data.usedCouponList.concat(data.result)
            })
          }
          if (that.data.tapindex == 3) {
            that.setData({
              failureCouponList: that.data.failureCouponList.concat(data.result)
            })
          }
      }
    })
  },
  allOrders: function() { //全部订单
    this.setData({
      tapindex: 1,
      pagenumber: 1,
      pageSize: 10,
      notUseCouponList: [],
      usedCouponList: [],
      failureCouponList: []
    });
    this.couPonList()
  },
  toBePaid: function() { //待付款
    this.setData({
      tapindex: 2,
      pagenumber: 1,
      pageSize: 10,
      notUseCouponList: [],
      usedCouponList: [],
      failureCouponList: []
    });
    this.couPonList()
  },
  receiptOfGoods: function() { //待发货
    this.setData({
      tapindex: 3,
      pagenumber: 1,
      pageSize: 10,
      notUseCouponList: [],
      usedCouponList: [],
      failureCouponList: []
    });
    this.couPonList()
  },
  Tousethe: function() {
    // wx.switchTab({
    //   url: '../productcenter/productcenter',
    // })
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