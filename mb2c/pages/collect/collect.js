// pages/collect/collect.js
var app = getApp()
const xnServicem = require('../../service/commodity.js');
const xnService = require('../../service/product.js');
var storeId = require('../../config.js').storeId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operatingUnitId: app.globalData.operatingUnitId,
    Collect:[],
    pageNumber: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.CollectInfo();
  },
  CollectInfo:function(){
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      storeId:storeId,
      memberId: app.globalData.memberId,
      systemType: "B2C",
      deviceType: "MOBILE",
      pageNumber: this.data.pageNumber,
      pageSize: 10
    }
    console.log(val)
    var that=this;
    xnServicem.collectionfind(val, function (data) {  //  获取经营单元id
      console.log(data)
      if (data.firstErrorMessage == ''){
        if (that.data.pageNumber < Math.round(data.totalCount / that.data.pageSize)){
          that.setData({
            Collect: that.data.Collect.concat(data.result),
            flags:true
          })
        }else{
          that.setData({
            Collect: that.data.Collect.concat(data.result),
            flags: false
          })
        }
      }
    })
  },
  ClickCollectdel:function(e){
     console.log(e)
     var val = {
       id: e.currentTarget.dataset.id
     }
     console.log(val)
     var that=this;
     xnServicem.collectiondelete(val,function(data){
       console.log(data)
       if (data.firstErrorMessage==""){
         wx.showToast({
           title: '取消收藏成功',
         })
         that.setData({
           Collect:[]
         })
         that.CollectInfo();
       }
     })
  },
  // 点击显示商品详情
  prouclick: function (e) {
    wx.navigateTo({
      url: '../productdetail/productdetail?currentItemId=' + e.currentTarget.dataset.id + '&clazzType=' + e.currentTarget.dataset.clazztype,
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
          pageNumber: parseInt(thisobj.data.pageNumber) + 1
        });
        thisobj.CollectInfo()
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