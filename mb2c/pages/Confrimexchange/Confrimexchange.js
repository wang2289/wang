// pages/Confrimexchange/Confrimexchange.js\
var app = getApp();
const requestService = require('../../service/Integralmall.js');
const xnService = require('../../service/confirmanorder.js');
const xnServiceapi = require('../../service/product.js');
const tenantId = require('../../config').tenantId;
const appId = require('../../config').appId;
var $ = require('../../utils/util.js');
const MD5 = require('../../utils/md5.js');
const xnService2 = require('../../service/product.js');
var storeId = require('../../config.js').storeId
var Isflag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: [],
    Integracommodity: "",
    contactName: "",
    contactPhone: "",
    provinceName: "",
    cityName: "",
    districtName: "",
    cityId: "",
    districtId: "",
    Locationid: "",
    totalFeightFee: 0, //运费
    balance: 0,
    idList: "", //获取的订单id list
    openID: "", //获取的微信openID
    rowVersion: "",
    item: "",
    flagm: false,
    payment: false,
    mergePayId: "",
    fromValue: "",
    Pay: 0,
    Length: 6, //输入框个数  
    isFocus: true, //聚焦  
    Value: "", //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。  
    locationid: '',
    detailedaddress:'',
    operatingUnitId:app.globalData.operatingUnitId
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      currentItemId: options.currentItemId,
      item: options.item,
    })
    var that = this;
    that.IntegralInfo()
    that.IntegraLocation()
    that.addInvoicefind()
    that.SelectmemberBalance()

  },
  IntegralInfo: function() { // 获取积分详情
    var val = {
      id: this.data.currentItemId,
      operatingUnitId: this.data.operatingUnitId,
      systemType: "POINT",
      deviceType: "MOBILE",
      tenantId: tenantId
    }
    console.log(val)
    var that = this;
    requestService.pointCommodityDetail(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        that.setData({
          Integracommodity: data.commodity,

        })
      }
    })
  },
  IntegraLocation: function() { //获取会员默认地址
    var val = {
      memberId: app.globalData.memberId,
      pageNumber: 1,
      pageSize: 10
    }
    var that = this;
    xnService.memberLocationfind(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        if (that.data.locationid != '') {
          for (var x in data.result) {
            if (data.result[x].id == that.data.locationid) {
              that.setData({
                addressInfo: data.result,
                contactName: data.result[x].contactName,
                contactPhone: data.result[x].contactPhone,
                provinceName: data.result[x].provinceName,
                cityName: data.result[x].cityName,
                districtName: data.result[x].districtName,
                cityId: data.result[x].cityId,
                districtId: data.result[x].districtId,
                Locationid: data.result[x].id,
                rowVersion: data.result[x].rowVersion,
                detailedaddress: data.result[x].address
              })
              that.freightNewPay()
            }
          }
        } else {
          for (var x in data.result) {
            if (data.result[x].isDefault == true) {
              that.setData({
                addressInfo: data.result,
                contactName: data.result[x].contactName,
                contactPhone: data.result[x].contactPhone,
                provinceName: data.result[x].provinceName,
                cityName: data.result[x].cityName,
                districtName: data.result[x].districtName,
                cityId: data.result[x].cityId,
                districtId: data.result[x].districtId,
                Locationid: data.result[x].id,
                rowVersion: data.result[x].rowVersion,
                detailedaddress: data.result[x].address
              })
              that.freightNewPay()
            }
          }
        }
      }
    })

  },
  freightNewPay: function() { //计算运费
    console.log(this.data.districtId)
    var list = [{
      itemId: this.data.item,
      quantity: 1,
      unitPrice: this.data.Integracommodity.showPrice,
    }];
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "POINT",
      deviceType: "MOBILE",
      tenantId: tenantId,
      cityId: this.data.cityId,
      districtId: this.data.districtId,
      list: list
    }
    console.log(val)
    var that = this;
    xnService.freightNewPay(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage || data.firstErrorMessage == '') {
        console.log(1);
        that.setData({
          totalFeightFee: data.totalFeightFee
        })
      }
    })
  },
  addInvoicefind: function() { //查询增票资质
    var val = {
      memberId: app.globalData.memberId,
      tenantId: tenantId,
      pageNumber: 1,
      pageSize: 10
    }
    requestService.addInvoicefind(val, function(data) {
      console.log(data)
    })
  },
  SelectmemberBalance: function() {
    var val = {
      memberId: app.globalData.memberId,
    }
    var that = this;
    requestService.memberBalanceget(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        that.setData({
          balance: data.balance
        })
      }
    })
  },
  inputRemark: function(e) { //买家留言
    console.log(e)
    this.setData({
      inputRemarkInfo: e.detail.value
    })
  },
  orderNewcommit: function() {
    var that = this;
    if (Isflag == true) {
      Isflag = false;
      setTimeout(function(){
        Isflag = true
      }, 2000)
      if (that.data.Pay == 0) {
        $.confirm('请先选择支付方式');
        return;
      }

      if (this.data.Pay == 1) {
        var val = {
          userId: app.globalData.userId
        }
        var that = this;
        xnService2.transaction_password(val, function(data) {
          console.log(data);
          if (data.verifyResult) {
            // that.acknowledgement()
          } else {
            wx.navigateTo({
              url: '../Accountsecurity/Accountsecurity?sutry=' + 2,
            });
            return;
          }
        })
      } else {
        // this.acknowledgement();
      }

      var pms = [{
        itemId: this.data.item,
        quantity: 1,
        unitPrice: this.data.Integracommodity.showPrice //单价
      }]
      var val = {
        operatingUnitId: this.data.operatingUnitId,
        systemType: "POINT",
        deviceType: "MOBILE",
        storeId:storeId,
        locationId: this.data.Locationid, //收货地址id
        goodsAmount: this.data.Integracommodity.showPrice, //商品总额
        freightFee: this.data.totalFeightFee, //运费
        memberMessage: this.data.inputRemarkInfo || '', //买家留言
        isNeedInvoice: false, //是否需要开发票
        //orderInvoicingCommitRequest: pams, //开票信息
        orderConfirmItemList: pms, //商品清单
        usedPoint: this.data.Integracommodity.showPoint, //使用的积分
        pointAmount: 0.00, //积分抵扣金额
        ticketAmount: 0.00, //优惠券抵扣金额
        //couponEntityId: null, //优惠券id
        promotionAmount: 0, //促销抵扣金额
        promotionSourceIdList: [], //促销ID集合
        giftCardAmount: 0.00, //礼品卡抵扣总金额
        prePaidCardUseList: [], //礼品卡实用信息集合
        locationRowVersion: this.data.rowVersion,
        tenantId: tenantId
      }
      console.log(val)
      var that = this;
      var showPoint = this.data.Integracommodity.showPoint;

      xnService.orderNewcommit(val, function(data) {
        console.log(data)
        if (data.firstErrorMessage == "") {
          that.setData({
            idList: data.idList
          })
          console.log(that.data.Pay);
          var totalAmt = that.data.Integracommodity.showPrice + that.data.totalFeightFee;
          if (that.data.Pay == 2) { // 微信支付
            if (totalAmt > 0) {
              that.gotopay(totalAmt)
            } else {
              wx.redirectTo({
                url: '../Successfulconversion/Successfulconversion?tab=1&price=' + totalAmt + '&showPoint=' + showPoint,
              })
            }
          } else if (that.data.Pay == 1) { // 余额支付
            if (totalAmt > 0) {
              that.orderMergePayNews()
            } else {
              wx.redirectTo({
                url: '../Successfulconversion/Successfulconversion?tab=1&price=' + totalAmt + '&showPoint=' + showPoint,
              })
            }
          }
        } else {
          $.confirm(data.firstErrorMessage);
        }
      })
    }
  },
  gotopay: function(price) {
    console.log(app.globalData.code)
    var that = this;
    wx.login({ //通过wx.login获取code
      success: function(datainfo) {
        wx.getUserInfo({
          success: function(res) {
            var val = {
              appId:appId,
              jsCode: encodeURIComponent(datainfo.code),
              encryptData: encodeURIComponent(res.encryptedData),
              iv: encodeURIComponent(res.iv)
            }
            console.log(val)
            xnService.sessionkeysave(val, function(data) {
              console.log(data)
              wx.hideToast();
              if (data.result) {
                that.setData({
                  openID: data.openId
                })
                that.gotoweixin(price)
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
  gotoweixin: function(price) {
    var val = {
      orderIdList: this.data.idList, //--------------订单ID集合----------------------- 必填
      payType: "MINIAPP", //-----------------支付方式------传"MINIAPP"--------必填
      storeId:storeId, //------------------店铺ID--------------------------- 必填
      appId:appId, //--------------------小程序AppId----------------------必填
      openId: this.data.openID, //------------------- 会员的openId--------------------- 必填
    }
    var showPoint = this.data.Integracommodity.showPoint;
    console.log(val)
    xnServiceapi.orderMergePayNew(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        wx.requestPayment({
          'timeStamp': data.miniAppPrePayParams.timeStamp,
          'nonceStr': data.miniAppPrePayParams.nonceStr,
          'package': data.miniAppPrePayParams.packageStr,
          'signType': 'MD5',
          'paySign': data.miniAppPrePayParams.paySign,
          'success': function(res) {
            console.log('支付成功')
            wx.redirectTo({
              url: '../Successfulconversion/Successfulconversion?tab=1&price=' + price + '&showPoint=' + showPoint,
            })
          },
          'fail': function(res) {
            $.confirm('支付失败', function() {

            });
            // wx.redirectTo({
            //   url: '../Successfulconversion/Successfulconversion?tab=2&price=' + price + '&showPoint=' + showPoint,
            // })
          }
        })
      }
    })
  },
  suitZhifu: function() {
    this.setData({
      payment: true
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
  bindimg: function() { //关闭支付模态框
    this.setData({
      flagm: false
    })
  },
  suitZhifu: function() {
    this.setData({
      payment: true
    })
  },
  balancepaid: function() { //余额支付方式
    this.setData({
      Pay: 1,
      payment: false
    })
  },
  WeChatPay: function() { //微信支付方式
    this.setData({
      Pay: 2,
      payment: false,

    })
  },
  bindimgs: function() {
    this.setData({
      payment: false
    })
  },
  orderMergePayNews: function() {
    var val = {
      orderIdList: this.data.idList,
      payType: "ACCOUNT",
      storeId:storeId,
    }
    var that = this;
    xnService.orderMergePayNews(val, function(data) {
      console.log(data)
      if (data.id != "") {
        that.setData({
          flagm: true,
          mergePayId: data.id,
        })
      }else{
        $.confirm(data.firstErrorMessage)
        that.setData({
          Value: ""
        })
      }
    })
  },
  mergeAccountPaid: function() {
    var val = {
      mergePayId: this.data.mergePayId,
      transactionPassword: MD5.hexMD5(this.data.fromValue)
    }
    var showPoint = this.data.Integracommodity.showPoint;
    var price = this.data.Integracommodity.showPrice + this.data.totalFeightFee;
    var that = this;
      $.loading();
    xnService.mergeAccountPaid(val, function(data) {
        $.hideloading();
        if (data.result) {
        that.setData({
          Value: '',
          flagm: false,
        })
        $.confirm('支付成功', function() {
          wx.redirectTo({
            url: '../Successfulconversion/Successfulconversion?tab=1&price=' + price + '&showPoint=' + showPoint,
          })
        })

      } else {
        that.setData({
          Value: '',
        })
        if (data.firstErrorMessage == "交易密码不正确") {
          
        }else{
          that.setData({
            flagm: false,
          })
        }
        // wx.redirectTo({
        //   url: '../paymentsuccess/paymentsuccess?tab=' + 2 + '&goodsAmount=' + that.data.amount,
        // })
        $.confirm(data.firstErrorMessage)
        // $.confirm('抱歉！您的积分不足，无法完成兑换', function () {

        // }, true);
        // wx.redirectTo({
        //   url: '../Successfulconversion/Successfulconversion?tab=2&price=' + price + '&showPoint=' + showPoint,
        // })
      }
    })
  },
  balancepaid: function() { //余额支付方式
    this.setData({
      Pay: 1,
      payment: false
    })
  },
  WeChatPay: function() { //微信支付方式
    this.setData({
      Pay: 2,
      payment: false,

    })
  },
  selectaddress: function() {
    wx.navigateTo({
      url: '../addresslist/addresslist?sunbit=' + 2,
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
    this.IntegraLocation();
    this.setData({
      contactName: "",
      contactPhone: "",
      provinceName: '',
      cityName: "",
      districtName: '',
      addressInfo: [],
      flagm:false
    })

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