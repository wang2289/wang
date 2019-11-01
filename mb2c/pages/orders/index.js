const requestService = require('../../service/request.js');
const utils = require('../../utils/util.js');
const api = require('../../service/confirmanorder.js');
const xnService = require('../../service/product.js');
const service = require('../../service/service.js');
var $ = require('../../utils/util.js');
const MD5 = require('../../utils/md5.js');
const appId = require('../../config').appId;
var storeId = require('../../config.js').storeId
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tapIndex: 'ALL', //默认选中第一个
    menus: { // 切换菜单
      // 'ALL': '全部',
      'UN_PAID': '待付款',
      'UN_SHIPMENT': '待发货',
      'UN_SIGNED': '待收货',
      'SIGNED': '待评价',
      'EVALUATION': '退售后'
    },
    orders: [],
    pageNumber: 1,
    pageIndex: 'ALL',
    totalCount: 0,
    pageSize: 10,
    Length: 6, //输入框个数  
    isFocus: true, //聚焦  
    Value: "", //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。  
    flagm: false,
    payment: false, //控制支付模态框
    Pay: 0,
    mergePayId: "",
    openID: "",
    idList: '',
    Price: '',
    options: [],
    ordersInfo:[],
    pagescroll: -1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      options: options,
      orders: []
    })
    console.log(this.data.options)
    var memberId = app.globalData.memberId
    // if (!memberId) {
    //   wx.showToast({
    //     title: '登录信息异常！',
    //     duration: 2000,
    //     success: function () {
    //       setTimeout(function () {
    //         wx.redirectTo({
    //           url: '/pages/login/login',
    //         })
    //       }, 2000);
    //     }
    //   })
    //   return false;
    // }

    this.data.memberId = memberId;
    if (options.status == 'EVALUATION'){
      this.refundfind()
      this.setData({
        tapIndex: options.status
      })
    }else{

      var status = this.data.options.status ? this.data.options.status : null;
      this.setData({
        tapIndex: status
      })
      this.ordersIndexRequest();

    }
  
  },
  looklogistics: function(e) {
    this.setData({
      prouId: e.currentTarget.dataset.prouid
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
    var memberId = app.globalData.memberId
    // if (!memberId) {
    //   wx.showToast({
    //     title: '登录信息异常！',
    //     duration: 2000,
    //     success: function () {
    //       setTimeout(function () {
    //         wx.redirectTo({
    //           url: '/pages/login/login',
    //         })
    //       }, 2000);
    //     }
    //   })
    //   return false;
    // }
    if (app.globalData.typefalg){
      this.data.memberId = memberId;
      if (this.data.options.status == 'EVALUATION') {
        this.refundfind()
        this.setData({
          tapIndex: this.data.options.status,
          pageNumber: 1,
          orders: [],
        })
      } else {
        var status = this.data.options.status ? this.data.options.status : null;
        this.setData({
          tapIndex: status,
          pageNumber: 1,
          orders: [],
        })
        this.ordersIndexRequest();
        // this.ordersIndexRequest('reSetData', status);
      }
}
     
     


    
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
    this.scrollTop();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.scrollbottom();
  },



  /**
   * Change menu active style
   */
  onChangeMenuActiveTap: function(event) {
    var index = event.target.dataset.index;
    console.log(index)
    this.data.pageIndex = index;
    this.data.pageNumber = 1;
    this.data.totalCount = 0;
    var status = null;
    if (index=='EVALUATION'){
      this.setData({
        tapIndex: index,
        orders: [],
        pageNumber: 1,
      });
      this.refundfind()
     
    }else{
      if (index !== 'ALL') {
        status = index;
      }
      
      this.setData({
        tapIndex: index,
        orders: [],
        pageNumber: 1,
      });
      this.ordersIndexRequest();
    }
  },

  // scrollbottom: function (event) {
  //   var pageNumber = this.data.pageNumber + 1;
  //   var totalCount = this.data.totalCount;
  //   var pageSize = this.data.pageSize;
  //   if (pageNumber > Math.round(totalCount / pageSize)) {
  //     wx.showToast({
  //       title: '没有更多啦！',
  //     })
  //     return false;
  //   }
  //   var pageIndex = null;
  //   if (this.data.pageIndex !== 'ALL') {
  //     pageIndex = this.data.pageIndex;
  //   }
  //   this.ordersIndexRequest('concatData', pageIndex, pageNumber)
  // },

  /**
   * Orders index request
   */
  // ordersIndexRequest: function(loadDataType = 'reSetData', status = null, pageNumber = 1) {
  //   var that = this;
  //   var memberId = this.data.memberId;
  //   var pageSize = this.data.pageSize;
  //   // 请求订单列表接口
  //   var params = {
  //     method: 'orders.index',
  //     memberId: memberId,
  //     isReturn: false,
  //     deviceType: null,
  //     // pageNumber: pageNumber,
  //     pageSize: 0,
  //     status: status,
  //     systemType: "B2C"
  //   }
  //   console.log(params)
  //   requestService.request(params, function(res) {
  //     console.log(res)
  //     if (res.code && res.code == 21) {
  //       utils.confirm('登录信息有误，请重新登录！');
  //     }
  //     var isNoData = false;
  //     var totalCount = res.totalCount;
  //     var ordersData = [];
  //     var ordersDataTemp = that.data.orders;
  //     if (totalCount > 0) {
  //       ordersData = res.result;
  //     } else {
  //       isNoData = true;
  //     }
  //     if (loadDataType == 'reSetData') {
  //       that.setData({
  //         orders: ordersData,
  //         isNoData: isNoData,
  //         totalCount: totalCount,
  //         tapIndex: status ? status : 'ALL'
  //       });
  //     } else if (loadDataType == 'concatData' && ordersData.length > 0) {
  //       that.setData({
  //         orders: ordersData,
  //         pageNumber: pageNumber
  //       });
  //     }
  //   });
  // },
  ordersIndexRequest:function(){
    var memberId = this.data.memberId;
    var params = {
      method: 'orders.index',
      memberId:memberId,
      isFullReturn : false,
      deviceType: null,
      pageNumber: this.data.pageNumber,
      pageSize: 10,
      status: this.data.tapIndex,
      systemType: "B2C"
    }
       console.log(params)
       var that =this
    requestService.request(params, function(data) {
      console.log(data)
      if (data.firstErrorMessage == '') {
        app.globalData.typefalg = false;
        if (that.data.orders.length < data.totalCount) {
          if (data.result.length < 10) {
            that.setData({
              orders: that.data.orders.concat(data.result),
              pagescroll: 1
              //totalCount: data.totalCount
            })
            // wx.showToast({
            //   title: '没有更多啦',
            // })
          } else {
            that.setData({
              orders: that.data.orders.concat(data.result),
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
  /**
   * Orders sign request
   */
  ordersSignRequest: function(order_id = null, rowVersion) {
    var that = this;
    var params = {
      method: 'orders.sign',
      id: order_id,
      type: 'MEMBER',
      rowVersion: rowVersion
    };
    requestService.request(params, function(res) {
      if (!res.result) {
        utils.confirm('确认收货失败，请重试！');
      }
      utils.confirm('确认收货成功！', function() {
        var status = null;
        if (that.data.pageIndex !== 'ALL') {
          status = that.data.pageIndex;
        }
        that.setData({
          tapIndex: that.data.pageIndex,
          pageIndex: that.data.pageIndex,
          pageNumber: 1,
          orders: []
        });
        that.ordersIndexRequest();
      });
    });
  },

  /**
   * Cancel orders request
   */
  cancelOrderRequest: function(order_id = null, row_version) {
    var that = this;
    var params = {
      method: 'orders.cancel',
      id: order_id,
      type: 'MEMBER',
      rowVersion: row_version
    };
    requestService.request(params, function(res) {
      if (!res.result) {
        utils.confirm('取消订单失败，请重试！');
      }
      utils.confirm('取消订单成功！', function() {
        var status = null;
        if (that.data.pageIndex !== 'ALL') {
          status = that.data.pageIndex;
        }
        that.setData({
          tapIndex: that.data.pageIndex,
          pageIndex: that.data.pageIndex,
          pageNumber: 1,
          orders: []
        });
        that.ordersIndexRequest();
      });
    });
  },

  /**
   * confirm receipt goods
   */
  bindConfirmReceiptTap: function(event) {
      var that = this;
      $.confirm('是否确定收货', function(res) {
          if (res.confirm) {
              var order_id = event.target.dataset.order_id;
              var row_version = event.target.dataset.row_version;
              if (!order_id) {
                  utils.confirm('订单信息异常！');
              }
              that.ordersSignRequest(order_id, row_version);
          }
      }, true)
  },

  /**
   * Cancel order
   */
  onCancelOrderTap: function(event) {
    console.log("取消订单的event事件：",event);
    //获取到交互产生的formId
    var formId = event.detail.formId;
    //将产生的formId记录到数据库中
    if (formId != null && formId != '' && formId !='the formId is a mock one') {
      service.createWechatAppForm({ accountId: app.globalData.accountId, formType: 'FORM', formId: formId, openId: app.globalData.openId, totalCount: 1 }, function (data) {
        console.log(data)
        if (data.firstErrorMessage == "") {
        }
      })
    }
    var order_id = event.detail.target.dataset.order_id;
    var row_version = event.detail.target.dataset.row_version;
    if (!order_id) {
      utils.confirm('订单信息异常！');
    }

    this.cancelOrderRequest(order_id, row_version);
  },
  bindimg: function() { //关闭支付模态框
    this.setData({
      flagm: false
    })
  },
  //去付款
  suitZhifu: function(e) {
    var formId = e.detail.formId;
    //将产生的formId记录到数据库中
    if (formId != null && formId != '' && formId != 'the formId is a mock one') {
      service.createWechatAppForm({ accountId: app.globalData.accountId, formType: 'FORM', formId: formId, openId: app.globalData.openId, totalCount: 1 }, function (data) {
        console.log(data)
        if (data.firstErrorMessage == "") {
        }
      })
    }
    console.log(e)
    this.setData({
      payment: true,
      isDisabled: true,
      top: "10000rpx",
      Value: "",
      idList: e.detail.target.dataset.id,
      Price: e.detail.target.dataset.price,
    })
  },
  balancepaid: function() { //余额支付方式
    this.setData({
      Pay: 1,
      payment: false,
      Value: ""
    })
    this.orderMergePayNews()
  },
  WeChatPay: function() { //微信支付方式
    this.setData({
      Pay: 2,
      payment: false,
      Value: ""
    })
    this.gotopay()
  },
  bindimgs: function() {
    this.setData({
      payment: false
    })
  },
  Focus(e) {
    var that = this;
    //console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      fromValue: inputValue,
      Value: inputValue,
    })
    if (that.data.fromValue.length == 6) {
      // that.setData({
      //   flagm: false
      // })
      that.mergeAccountPaid()
    }
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    //console.log(e.detail.value.password);
  },
  orderMergePayNews: function() { //余额支付
    var val = {
      userId: app.globalData.userId
    }
    var that = this;
    xnService.transaction_password(val, function(data) {
      console.log(data)
      if (data.verifyResult) {
        var val = {
          orderIdList: [that.data.idList],
          payType: "ACCOUNT",
          storeId: storeId,
        }
        api.orderMergePayNews(val, function(data) {
          if (data.id != "") {
            that.setData({
              flagm: true,
              mergePayId: data.id,
            })
          }
        })
      } else {
        wx.navigateTo({
          url: '../Accountsecurity/Accountsecurity?sutry=' + 3,
        })
      }
    })

  },
  mergeAccountPaid: function() {
    var val = {
      mergePayId: this.data.mergePayId,
      transactionPassword: MD5.hexMD5(this.data.fromValue)
    }
    console.log(val)
    var that = this;
    $.loading()
    api.mergeAccountPaid(val, function(data) {
      $.hideloading()
      console.log(data)
      if (data.result) {
        that.setData({
          Value: '',
          flagm:false,
        })
        wx.redirectTo({
          url: '../paymentsuccess/paymentsuccess?tab=' + 1 + '&goodsAmount=' + that.data.Price,
        })
        // that.setData({
        //   orders: []
        // })
        // that.ordersIndexRequest()
        $.confirm('支付成功')
      } else {
        that.setData({
          Value: '',
        })
        if (data.firstErrorMessage == "交易密码不正确") {
        } else {
          that.setData({
            flagm: false,
          })
        }
        // wx.redirectTo({
        //   url: '../paymentsuccess/paymentsuccess?tab=' + 2 + '&goodsAmount=' + that.data.Price,
        // })
        $.confirm(data.firstErrorMessage)
      }
    })
  },




  gotopay: function() { //支付
    var that = this;
    wx.login({
      success: function(datainfo) {
        wx.getUserInfo({
          success: function(res) {
            console.log(res)
            var val = {
              appId: appId,
              jsCode: encodeURIComponent(datainfo.code),
              encryptData: encodeURIComponent(res.encryptedData),
              iv: encodeURIComponent(res.iv)
            }
            console.log(val)
            api.sessionkeysave(val, function(data) {
              console.log(data)
              wx.hideToast();
              if (data.result) {
                that.setData({
                  openID: data.openId
                })
                that.gotoweixin()
              } else {
                wx.showToast({
                  title: '支付失败',
                })
              }
            })
          }
        })
      }
    })

  },
  gotoweixin: function() { //微信支付
    console.log('进入')
    var val = {
      orderIdList: [this.data.idList], //--------------订单ID集合----------------------- 必填
      payType: "MINIAPP", //-----------------支付方式------传"MINIAPP"--------必填
      storeId:storeId, //------------------店铺ID--------------------------- 必填
      appId: appId, //--------------------小程序AppId----------------------必填
      openId: this.data.openID, //------------------- 会员的openId--------------------- 必填
    }
    console.log(val)
    var that = this;
    xnService.orderMergePayNew(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        wx.requestPayment({
          'timeStamp': data.miniAppPrePayParams.timeStamp,
          'nonceStr': data.miniAppPrePayParams.nonceStr,
          'package': data.miniAppPrePayParams.packageStr,
          'signType': 'MD5',
          'paySign': data.miniAppPrePayParams.paySign,
          'success': function(res) {
            wx.redirectTo({
              url: '../paymentsuccess/paymentsuccess?tab=' + 1 + '&goodsAmount=' + that.data.Price,
            })
            that.setData({
              pageNumber: 1,
              orders: []
            })
            that.ordersIndexRequest()
            $.confirm('支付成功')
          },
          'fail': function(res) {
            wx.redirectTo({
              url: '../paymentsuccess/paymentsuccess?tab=' + 2 + "&goodsAmount=" + that.data.Price,
            })
            $.confirm('支付失败')
          }
        })
      }
    })
  },

  evaluation: function(e) {
    wx.navigateTo({
      url: 'comments/create?order_id=' + e.currentTarget.dataset.id
    })
  },
  refundfind:function(){
    this.setData({
      pagescroll: 1,
    })
   var val={
     memberId: app.globalData.memberId,
     storeId:storeId,
     systemType:'B2C',
     pageNumber: this.data.pageNumber,
     pageSize: 10,
   }
   console.log(val)
   var that = this;
    api.refundfind(val,function(data){
       console.log(data)
      if (data.firstErrorMessage==''){
        if (that.data.orders.length < data.totalCount){
          if(data.result.length<10){
            that.setData({
              orders: that.data.orders.concat(data.result),
              pagescroll: 1
              //totalCount: data.totalCount
            })
            // wx.showToast({
            //   title: '没有更多啦',
            // })
          }else{
            that.setData({
              orders: that.data.orders.concat(data.result),
              pagescroll: 0,
              pageNumber: parseInt(that.data.pageNumber) + 1,
            })
          }
        }else{
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
        if (thisobj.data.tapIndex == 'EVALUATION') {
           thisobj.refundfind()
        }else{
          thisobj.ordersIndexRequest()
        }
      }, 500);
    } else {
      // wx.showToast({
      //   title: '没有更多啦',
      // })
    }
  },
  scrollTop:function(){
    var thisobj = this;
    console.log(1111111111111);
    
    clearTimeout(time);
    var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
      thisobj.setData({
        pagescroll: -1,
        orders: [],
        pageNumber: 1,
      },function(){
        if (thisobj.data.tapIndex == 'EVALUATION') {
          thisobj.refundfind()
        } else {
          thisobj.ordersIndexRequest()
        }
      })     
    }, 500);
  },

  onCancelOrderTapInfo:function(e){
    wx.navigateTo({
      url: '../Filllogistics/Filllogistics?detail=' + e.currentTarget.dataset.detail + '&rower=' + e.currentTarget.dataset.rower,
    })
  },
  onCancelOrderTapdetail:function(e){
    var val={
      id: e.currentTarget.dataset.detail,
      type:'MEMBER',
      rowVersion: e.currentTarget.dataset.rower
    }
    
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要取消退单吗？',
      success(res) {
        if (res.confirm) {
          api.refundcancel(val, function (data) {
            if (data.firstErrorMessage == '') {
              $.confirm('取消成功', function () {
                that.setData({
                  pageNumber: 1,
                  orders: []
                })
                that.refundfind()
              });

            }
          })   
        } 
      }
    })
    
    

  },
  chargeback:function(e){
    wx.navigateTo({
      url: '../Detailsrefunds/Detailsrefunds?currentItemId=' + e.currentTarget.dataset.currentitemid,
    })
  }
})