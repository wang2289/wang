
   // pages/orders/show.js
const utils = require('../../utils/util.js');
const requestService = require('../../service/request.js');
const api = require('../../service/confirmanorder.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      index:1,
    order_id: '',
    isCurriculum: false,
    canRefund: true,
    bannerAutoPlay: true,
    IntegrapictureList: [],  //图片列标配
      IntegraitemList:"",
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
  onLoad: function(options) {
    var that = this;
    var order_id = options.order_id;
    if (!order_id) {
      // 订单异常点击确定后返回上一个页面
      utils.confirm('订单异常！', function() {
        wx.navigateBack();
      });
    }

    this.setData({
      order_id: order_id
    });

    this.ordersShowRequest(order_id); // 订单详情
    this.orderLogistics(order_id); // 订单物流信息
  },
  /**
   * 订单详情
   */
  ordersShowRequest: function(order_id) {
    var that = this;
    var params = {
      method: 'orders.show',
      id: order_id
    };
    console.log(params);
    requestService.request(params, function(res) {
      console.log(res)
      var order = res.order;
      var orderShipoing = {};
      //区分课程商品的订单
      if (order.classType =='CURRICULUM'){
       //课程商品订单 不能退货
        that.setData({
          isCurriculum: true,
          canRefund:false
        });
        
      }else{
        orderShipoing = res.orderShipping;
        that.setData({
          contactName: orderShipoing.contactName,
          contactPhone: orderShipoing.contactPhone,
          address: orderShipoing.provinceName + orderShipoing.cityName + orderShipoing.districtName + orderShipoing.address,
        });
      }
      var orderLineList = res.order.orderLineList;
      console.log(res);
      var payment = res.payment;

      var orderStatus = '未知';
      if (order.status == 'UN_PAID') {
        orderStatus = '待付款';
      } else if (order.status == 'UN_SHIPMENT') {
        orderStatus = '待发货';
      } else if (order.status == 'UN_SIGNED') {
        orderStatus = '待收货';
      } else if (order.status == 'SIGNED') {
        orderStatus = '待评价';
      } else if (order.status == 'EVALUATION') {
        orderStatus = '已评价';
      } else if (order.status == 'CANCELLED') {
        orderStatus = '已取消';
      } else if (order.status == 'WAIT_GROUP') {
        orderStatus = '待拼团';
      }

      that.setData({
        orderId: order.id,
        orderNumber:order.number,
        orderStatus: orderStatus,
        orderLineList: orderLineList,
        goodsAmount: order.goodsAmount,
        freightFee: order.freightFee,
        freeAmount: order.freeAmount,
        pointAmount: order.pointAmount,
        orderTime: utils.formatTime1(order.time),
        DetailsInfo: order,
        IntegrapictureList: res.advertList
      });
      if (payment == undefined || payment == null || payment == '') {
        
        that.setData({
          totalAmount: order.paidAmount,
        })
      } else {
        that.setData({
          totalAmount: order.paidAmount,
          paymentLineList: payment.paymentLineList,
        })
      }
    });
  },

  /**
   *  获取订单物流信息
   */
  orderLogistics: function(order_id) {
    var val = {
      id: order_id
    }
    var that = this;
    api.orderLogisticsNew(val, function(data) {
      if (data.firstErrorMessage == "") {
        if (data.orderLogisticsList && data.orderLogisticsList.length > 0 && data.orderLogisticsList[0].logisticsStatus != '') {

          var orderLogistcsStatus = data.orderLogisticsList[0].logisticsStatus;
          var orderLogisticsContent = data.orderLogisticsList[0].logisticsDetailList[0].context;

          that.setData({
            orderLogistcsStatus: orderLogistcsStatus,
            orderLogisticsContent: orderLogisticsContent
          })
        }
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
    bannerAutoPlay: true
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    bannerAutoPlay: false
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

  link: function (e) {
    bannerAutoPlay: false;
    var linkUrl = e.target.dataset.linkUrl;

    console.log(linkUrl);
    if (linkUrl.indexOf("http")==-1){
      wx.showToast({
        title: "路径不合法",
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.navigateTo({
      url: `/pages/orders/link/link?linkUrl=${linkUrl}`
    });
  },
})