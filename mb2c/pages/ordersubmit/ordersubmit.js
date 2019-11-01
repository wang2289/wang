// pages/ordersubmit/ordersubmit.js
var app = getApp()
const xnServiceapi = require('../../service/confirmanorder.js');
const xnService = require('../../service/product.js');
const tenantId = require('../../config').tenantId;
const xnServicem = require('../../service/commodity.js');
const MD5 = require('../../utils/md5.js');
var $ = require('../../utils/util.js');
const appId = require('../../config').appId;
var storeId = require('../../config.js').storeId;
const notice = require('../../utils/notice.js');
const service = require('../../service/service.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ProductInfo: [], //确认订单的商品信息
    operatingUnitId: app.globalData.operatingUnitId,
    id: "",
    quatitynum: 0,
    addressInfo: [], //默认地址
    conponflag: false, //控制模板
    selectsp: 0,
    selectct: 0,
    inteflag: false,
    PointsInfo: 0,
    contactName: "",
    contactPhone: "",
    provinceName: "",
    detailedaddress: "",
    cityName: "",
    districtName: "",
    cityId: "",
    districtId: "",
    totalFeightFee: 0, //计算运费
    itemid: [], //物料id
    orderNewconfirmInfo: "",
    couponEntity: "",
    creditcode: "", //社会信用代码
    companyname: "", //公司名称
    companaddress: "", //公司地址
    companyphone: "", //公司电话
    openingbank: "", //开户行名称
    openingbankname: "", //开户行银行账号
    numval: 0,
    pointflag: false,
    Locationid: 0, //收货地址id
    inputRemarkInfo: "",
    invoiceTypes: "",
    tapindex: 1,
    options: [],
    idList: "",
    opendID: "",
    benefitAmount: 0, //优惠券金额
    discountcouponid: "",
    totalAmount: 0, //商品总额
    Length: 6, //输入框个数  
    isFocus: true, //聚焦  
    Value: "", //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。  
    flagm: false,
    payment: false, //控制支付模态框
    locationRowVersion: "",
    Pay: 0, //支付方式
    fromValue: "", //支付密码
    mergePayId: "", //合并付款Id
    goods_amount: 0, //商品金额
    pms: [],
    pointRulepick: 0, //积分抵扣的金额
    amount: 0, //总金额
    invoice: "", //发票抬头
    Giftcarddetails: [],
    GiftcarInfo: [],
    top: "",
    isNeedInvoice: false,
    isshow: false,
    benefitAmounts: 0, //参与活动的金额
    benefitSourceId:null,
    Giftcardamount: 0,
    couponDefinitionIdList: [],
    amount2: 0,
    amountone: 0,
    locationid: '',
    IsCheck: false,
    discountcoupon: [], //优惠券集合
    fid: -1,
    DefaultaddressInfo: [],
    Defaultaddressflag: false,
    isCurriculum:false,
    signInfo:[],
    memberInfo:[],//会员信息
    supplierId:null,
    supplierName:null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options", options)
    notice.addNotice("Refresh", this.refreshData, this);
    this.setData({
      itemid: JSON.parse(options.itemid),
      creditcode: options.creditcodes, //社会信用代码
      companyname: options.companynames, //公司名称
      companaddress: options.companaddresss, //公司地址
      companyphone: options.companyphones, //公司电话
      openingbank: options.openingbanks, //开户行名称
      openingbankname: options.openingbanknames, //开户行银行账号
      invoiceTypes: options.invoiceTypes, //发票抬头
      tapindex: options.tapindex,
      options: options,
      isDisabled: false,
      top: "20rpx",
      btnflag: false
    })
    if(this.data.itemid[0].signInfo){
      this.setData({
        isCurriculum:true,
        signInfo: JSON.parse(this.data.itemid[0].signInfo)
      })
    }
    if (this.data.itemid[0].supplierId) {
      this.setData({
        supplierId: this.data.itemid[0].supplierId
      })
    }
    if (this.data.itemid[0].supplierName) {
      this.setData({
        supplierName: this.data.itemid[0].supplierName
      })
    }



    //获取会员信息
    var memberRequest = {
      id: app.globalData.memberId
    };
    var that = this;
    service.getMemberExtend(memberRequest, function (data) { //  获取经营单元id
      that.setData({
        memberInfo: data.member,
        memberExtend: data.memberExtend
      })
    })
  },

  refreshData: function(res) {
    console.log("return data:", res);
    var that = this;
    // this.setData({
    //   addressInfo: res.name
    // });
    if (that.data.locationid != '') {
      //获取选择的地址
      var val = {
        memberId: app.globalData.memberId,
        pageNumber: 1,
        ids: [that.data.locationid],
        pageSize: 0
      }
      var that = this;
      xnServiceapi.memberLocationfind(val, function (data) {
        if (data.firstErrorMessage || data.message) {
          $.confirm(data.firstErrorMessage ? data.firstErrorMessage : data.message);
        }else{
          if(data.result && data.result.length > 0){
            that.setData({
              addressInfo: data.result,
              contactName: data.result[0].contactName,
              contactPhone: data.result[0].contactPhone,
              provinceName: data.result[0].provinceName,
              cityName: data.result[0].cityName,
              districtName: data.result[0].districtName,
              cityId: data.result[0].cityId,
              districtId: data.result[0].districtId,
              Locationid: data.result[0].id,
              locationRowVersion: data.result[0].rowVersion,
              detailedaddress: data.result[0].address
            })
            that.freightNewPay()
          }else{
            $.confirm('未查询到选择的地址信息');
          }
        }
        console.log(data)
      })
    } else {
      //获取默认地址
      //获取选择的地址
      var val = {
        memberId: app.globalData.memberId,
        pageNumber: 1,
        isDefault: true,
        pageSize: 0
      }
      var that = this;
      xnServiceapi.memberLocationfind(val, function (data) {
        if (data.firstErrorMessage || data.message) {
          $.confirm(data.firstErrorMessage ? data.firstErrorMessage : data.message);
        } else {
          if (data.result && data.result.length > 0) {
            that.setData({
              addressInfo: data.result,
              contactName: data.result[0].contactName,
              contactPhone: data.result[0].contactPhone,
              provinceName: data.result[0].provinceName,
              cityName: data.result[0].cityName,
              districtName: data.result[0].districtName,
              cityId: data.result[0].cityId,
              districtId: data.result[0].districtId,
              Locationid: data.result[0].id,
              locationRowVersion: data.result[0].rowVersion,
              detailedaddress: data.result[0].address
            })
            that.freightNewPay()
          }else{

          }
        }
        console.log(data)
      })
      
    }
  },


  // Defaultaddress: function() { //获取会员默认地址
  //   var val = {
  //     memberId: app.globalData.memberId,
  //     pageNumber: 1,
  //     pageSize: 0
  //   }
  //   var that = this;
  //   xnServiceapi.memberLocationfind(val, function(data) {
  //     console.log(data)
  //     if (data.firstErrorMessage == "") {
  //       if (that.data.locationid != '') {
  //         for (var x in data.result) {
  //           if (data.result[x].id == that.data.locationid) {
  //             that.setData({
  //               addressInfo: data.result,
  //               contactName: data.result[x].contactName,
  //               contactPhone: data.result[x].contactPhone,
  //               provinceName: data.result[x].provinceName,
  //               cityName: data.result[x].cityName,
  //               districtName: data.result[x].districtName,
  //               cityId: data.result[x].cityId,
  //               districtId: data.result[x].districtId,
  //               Locationid: data.result[x].id,
  //               locationRowVersion: data.result[x].rowVersion,
  //               detailedaddress: data.result[x].address
  //             })
  //             that.freightNewPay()
  //           }
  //         }
  //       } else {
  //         for (var x in data.result) {
  //           if (data.result[x].isDefault == true) {
  //             that.setData({
  //               addressInfo: data.result,
  //               contactName: data.result[x].contactName,
  //               contactPhone: data.result[x].contactPhone,
  //               provinceName: data.result[x].provinceName,
  //               cityName: data.result[x].cityName,
  //               districtName: data.result[x].districtName,
  //               cityId: data.result[x].cityId,
  //               districtId: data.result[x].districtId,
  //               Locationid: data.result[x].id,
  //               locationRowVersion: data.result[x].rowVersion,
  //               detailedaddress: data.result[x].address
  //             })
  //             that.freightNewPay()
  //           }
  //         }
  //       }
  //     }
  //   })
  // },
  suitcouponlist: function() {
    //  wx.navigateTo({
    //    url: '../invoiceinformation/invoiceinformation',
    //  })
    this.setData({
      conponflag: true,
      selectsp: 1,
      selectct: 1,
    })
  },
  closesps: function() { //关闭模板
    this.setData({
      conponflag: false,
      selectsp: 0,
      selectct: 0,
    })
  },
  Shutdown: function() {
    this.setData({
      conponflag: false,
      selectsp: 0,
      selectct: 0,
    })
  },
  // coupon: function () { //打开模板
  //   this.setData({
  //     conponflag: true,
  //     selectsp: 1,
  //     selectct: 1,
  //   })
  // },
  interesting: function() {
    this.setData({
      inteflag: true,
      selectsp: 1,
      selectct: 1,
    })
  },
  closespinter: function() {
    this.setData({
      inteflag: false,
      selectsp: 0,
      selectct: 0,
    })
  },
  MymemberPoint: function() { //查询积分
    var val = {
      memberId: app.globalData.memberId,
    }
    //console.log(val)
    var that = this;
    xnServiceapi.memberPoint(val, function(data) {
      //console.log(data)
      that.setData({
        PointsInfo: data.point
      })
    })
  },
  freightNewPay: function(mell) { //计算运费
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      tenantId: tenantId,
      cityId: this.data.cityId,
      districtId: this.data.districtId,
      list: this.data.pms
    }
    console.log(val)
    var that = this;
    xnServiceapi.freightNewPay(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        that.setData({
          totalFeightFee: data.totalFeightFee.toFixed(2) //运费金额
        })
        // console.log('4444444444444444444444444')
 
        if(mell!=1){
          that.calculateprice()
        }
      }
    })
  },
  inputRemark: function(e) {
    this.setData({
      inputRemarkInfo: e.detail.value
    })
    app.globalData.message = e.detail.value
  },
  isloading:false,
  orderNewcommit: function(e) { //提交订单
    console.log("提交订单产生的formId", e.detail.formId);
    //获取到交互产生的formId
    var formId = e.detail.formId;
    //将产生的formId记录到数据库中
    if (formId != null && formId != '' && formId !='the formId is a mock one') {
      service.createWechatAppForm({ accountId: app.globalData.accountId, formType: 'FORM', formId: formId, openId: app.globalData.openId, totalCount: 1 }, function (data) {
        console.log(data)
        if (data.firstErrorMessage == "") {
        }
      })
    }
    //验证收货地址
    if (!this.data.isCurriculum &&!this.data.Locationid){
      $.confirm('请选择收货地址');
      return;
    }

    if (this.data.Pay == 0 && this.data.amount != 0) {
      $.confirm('请选择支付方式')
    } else {
      this.setData({
        btnflag: true
      })

      //根据不同的支付方式跳转到不同的页面
      if (this.data.Pay == 1) {
        var val = {
          userId: app.globalData.userId
        }
        var that = this;
        xnService.transaction_password(val, function(data) {
          if (data.verifyResult) {
            if (that.data.isCurriculum) {
              service.loginnewId({}, function (data) {
                that.orderCommitForCurriculum(data);
              })
              
            } else {
             that.acknowledgement()
            }
          } else {
            wx.navigateTo({
              url: '../Accountsecurity/Accountsecurity?sutry=' + 1,
            })
            // that.setData({
            //   btnflag: false
            // })
          }
        });
      } else {
        var _that= this;
        if (_that.data.isCurriculum){
          service.loginnewId({}, function (data) {
            _that.orderCommitForCurriculum(data);
          })
        }else{
          _that.acknowledgement();
        }
        
      }
    }
  },

  acknowledgement: function() {
    console.log(this.data.GiftcarInfo)
    var Gift = JSON.stringify(this.data.GiftcarInfo)
    console.log(Gift)
    var pams = { //接受发票传来信息
      invoiceType: this.data.invoiceTypes, //----发票类型--- 必填
      invoiceTitle: this.data.invoice || null, //---发票抬头
      invoiceItem: null, //----发票内容 -
      invoiceAmount: this.data.goods_amount, //-- - 发票金额-- - 必填
      taxNumber: this.data.creditcode, //-- - 增值发票税号
      bankName: this.data.openingbank, //-- - 增值发票开户银行
      bankAccount: this.data.openingbankname, //-- - 增值发票银行账号
      companyAddress: null, //--­增值发票公司法人地址
      companyPhone: null, //-- - 增值发票公司注册号码
      receiptUserName: null, //--收件人的姓名
      receiptUserPhone: null, //-- - 收件人的电话
      receiptUserLocation: null, //-- - 增值发票公司注册号码
      email: null, //-- - 邮箱
      receiptUserLocationAddress: this.data.companaddress, //-- - 增值发票收件地址
      postCode: null, //----增值发票收件地址邮编
    }
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      storeId: storeId,
      locationId: this.data.Locationid, //收货地址id
      goodsAmount: parseFloat(this.data.goods_amount) || 0, //商品总额
      freightFee: parseFloat(this.data.totalFeightFee), //运费
      memberMessage: this.data.inputRemarkInfo, //买家留言
      //isNeedInvoice: false, //是否需要开发票
      //orderInvoicingCommitRequest: pams, //开票信息
      orderConfirmItemList: this.data.pms, //商品清单 
      usedPoint: app.globalData.numval || 0, //使用的积分
      pointAmount: parseFloat(app.globalData.pointRulepick) || 0, //积分抵扣金额
      ticketAmount: parseFloat(app.globalData.benefitAmount) || 0, //优惠券抵扣金额
      couponEntityIdList: JSON.stringify(app.globalData.couponDefinitionIdList) || null, //优惠券id
      promotionAmount: this.data.benefitAmounts, //促销抵扣金额
      promotionSourceIdList: [], //促销ID集合
      giftCardAmount: parseFloat(app.globalData.Giftcardamount) || 0, //礼品卡抵扣总金额
      prePaidCardUseList: Gift, //礼品卡实用信息集合
      locationRowVersion: this.data.locationRowVersion, //地址的RowVersion
      tenantId: tenantId,
      orderHeadInfoCreateRequestList: { key: 'CURRICULUM_MEMBER', value: JSON.stringify(this.data.signInfo) },
      miniAppAccountId:app.globalData.accountId,
      miniAppOpenId:app.globalData.openId
    };
    if (this.data.benefitSourceId){
      val.promotionSourceIdList.push(this.data.benefitSourceId);
    }

    if (this.data.tapindex == 2 || this.data.tapindex == 3) {
      val.orderInvoicingCommitRequest = pams;
      val.isNeedInvoice = true
    } else {
      val.isNeedInvoice = false
    }

    // wx.showLoading({});
    var that = this;
    xnServiceapi.orderNewcommit(val, function(data) {
      // wx.showLoading();
      that.isloading = false;
      app.globalData.Commercialinvoice = ''
      if (data.firstErrorMessage == "") {
        that.setData({
          idList: data.idList
        })
        if (that.data.Pay == 1 && data.isZeroOrderPaid == false) {
          that.orderMergePayNews();
        }
        if (that.data.Pay == 2 && data.isZeroOrderPaid == false) {
          that.gotopay()
        }
        if (data.isZeroOrderPaid == true) {
          wx.redirectTo({
            url: '../paymentsuccess/paymentsuccess?tab=' + 1 + '&goodsAmount=' + that.data.amount,
          })
        }
      } else {
        $.confirm(data.firstErrorMessage)
      }

      // that.setData({
      //   btnflag: false
      // })
    })
  },
  orderCommitForCurriculum:function(newId){ //课程商品提交订单
    var _that = this;
    var orderBatchRequest = {
      orderCommitRequestList: [],
    };
    var request = {
      orderHeadCommitRequest: {
        id: newId,
        discountRate: 1,
        freightFee: 0,
        pointAmount: 0,
        freeAmount: 0,
        memberMessage: this.data.inputRemarkInfo,
        isNeedInvoice: false,
        isCashOnDelivery: false,
        isSelfSupport: true,
        orderHeadInfoCreateRequestList: [],
        classType: 'CURRICULUM',
        type:'STANDARD',
        operatingUnitId: _that.data.operatingUnitId,
        systemType: "B2C",
        deviceType: "MOBILE",
        storeId: storeId,
        memberType:'BUSINESS',
        memberId: app.globalData.memberId,
        memberAccount: _that.data.memberExtend.account,
        memberName:_that.data.memberInfo.name,
        contactMobilePhone: _that.data.memberInfo.mobilePhone,
        supplierId:_that.data.supplierId,
        supplierName:_that.data.supplierName
      },
      orderLineCommitRequestList: []
    };

    var orderLineRequest = {
      itemId: _that.data.ProductInfo[0].itemId,
      quantity: 1,
      unitPrice: _that.data.ProductInfo[0].unitPrice,
      listPrice: _that.data.ProductInfo[0].unitPrice,
      commodityTitle: _that.data.ProductInfo[0].commodityTitle,
      itemManufacturingType: "STANDARD",
    };
    request.orderLineCommitRequestList.push(orderLineRequest);
    request.orderHeadCommitRequest.orderHeadInfoCreateRequestList.push({ key: 'CURRICULUM_MEMBER', value: JSON.stringify(_that.data.signInfo) });

    if (request.orderLineCommitRequestList.length == 0) {
      $.confirm('请选择需要购买的商品');
      return;
    }


    orderBatchRequest.orderCommitRequestList.push(request);
    if (_that.isloading) {
      return;
    }
    _that.isloading = true;

    xnServiceapi.orderCommitForCurriculum(orderBatchRequest, function (data) {
      // wx.showLoading();
      _that.isloading = false;
      app.globalData.Commercialinvoice = ''
      if (data.firstErrorMessage == "") {
        if(data.id){
          var newOrderIdList = [];
          newOrderIdList.push(data.id);
          data.idList = newOrderIdList;
        }
        _that.setData({
          idList: data.idList,
          amount: _that.data.ProductInfo[0].unitPrice
        })
        if (_that.data.Pay == 1 ) {
          _that.orderMergePayNews();
        }
        if (_that.data.Pay == 2 ) {
          _that.gotopay()
        }
        // if (data.isZeroOrderPaid == true) {
        //   wx.redirectTo({
        //     url: '../paymentsuccess/paymentsuccess?tab=' + 1 + '&goodsAmount=' + _that.data.amount,
        //   })
        // }
      } else {
        $.confirm(data.firstErrorMessage)
      }

      // that.setData({
      //   btnflag: false
      // })
    })
  },
  invoiceinfo: function() {
    var materialID = JSON.stringify(this.data.itemid)
    wx.navigateTo({
      url: '../invoiceinformation/invoiceinformation?itemid=' + materialID + '&tapindexa=' + this.data.tapindex
    })
  },
  orderNewconfirm: function() { //计算商品及促销价格等
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      list: this.data.itemid
    }
    console.log(val)
    var that = this;
    xnServiceapi.orderNewconfirm(val, function(data) {
      console.log(data)
      for (var x in data.cartDetailList) {
        data.cartDetailList[x].unitPrice = data.cartDetailList[x].unitPrice.toFixed(2)
      }
      that.setData({
        orderNewconfirmInfo: data,
        ProductInfo: data.cartDetailList,
        totalAmount: data.totalAmount, //实付款的商品总额
        goods_amount: (data.totalAmount).toFixed(2), //商品总额
        discountcoupon: data.couponDetailList
      })
      if (data.selectBenefitList != '') {
        console.log(data.selectBenefitList);
        that.setData({
          benefitAmounts: data.selectBenefitList[0].benefitAmount,
          benefitSourceId: data.selectBenefitList[0].benefitDetailList[0].sourceId
        })
      }
      //处理优惠券数据
      for (var x in that.data.discountcoupon) {
        that.data.discountcoupon.IsCheck = false
      }
      for (var x in that.data.discountcoupon) { //是否选中优惠券
        if (x == that.data.discountcouponid) {
          that.data.discountcoupon[x].IsCheck = true;
          that.setData({
            fid: that.data.discountcouponid,
            discountcoupon: that.data.discountcoupon
          })
        }
      }
      that.setData({
        discountcoupon: that.data.discountcoupon
      })

      //计算商品金额
      for (var x in that.data.ProductInfo) {
        var arrInfo = {
          itemId: that.data.ProductInfo[x].itemId,
          quantity: that.data.ProductInfo[x].quantity,
          unitPrice: that.data.ProductInfo[x].unitPrice,
          isGift: false,
          //  cartid: that.data.ProductInfo[x].id
        }
        if (that.data.ProductInfo[x].id != undefined) {
          arrInfo.cartid = that.data.ProductInfo[x].id
        }
        that.data.pms.push(arrInfo)
        console.log(that.data.pms)
      }
      // if (!that.data.Defaultaddressflag) {
      //   that.Defaultaddress()
      // }
      that.refreshData()
      that.MymemberPoint()
      that.calculateprice()
    })
  },
  writenum: function(e) {
    var patrn = /^([1-9]\d*|0)(\.\d*[1-9])?$/;
    if (!patrn.exec(e.detail.value)) {
      app.globalData.numval = 0;
      this.setData({
        numval: app.globalData.numval
      })
    } else {
      app.globalData.numval = e.detail.value;
      if (app.globalData.numval <= 0) {
        app.globalData.numval = 0
        this.setData({
          numval: app.globalData.numval
        })
        return;
      }
      if (app.globalData.numval >= this.data.orderNewconfirmInfo.maxPoint) {
        app.globalData.numval = this.data.orderNewconfirmInfo.maxPoint
        this.setData({
          numval: app.globalData.numval
        })
        return;
      } else {
        this.setData({
          numval: app.globalData.numval
        })
        return;
      }
    }
  },
  sub: function() { //减
    app.globalData.numval = parseInt(app.globalData.numval - 50)
    if (app.globalData.numval <= 0) {
      app.globalData.numval = 0
      this.setData({
        numval: app.globalData.numval
      })
    } else {
      this.setData({
        numval: app.globalData.numval
      })
    }
  },
  add: function() { //加
    app.globalData.numval = parseInt(app.globalData.numval + 50);
    console.log(app.globalData.numval)
    if (app.globalData.numval >= this.data.orderNewconfirmInfo.maxPoint) {
      app.globalData.numval = this.data.orderNewconfirmInfo.maxPoint
      this.setData({
        numval: app.globalData.numval
      })
    } else {
      this.setData({
        numval: app.globalData.numval
      })
    }
  },
  largestuse: function() { //最大使用
    app.globalData.numval = this.data.orderNewconfirmInfo.maxPoint
    this.setData({
      numval: app.globalData.numval,
    })
  },
  _bindStore: function(e) { //取消使用优惠券
    for (var x in this.data.discountcoupon) {
      if (x == e.currentTarget.dataset.index) {
        this.data.discountcoupon[x].IsCheck = false;
        app.globalData.couponDefinitionIdList = [];
        app.globalData.benefitAmount = 0;
        this.setData({
          fid: -1,
          discountcoupon: this.data.discountcoupon,
          benefitAmount: app.globalData.benefitAmount,
        })
      }
    }
    this.calculateprice()
  },
  ShiYong: function(e) { //使用优惠券
    /**
     * 使用优惠券 将礼品卡信息清空 因计算方式不一样
     */
    app.globalData.Giftcardamount = 0;
    app.globalData.GiftcardamountID = [];
    app.globalData.GiftcarInfo = [];
    app.globalData.amount2 = 0;
    this.setData({
      discountcouponid: e.currentTarget.dataset.index
    })
    for (var x in this.data.discountcoupon) {
      if (x == e.currentTarget.dataset.index) {
        this.data.discountcoupon[x].IsCheck = true;
        app.globalData.couponDefinitionIdList = [e.currentTarget.dataset.id]
        app.globalData.benefitAmount = e.currentTarget.dataset.ripc
        this.setData({
          fid: e.currentTarget.dataset.index,
          discountcoupon: this.data.discountcoupon
        })
      }
    }
    this.setData({
      benefitAmount: app.globalData.benefitAmount,
      GiftcarInfo: [],
      Giftcardamount: 0,
      // numval: 0,
      // pointRulepick:0
    })
    // app.globalData.pointRulepick = 0;
    // app.globalData.numval = 0
    // this.closesps()
    this.calculateprice()
    // this.buynow()
  },
  buynow: function() {
    /**
     * 使用积分将礼品卡信息清空 因计算方式不一样
     */
    app.globalData.Giftcardamount = 0,
      app.globalData.GiftcardamountID = [],
      app.globalData.GiftcarInfo = [],
      app.globalData.amount2 = 0

    app.globalData.pointRulepick = ((app.globalData.numval / this.data.orderNewconfirmInfo.pointRule.point) * this.data.orderNewconfirmInfo.pointRule.amount).toFixed(2) //积分抵扣的金额
    var maxprice = parseFloat(this.data.orderNewconfirmInfo.totalAmount * (this.data.orderNewconfirmInfo.pointRule.maxPercent / 100)) //计算每单最大使用的金额
    console.log('积分抵扣', app.globalData.pointRulepick, '最大抵扣的金额', maxprice)
    if (app.globalData.pointRulepick > maxprice) {
      wx.showModal({
        title: '提示',
        content: '不能抵扣这么多',
      })
      this.setData({
        GiftcarInfo: [],
        Giftcardamount: 0
      })
    } else {
      this.setData({
        pointflag: true,
        inteflag: false,
        pointRulepick: app.globalData.pointRulepick,
        GiftcarInfo: [],
        Giftcardamount: 0
      })
      app.globalData.pointRulepick = app.globalData.pointRulepick
    }
    this.calculateprice()
  },
  calculateprice: function() { //计算实际付款的金额
 
    /**
     * pointRulepick   积分抵扣的金额
     * benefitAmount    优惠券的金额
     * amount= goods_amount + totalFeightFee - benefitAmounts   (商品金额 + 运费的金额) - 参与活动的金额 = 总金额  (礼品卡金额  积分金额可抵扣, 优惠券不可以抵扣运费)
     * 
     */
    var amount = (parseFloat(this.data.goods_amount) + parseFloat(this.data.totalFeightFee)) - parseFloat(this.data.benefitAmounts) // 总金额
    var amountone = parseFloat(this.data.goods_amount) - parseFloat(this.data.benefitAmounts) //没有运费的总金额
    this.setData({
      amount: parseFloat(amount).toFixed(2),
      amountone: parseFloat(amountone).toFixed(2)
    })
    if (parseFloat(app.globalData.benefitAmount) >= parseFloat(this.data.amountone) && parseFloat(this.data.amountone) > 0) { //优惠券金额大于总金额
      app.globalData.benefitAmount = this.data.amountone
      this.setData({
        amount: this.data.totalFeightFee,
        amountone: 0
      })
      app.globalData.couponDefinitionIdList = app.globalData.couponDefinitionIdList
    }
    if (parseFloat(app.globalData.benefitAmount) < parseFloat(this.data.amountone) && parseFloat(this.data.amountone) > 0 && parseFloat(app.globalData.benefitAmount) > 0) { //优惠券金额小于总金额
      var amount = (this.data.amountone - app.globalData.benefitAmount).toFixed(2);
      this.setData({
        amount: (parseFloat(amount) + parseFloat(this.data.totalFeightFee)).toFixed(2),
        amountone: amount
      })
      console.log('111111111111111', this.data.amountone)
      app.globalData.benefitAmount = app.globalData.benefitAmount;
      app.globalData.couponDefinitionIdList = app.globalData.couponDefinitionIdList
    }
    if (parseFloat(app.globalData.pointRulepick) >= parseFloat(this.data.amountone) && parseFloat(this.data.amountone) > 0) { //积分金额大于总金额

      app.globalData.pointRulepick = this.data.amountone,
        this.setData({
          amount: this.data.totalFeightFee,
          amountone: 0
        })
      app.globalData.numval = app.globalData.numval
    }
    if (parseFloat(app.globalData.pointRulepick) < parseFloat(this.data.amountone) && parseFloat(this.data.amountone) > 0 && parseFloat(app.globalData.pointRulepick) > 0 && this.data.amount > 0) { //积分金额小于总金额
      var amount = (this.data.amountone - app.globalData.pointRulepick).toFixed(2);
      this.setData({
        amount: (parseFloat(amount) + parseFloat(this.data.totalFeightFee)).toFixed(2),
        amountone: amount
      })
      console.log('22222222222', this.data.amountone)
      app.globalData.pointRulepick = app.globalData.pointRulepick,
        app.globalData.numval = app.globalData.numval
    }
    if (parseFloat(app.globalData.Giftcardamount) >= parseFloat(this.data.amount) && parseFloat(this.data.amount) > 0) { //礼品卡金额大于总金额
      app.globalData.Giftcardamount = this.data.amount
      this.setData({
        amount: 0,
        amountone: 0
      })
    }
 
    if (parseFloat(app.globalData.Giftcardamount) < parseFloat(this.data.amount) && parseFloat(this.data.amount) > 0 && parseFloat(app.globalData.Giftcardamount) > 0) { //礼品卡金额小于总金额
      var amount = (this.data.amount - app.globalData.Giftcardamount).toFixed(2);
      this.setData({
        amount: amount,
        amountone: 0
      })
    }

    if(this.data.isCurriculum){
      this.setData({
        amount: this.data.ProductInfo[0].unitPrice,
        amountone: 0
      })
    }
    app.globalData.amount2 = parseFloat(this.data.amount);
    console.log('最后的值', this.data.amount)
  },
  onShow: function() {
    var that = this;
    that.setData({
      GiftcarInfo: [],
      pms: [],
      isshow: false,
      ProductInfo: [],
      // contactName: "",
      // contactPhone: "",
      // provinceName: '',
      // cityName: "",
      // districtName: '',
      //  addressInfo: [],
      Giftcardamount: app.globalData.Giftcardamount
    })

    that.orderNewconfirm()
    // that.Defaultaddress();
    that.prepaidcar();

  },

  gotopay: function() { //支付
    var that = this;
    that.setData({
      btnflag: false
    })
    wx.login({ //通过wx.login获取code
      success: function(datainfo) {
        wx.getUserInfo({
          success: function(res) {
            var val = {
              appId: appId,
              jsCode: encodeURIComponent(datainfo.code),
              encryptData: encodeURIComponent(res.encryptedData),
              iv: encodeURIComponent(res.iv)
            }
            // wx.showToast({
            //   title: '正在登陆...',
            //   icon: "loging"
            // })
            console.log(val)
            xnServiceapi.sessionkeysave(val, function(data) {
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
  gotoweixin: function() {
    console.log('进入')
    var val = {
      orderIdList: this.data.idList, //--------------订单ID集合----------------------- 必填
      payType: "MINIAPP", //-----------------支付方式------传"MINIAPP"--------必填
      storeId: storeId, //------------------店铺ID--------------------------- 必填
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
              url: '../paymentsuccess/paymentsuccess?tab=' + 1 + '&goodsAmount=' + that.data.amount,
            })
          },
          'fail': function(res) {
            wx.redirectTo({
              url: '../paymentsuccess/paymentsuccess?tab=' + 2 + "&goodsAmount=" + that.data.amount,
            })
          }
        })
      }
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
    wx.redirectTo({
      url: '../paymentsuccess/paymentsuccess?tab=' + 2 + '&goodsAmount=' + this.data.amount,
    })
  },
  suitZhifu: function() {
    this.setData({
      payment: true,
      isDisabled: true,
      top: "10000rpx",
      Value: ""
    })
  },
  balancepaid: function() { //余额支付方式
    this.setData({
      Pay: 1,
      payment: false,
      Value: ""
    })
    app.globalData.Pay = this.data.Pay
  },
  WeChatPay: function() { //微信支付方式
    this.setData({
      Pay: 2,
      payment: false,
      Value: ""
    })
    app.globalData.Pay = this.data.Pay
  },
  bindimgs: function() {
    this.setData({
      payment: false
    })
  },
  orderMergePayNews: function() { //余额支付
    var val = {
      orderIdList: this.data.idList,
      payType: "ACCOUNT",
      storeId: storeId,
    }
    console.log(val)
    var that = this;
    xnServiceapi.orderMergePayNews(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        if (data.id != "") {
          that.setData({
            flagm: true,
            mergePayId: data.id,
            btnflag:false
          })
        }
      } else {
        $.confirm(data.firstErrorMessage)
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
    xnServiceapi.mergeAccountPaid(val, function(data) {
        $.hideloading();
      console.log(data);
      if (data.result) {
        that.setData({
          Value: '',
          flagm: false
        })
        wx.redirectTo({
          url: '../paymentsuccess/paymentsuccess?tab=' + 1 + '&goodsAmount=' + that.data.amount,
        })
        $.confirm('支付成功')
      } else {
        that.setData({
          Value: '',
          fromValue: "",
        })
        if (data.firstErrorMessage == "交易密码不正确") {
          that.setData({
            fromValue: "",
            Value: "",
            isFocus: false
          })         
        } else {
          that.setData({
            flagm: false,
          })
          wx.redirectTo({
            url: '../paymentsuccess/paymentsuccess?tab=' + 2 + '&goodsAmount=' + that.data.amount + '&firstErrorMessage='+ data.firstErrorMessage,
          })
        }
        $.confirm(data.firstErrorMessage)
      }
    })
  },
  sergiftcard: function() { //跳转礼品卡
    wx.navigateTo({
      url: '../Usergiftcard/Usergiftcard?locationid=' + this.data.locationid ,
    })
  },
  selectaddress: function() {
    wx.navigateTo({
      url: '../addresslist/addresslist?sunbit=' + (this.data.locationid ? this.data.locationid : this.data.Locationid),
    })
  },
  prepaidcar: function() {
    console.log(app.globalData.GiftcardamountID)
    if (app.globalData.GiftcardamountID == []) {
      return
    }
    var that = this;
    var val = {
      bindMemberId: app.globalData.memberId,
      isActive: true,
      isAvailable: true,
      isBind: true,
      isSold: true
    }
    xnServiceapi.prepaidcardentity(val, function(data) {
      console.log('-=-=-=-=-=-=-=-=-', data)
      if (data.firstErrorMessage == "") {
        that.setData({
          Giftcarddetails: data.result,
          GiftcardCount: data.totalCount
        })
        for (var x in that.data.Giftcarddetails) {
          for (var j in app.globalData.GiftcardamountID) {
            if (that.data.Giftcarddetails[x].bindSecurity == app.globalData.GiftcardamountID[j].bindSecurity) {
              that.data.Giftcarddetails[x].usedAmount = app.globalData.GiftcardamountID[j].amount,
                that.data.Giftcarddetails[x].select = true,
                that.data.GiftcarInfo.push(that.data.Giftcarddetails[x])
            }
          }
        }
        console.log(that.data.GiftcarInfo)
      }
    })
  },
  HuoDong: function() {
    this.setData({
      payment: false
    })
  },
  SHopp: function() {
    this.setData({
      payment: false
    })
  },
  toaoMEN: function() {
    this.setData({
      payment: false
    })
  }
})