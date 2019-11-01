// pages/supplier/supplier.js
var app = getApp()
var $ = require('../../utils/util.js')
const xnService = require('../../service/product.js');
const tenantId = require('../../config').tenantId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    introductionActive:false,
    categoryInfo:[],
    supplierId: null, 
    commodityList:[],
    operatingUnitId: app.globalData.operatingUnitId, //经营单元id
    pageSize: 10,
    pageNumber: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      supplierId: options.supplierId
    })
    var that= this;
    var request = {
      id:  options.supplierId
    }
    xnService.getSupplier(request, function (data) { //  获取供应商信息
      that.setData({
        supplier: data.supplier,
      })
    })

    var vas = {
      tenantId: tenantId,
      type: 'STANDARD',
      supplierId: options.supplierId
    }
    xnService.allCategoryShow(vas, function (data) { //页面初始化 
      if (data.result && data.result.length>0) {
        data.result[0].selected = true;
        that.setData({
          categoryInfo: data.result,
          categoryID: data.result[0].id
        })
      }else{
        return;
      }

      that.findCommodityByCategoryId();

      
    })

  },

  tabIntroduction:function(){   
    this.setData({
      introductionActive:!this.data.introductionActive
    })
  }, 
  /**
   *  
   *   commodityList:[],
   */
  seletCategory: function (e) { //点击获取类别商品类别的商品信息
    console.log(e)
    let _this = this;
    var categoryInfo = this.data.categoryInfo;
    for (var i = 0; i < categoryInfo.length;i++){
      if (categoryInfo[i].id == e.currentTarget.dataset.id){
        categoryInfo[i].selected = true;
      }else{
        categoryInfo[i].selected = false;
      }
    }
    this.setData({
      commodityList: [],
      categoryID: e.currentTarget.dataset.id,
      categoryInfo: categoryInfo,
      pageNumber: 1
    },function(){
      _this.findCommodityByCategoryId();
    })
   
  },
  seletCommodity: function (e) { //点击获取类别商品类别的商品信息
    this.setData({
      flag: false
    })
    wx.navigateTo({
      url: '../productdetail/productdetail?currentItemId=' + e.currentTarget.dataset.id + '&clazzType=' + e.currentTarget.dataset.clazztype,
    })
  },
  findCommodityByCategoryId: function () { //初始化拉取类别商品信息
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      pageNumber: this.data.pageNumber,
      pageSize: this.data.pageSize,
      tenantId: tenantId,
      clazzType: this.data.clazzType,
      supplierId: this.data.supplierId
    };
    if (app.globalData.memberId != '') {
      val.memberId = app.globalData.memberId
    }
    if (this.data.categoryID != '') {
      val.categoryIds = [this.data.categoryID]
    }
    console.log(val)
    var _this = this;
    $.loading()
    xnService.findCommodityExtend(val, function (data) {
      if (data.firstErrorMessage == "") {
        $.hideloading();
        let commodityList=_this.data.commodityList;
        for(let i=0;i<data.result.length;i++){
          commodityList.push(data.result[i]);
        }
         _this.setData({
           commodityList: commodityList,
           totalCount: Number(data.totalCount)
          })
       
      }else{
        $.hideloading();
        $.confirm(data.firstErrorMessage);
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
    let _this=this;
    let { totalCount, pageSize, pageNumber}=this.data;
    const maxPage = Math.ceil(totalCount/pageSize);
    console.log("maxPage",maxPage)

    if (maxPage == pageNumber) {
      return ;
     
    } else {
      pageNumber++;
      this.setData({
        pageNumber: pageNumber,
      })
      this.findCommodityByCategoryId();
    }
  }
})