// pages/Increasedticket/Increasedticket.js
var app = getApp()
const xnServiceapi = require('../../service/certificate.js');
const tenantId = require('../../config').tenantId;
const $ = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Collect: [],
    pageNumber: 1,
    pageSize: 10,
    pagescroll: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.ObtainTicketList()
  },
  AddAddress: function() {
    wx.navigateTo({
      url: '../newcertificate/newcertificate?&striry='+1,
    })
  },
  ObtainTicketList: function() {
    var val = {
      memberId: app.globalData.memberId,
      tenantId: tenantId,
      pageNumber: this.data.pageNumber,
      pageSize: 10
    }
    console.log(val)
    var that = this;
    xnServiceapi.addInvoicefind(val, function(data) {
      console.log(data)
      // if (res.firstErrorMessage == "") {
      //   that.setData({
      //     Collect: res.result,
      //   })
      // }
      if (data.firstErrorMessage == '') {
        
        if (that.data.Collect.length < data.totalCount) {
          if (data.result.length < 10) {
            that.setData({
              Collect: that.data.Collect.concat(data.result),
              pagescroll: 1
              //totalCount: data.totalCount
            })
            // wx.showToast({
            //   title: '没有更多啦',
            // })
          } else {
            that.setData({
              Collect: that.data.Collect.concat(data.Collect),
              pagescroll: 0,
              pageNumber: parseInt(that.data.pageNumber) + 1,
            })
          }
        } else {
          that.setData({
            pagescroll: 1
          })
        }
      }
    })
  },
  scrollbottom: function () { //滚动到底部进行分页
    console.log("112515")
    if (this.data.pagescroll == 0) { //判断是否可以分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
        
      }, 500);
    } else {
      // wx.showToast({
      //   title: '没有更多啦',
      // })
    }
  },
  EditAddress: function(e) {
    console.log(e)
    for (var x in this.data.Collect) {
      if (this.data.Collect[x].id == e.currentTarget.dataset.invoid) {
        var model = JSON.stringify(this.data.Collect[x]);
      }
    }
    wx.navigateTo({
   
      url: '../newcertificate/newcertificate?Collectlist=' + model + "&tab=" + 4,
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
    this.data.pageNumber = 1;
    this.setData({
      Collect:[]
    })
    this.ObtainTicketList()
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