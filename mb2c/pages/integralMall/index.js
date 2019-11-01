// pages/integralMall/index.js
const requestService = require('../../service/request.js');
const tenantId = require('../../config').tenantId;
const xnServiceapi = require('../../service/product.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    isNoData: false,
    products: [],
    totalCount: 0,
    pageNumber: 1,
    pageSize: 10,
    categoryId:'',
    pagescroll: -1,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      categoryId: options.categoryId
    });
    if(!app.checkLoginNoJump()){
        this.settingNonPassport();
    } else {

        var that = this;

        that.productApiRequest('setData');

    }

  },

  scrollbottom: function (event) {
    var pageNumber = this.data.pageNumber;
    var totalCount = this.data.totalCount;
    var pageSize = this.data.pageSize;
    if (this.data.pagescroll != 0) {
      // wx.showToast({
      //   title: '没有更多啦！',
      // })
      return false;
    }
    this.productApiRequest('concatData', pageNumber);
  },

  productApiRequest: function (loadDataType = 'setData', pageNumber) {
    this.setData({
      pagescroll: 1,
      
    })
    var that = this;
    var pageSize = this.data.pageSize;
    // 请求产品列表接口
    var params = {
      method: 'IntegralMall.index',
      categoryId: that.data.categoryId,
      tenantId: tenantId,
      systemType: "POINT",
      deviceType: "MOBILE",
      type: "POINT",
      operatingUnitId: that.data.operatingUnitId,
      pageNumber: that.data.pageNumber,
      pageSize: pageSize
    };
    console.log(params)
    requestService.request(params, function (res) {
      console.log(res)
      var isNoData = false;
      var totalCount = res.totalCount;
      var productsData = [];
      var productsDataTemp = that.data.products;
      if (res.result.length >=10) {
        productsData = res.result;
        that.setData({
            pageNumber:that.data.pageNumber + 1,
            pagescroll:0,
        })
      } else {
        productsData = res.result;
        that.setData({
          pagescroll: -1,
        })
        // wx.showToast({
        //   title: '没有更多啦！',
        // })
      }
      if (loadDataType == 'setData') {
        that.setData({
          products: productsData,
          isNoData: isNoData,
          totalCount: totalCount
        });
      } else if (loadDataType == 'concatData') {
        that.setData({
          products: productsDataTemp.concat(productsData),
          pageNumber: pageNumber
        });
      }
    });
  },
  settingNonPassport: function () { //未登录状态下 获取经营单元id
    var val = {
      systemType: "B2C",
      deviceType: "MOBILE",
      tenantId: tenantId,
    }
    var that = this;
    xnServiceapi.settingNonPassport(val, function (data) {
      console.log(data)
      if (data.firstErrorMessage == '') {
        that.setData({
          operatingUnitId: data.systemSite.operatingUnitId,
        })
        that.productApiRequest('setData');
      }
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
 //   this.productApiRequest('setData');
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