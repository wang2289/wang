// pages/consumptionrecords/consumptionrecords.js
var app = getApp()
const xnService = require('../../service/service.js');
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberTranList: [],
    pagenumber: 1,
    pagesize: 10,
    flags:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.consumptionRecords()
  },
  consumptionRecords: function (e) {
    var val = {
      typeList:['SPEND','SPEND_RE'],
      memberId: app.globalData.memberId,
      // pageNumber: this.data.pagenumber,
      pageSize: 0
    }
    console.log(val)
    var that = this;
    xnService.findMemberSummaryTransaction(val, function (res) {
      console.log(res)
      if (res.firstErrorMessage == '') {
        // if (that.data.pagenumber < Math.round(res.totalCount / that.data.pagesize)) {
        //     that.setData({
        //       memberTranList: that.data.memberTranList.concat(res.memberTransactionShowList),
        //       flags:true
        //     })
        //   }else{
        //     that.setData({
        //       memberTranList: that.data.memberTranList.concat(res.memberTransactionShowList),
        //       flags:false
        //     })
        //   }
        for (var i in res.result) {
          res.result[i].transactionTime = utils.formatTime1(res.result[i].transactionTime)
        }
        that.setData({
          memberTranList: res.result,
        })
      }
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
        thisobj.consumptionRecords()
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

  }
})