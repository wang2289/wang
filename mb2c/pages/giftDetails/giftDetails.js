// pages/giftDetails/giftDetails.js
var app = getApp()
const requestService = require('../../service/Integralmall.js');
const xnServiceapi = require('../../service/product.js');
const tenantId = require('../../config').tenantId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  index:1,
    operatingUnitId:app.globalData.operatingUnitId,  //经营单元id
    currentItemId:"",  //商品id
    Integrapoint:0,  //积分
    IntegrapictureList:[],  //图片列标配
    IntegraitemList:"",
    repertoryquantity:0 //库存数量
  },
  onSlideChangeEnd: function (e) {
    var that = this;
    that.setData({
      index: e.detail.current + 1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      currentItemId: options.itemid
    });
    if(app.checkLogin()){

        var that=this;
        that.IntegralInfo();
        that.memberPointget();

    }
  },
 IntegralInfo:function(){  // 获取积分详情
   var val={
     id: this.data.currentItemId,
     operatingUnitId: this.data.operatingUnitId,
     systemType: "POINT",
     deviceType: "MOBILE",
     tenantId: tenantId      
   }
   console.log(val)
   var that=this;
   requestService.pointCommodityDetail(val,function(data){
     console.log(data)
     if (data.firstErrorMessage==""){
       var content = data.commodityText.replace(/\<img/gi, '<img class="rich-img" ');; //防止富文本图片过大
        that.setData({
          Integracommodity: data.commodity,
          IntegrapictureList: data.pictureList,
          commodityText:content,
          IntegraitemList: data.itemList,
          repertoryquantity: data.balanceList[0].quantity
        })
     }
   })
 },
  memberPointget:function(){
  var val={
    memberId: app.globalData.memberId
  }
  var that=this;
    requestService.memberPointget(val,function(data){
      console.log(data)
      if (data.firstErrorMessage==""){
     that.setData({
       Integrapoint: data.point
     })
      }
    })
  },
  conversion:function(){
    if(app.checkLogin()){
        wx.navigateTo({
            url: "../Confrimexchange/Confrimexchange?currentItemId=" + this.data.currentItemId + '&item=' + this.data.IntegraitemList[0].itemEbusiness.detailList[0].itemId
        });
    }
  },
  conversionNo:function(){
      app.checkLogin();
  },
  previewImg:function(e){
   console.log(e);
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current:this.data.IntegrapictureList[index],     //当前图片地址
      urls: this.data.IntegrapictureList,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { 
        console.log("成功")
      },
      fail: function (res) { 
        console.log("失败")
      },
    })
  },
  settingNonPassport: function () { //未登录状态下 获取经营单元id
    var val = {
      systemType: "B2C",
      deviceType: "MOBILE",
      tenantId: tenantId,
    }
    var that = this;
    xnServiceapi.settingNonPassport(val, function (data) {
      if (data.firstErrorMessage == '') {
        that.setData({
          operatingUnitId: data.systemSite.operatingUnitId,
        })
        that.IntegralInfo()
        that.memberPointget()
      }
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