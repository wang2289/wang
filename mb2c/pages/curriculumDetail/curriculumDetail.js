// pages/productdetail/productdetail.js
var app = getApp();
const xnService = require('../../service/commodity.js');
const xnServiceapi = require('../../service/product.js');
const tenantId = require('../../config').tenantId;
var $ = require('../../utils/util.js');
const requestService = require('../../service/request.js');
const service = require('../../service/service.js');
var storeId = require('../../config.js').storeId
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    pictureEvaluationNumber: 0,
    evaluationNumber: 0,
    comments: [],
    tapindex: 1,
    operatingUnitId: app.globalData.operatingUnitId,
    itemid: "",
    numval: 1, //购买数量  
    minusStatus: 'disabled ', //购买数量少于1时不能点击 
    selectsp: 0,
    selectct: 0,
    selectsp4: 0,
    selectct4: 0,
    flag: false,
    ProductInfo: [], //商品信息
    itemid: 0,
    inventoryInfo: [],
    prduindex: 0,
    quantity: 0, //库存数量
    spec2AttrList: 0,
    spec3AttrList: 0,
    attributeId: 0, // 类型id     
    spec2AttrListId: 0, // 类型id
    spec3AttrListId: 0, //类型id  
    conponflag: false,
    spec1ValueName: "",
    spec2ValueName: "",
    spec3ValueName: "",
    list: [],
    commodityEvaluationNumberpice: [], //获取评价的数量
    btn: 0, //区别立即购买和加入购物车
    memberDefalutLocationInfo: [], //会员地址
    commodityPartscount: 0, //获取商品配件
    index: 1,
    spec2AttrListId: 0, // 类型id
    spec3AttrListId: 0, //类型id  
    conponflag: false,
    spec1ValueName: "",
    spec2ValueName: "",
    spec3ValueName: "",
    list: [],
    commodityEvaluationNumberpice: [], //获取评价的数量
    btn: 0, //区别立即购买和加入购物车
    memberDefalutLocationInfo: [], //会员地址
    commodityPartscount: 0, //获取商品配件
    spec2AttrListId: 0, // 类型id
    spec3AttrListId: 0, //类型id  
    conponflag: false,
    spec1ValueName: "",
    spec2ValueName: "",
    spec3ValueName: "",
    spec3AttributeId: "",
    list: [],
    commodityEvaluationNumberpice: [], //获取评价的数量
    btn: 0, //区别立即购买和加入购物车
    memberDefalutLocationInfo: [], //会员地址
    commodityPartscount: 0, //获取商品配件
    itemId: '',
    navbar: ['商品', '详情', '评价'],
    currentTab: 0,
    btnflag: false,
    materialId: [],
    randId: '',
    selected: false,
    address: "", //地址
    repertory: [], //库存
    repertoryquantity: 0, //库存数量
    isCollected: false,
    collectedId:null,
    couponCount: 0,
    showpice: '',
    tapindex: 1,
    topNum: 0,
    originalprice: '', //原价
    Salespromotion: '', // 促销价
    couponDefinition: [],
    textIndex: 0,
    allindex: 1,
    pagenumber: 1,
    pagesize: 10,
    flags: false,
    inputval: 0,
    Therichtext: "",
    According: false,
    tab: 0,
    Scrolltop: 0,
    scposition: "", //滚动条位置
    commodityCurriculum:[],
    signInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (options.itemid != undefined) {
      that.setData({
        itemid: options.itemid,
      });
    }
    if (options.currentItemId != undefined) {
      that.setData({
        itemid: options.currentItemId,
      });
    }
    if(!app.checkLoginNoJump()){
        that.settingNonPassport();
    } else {
        that.memberDefalutLocation(); //查询默认地址
        that.productdetail();
        that.curriculumdetail();
            // 获取收藏数据
    }
  },
  showToast: function() {
    var _this = this;
    // toast时间  
    _this.data.count = parseInt(_this.data.count) ? parseInt(_this.data.count) : 3000;
    // 显示toast  
    _this.setData({
      isShowToast: true,
    });
    // 定时器关闭  
    setTimeout(function() {
      _this.setData({
        isShowToast: false
      });
    }, _this.data.count);
  },
  getCurrentItem:function(){
    let that = this;
    let itemList = that.data.itemList;
    var key = "";
    if (that.data.spec1ValueName) {
        key += that.data.spec1ValueName + ";";
    }
    if (that.data.spec2ValueName) {
        key += that.data.spec2ValueName + ";";
    }
    if (that.data.spec3ValueName) {
        key += that.data.spec3ValueName + ";";
    }
    var currentItem = null;
    for(var i=0;i<itemList.length;i++){
      if(key === itemList[i].key){
          currentItem = itemList[i];
      }
    }
    that.setData({
        currentItem:currentItem
    });

  },
  getCommentCount: function() {
    var that = this;
    var params = {
      method: 'goods.comments.count',
      id: this.data.itemid,
      operatingUnitId: this.data.operatingUnitId,
      systemType: 'B2C',
      deviceType: 'MOBILE',
      tenantId: tenantId,
    };

    requestService.request(params, function(res) {
      if (res.firstErrorMessage == '') {
        that.setData({
          evaluationNumber: res.evaluationNumber,
          pictureEvaluationNumber: res.pictureEvaluationNumber,
        });
      }
    });
  },

  getCommentsIndex: function() {
    var that = this;
    var params = {
      method: 'goods.comments.index',
      commodityId: that.data.itemid,
      pageNumber: this.data.pagenumber,
      pageSize: this.data.pagesize,
      tenantId: tenantId,
    }
    if (this.data.allindex == 2) {
      params.hasAttachment = true;
    }
    //console.log(params)
    requestService.request(params, function(res) {
      //console.log(res)
      if (res.firstErrorMessage == '') {
        if (that.data.pagenumber < Math.round(res.totalCount / that.data.pagesize)) {
          that.setData({
            comments: that.data.comments.concat(res.result),
            flags: true
          });
        } else {
          that.setData({
            comments: that.data.comments.concat(res.result),
            flags: false
          });
        }
      }
    });
  },

  scrollPage: function() { //滚动到底部进行分页
    //console.log("112515")
    //console.log(this.data.flags)
    if (this.data.flags) { //判断是否可以分页
      var thisobj = this;
      clearTimeout(time);
      var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
        thisobj.setData({
          pagenumber: parseInt(thisobj.data.pagenumber) + 1
        });
        thisobj.getCommentsIndex();
      }, 500);
    } else {
      // wx.showToast({
      //   title: '没有更多啦',
      // })
    }
  },

  navbarTap: function(e) {
    console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  picDetail: function() { //图文详情
    this.setData({
      tapindex: 1
    });
  },
  spcParam: function() { //规格参数
    this.setData({
      tapindex: 2
    });
  },

  ckselectsp: function(e) { //打开选择规格面板

    if(app.checkLogin()){
        this.setData({
            change: e.currentTarget.offsetLeft,
            selectsp: 1,
            selectct: 1,
            flag: true,
            flag1: false,
            btn: 2,
            btnflag: true,
            tab: 0
        });
        app.globalData.Giftcardamount = '',
        app.globalData.GiftcardamountID = '',
        app.globalData.benefitAmount = '',
        app.globalData.couponDefinitionId = '',
        app.globalData.numval = '',
        app.globalData.pointRulepick = '',
        app.globalData.couponDefinitionIdList = [],
        app.globalData.GiftcarInfo = [],
        app.globalData.Commercialinvoice = '';
    }
  },
  ckselectsp1: function(e) { //打开选择规格面板
      if(app.checkLogin()){
        this.setData({
            change: e.currentTarget.offsetLeft,
            selectsp: 1,
            selectct: 1,
            flag1: true,
            flag: false,
            btn: 1,
            btnflag: true,
            tab: 0
        });
        app.globalData.Giftcardamount = '';
        app.globalData.GiftcardamountID = '';
        app.globalData.benefitAmount = '';
        app.globalData.couponDefinitionId = '';
        app.globalData.numval = '';
        app.globalData.pointRulepick = '';
        app.globalData.couponDefinitionIdList = [];
        app.globalData.GiftcarInfo = [];
        app.globalData.Commercialinvoice = '';
      }
  },
  ckselectsp2: function(e) { //打开选择规格面板
      if(app.checkLogin()){
          this.setData({
              change: e.currentTarget.offsetLeft,
              selectsp: 1,
              selectct: 1,
              flag1: true,
              flag: false,
              btn: 1,
              btnflag: true,
              tab: 1
          });
          app.globalData.Giftcardamount = '';
          app.globalData.GiftcardamountID = '';
          app.globalData.benefitAmount = '';
          app.globalData.couponDefinitionId = '';
          app.globalData.numval = '';
          app.globalData.pointRulepick = '';
          app.globalData.couponDefinitionIdList = [];
          app.globalData.GiftcarInfo = [];
          app.globalData.Commercialinvoice = '';
      }
  },
  ckselectsp3: function() {
    this.data.list = [{
      systemType: "B2C",
      deviceType: "MOBILE",
      operatingUnitId: this.data.operatingUnitId,
      storeId: storeId,
      memberId: app.globalData.memberId,
      itemId: this.data.currentItem.id,
      quantity: this.data.numval,
      itemManufacturingType: "STANDARD",
      isSuite: false
    }]
    var val = {
      list: this.data.list
    }
    //console.log('添加购物车', val)
    var that = this;
    xnService.batchCart(val, function(data) {
      //console.log(data)
      if (data.firstErrorMessage == "") {
        wx.showToast({
          title: '添加成功',
        })
      } else {
        $.confirm(data.firstErrorMessage)
      }
    })
  },
  ckselectsp4: function (e) { //打开选择规格面板
    if(app.checkLogin()){
      this.setData({
          change: e.currentTarget.offsetLeft,
          selectsp4: 1,
          selectct4: 1,
          flag1: true,
          flag: false,
          btn: 1,
          btnflag: true,
          //  According: true,
          tab: 2
      });
      app.globalData.Giftcardamount = '';
      app.globalData.GiftcardamountID = '';
      app.globalData.benefitAmount = '';
      app.globalData.couponDefinitionId = '';
      app.globalData.numval = '';
      app.globalData.pointRulepick = '';
      app.globalData.couponDefinitionIdList = [];
      app.globalData.GiftcarInfo = [];
      app.globalData.Commercialinvoice = '';
    }

  },
  closesp: function() { //关闭选择规格面板
    var thisval = this;
    thisval.setData({
      selectct: 0,
      selectsp4: 0,
      flag: false,
      conponflag: false,
      btnflag: false
    });
    setTimeout(function() {
      thisval.setData({
        selectsp: 0,
        selectsp4: 0,
      });
    }, 1000);
  },
  ClickelseInfo: function() {
    this.setData({
      currentTab: 1,
      scposition:0,
    })
  },
  sub: function() { //减数量
    if (Number(this.data.numval)<1){
      return ;
    }
    this.unifiedNum(2);

  },
  add: function() { //加数量
    this.unifiedNum(1);
  },
  writenum: function(even) { //失去焦点时
    this.setData({
      inputval: even.detail.value
    });
    this.unifiedNum(3);
  },
  unifiedNum: function(btntype) { //统一判断
    var that = this;
    var thisobj = { //接收的临时变量
      value: parseInt(that.data.numval),
      inputval: parseInt(that.data.inputval)
    }
    if (btntype == 1) { //表示加数量
      thisobj.value = thisobj.value + 1;
    }
    if (btntype == 2) { //表示减数量
      thisobj.value = thisobj.value - 1;
    }
    if (btntype == 3) { //输入
      thisobj.value = thisobj.inputval;
    }
    if (thisobj.value <= 0) { //表示等于0
      that.setData({
        numval: 1
      });
      return;
    }
    if (thisobj.value >= that.data.repertoryquantity) { //表示等于0
      that.setData({
        numval: that.data.repertoryquantity
      });
      $.confirm('库存不足!')
      return;
    }
    this.setData({
      numval: thisobj.value
    });
  },
  Lookatall: function() {
    this.setData({
      currentTab: 2
    })
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    }
  },

  selectsp: function(e) { //选择规格
    ////console.log(e)
    this.setData({
      prduindex: e.currentTarget.dataset.prduindex,
      spec1ValueName: e.currentTarget.dataset.name,
      attributeId: e.currentTarget.dataset.valueid,
    })
    for (var x in this.data.inventoryInfo) {
      this.setData({
        quantity: this.data.inventoryInfo[this.data.prduindex].quantity
      })
    }
    var that = this;
    that.Todealwith();
  },
  spec2AttrList: function(e) {
    this.setData({
      spec2AttrList: e.currentTarget.dataset.prduindex,
      spec2ValueName: e.currentTarget.dataset.name,
      spec2AttrListId: e.currentTarget.dataset.valueid
    })
    this.Todealwith();
  },
  spec3AttrList: function(e) {
    this.setData({
      spec3AttrList: e.currentTarget.dataset.prduindex,
      spec3ValueName: e.currentTarget.dataset.name,
      spec3AttrListId: e.currentTarget.dataset.valueid
    });
    this.Todealwith();
  },

  inputName: function (e) {
    console.log(e)
    this.data.signInfo.name = e.detail.value.replace(/\s+/g, '');
  },
  inputPhone: function (e) {
    console.log(e)
    this.data.signInfo.phone = e.detail.value.replace(/\s+/g, '');
  },
  inputCompany: function (e) {
    console.log(e)
    this.data.signInfo.company = e.detail.value.replace(/\s+/g, '');
  },
  inputJob: function (e) {
    console.log(e)
    this.data.signInfo.job = e.detail.value.replace(/\s+/g, '');
  },
  inputEmail: function (e) {
    console.log(e)
    this.data.signInfo.email = e.detail.value.replace(/\s+/g, '');
  },

  /**
   * 领取优惠券
   */
  onReceiveCouponTap: function(event) {
    var that = this;
    var couponId = event.target.dataset.coupon_id;
    var params = {
      method: 'goods.coupon.store',
      couponDefinitionId: couponId,
      deviceType: 'MOBILE',
      mobileType: 'MOBILE',
      systemType: 'B2C',
      memberId: wx.getStorageSync('memberId'),
      tenantId: tenantId
    };
    requestService.request(params, function(data) {
       console.log(data)
      if (data.firstErrorMessage || data.message) {
        var title = data.firstErrorMessage ? data.firstErrorMessage : data.message
        $.confirm(title)
      } else {
        $.confirm('领取成功',function(){
        });
      }
    });
  },

  Todealwith: function() {
    var that = this;
    that.getCurrentItem();
    let currentItem = that.data.currentItem;

    console.log(currentItem);

    that.setData({
        showPrice: currentItem.unitPrice,
        Salespromotion: currentItem.currentPrice,
        couponDefinition: currentItem.couponDefinition,
        textIndex:currentItem.textIndex
    });

    for (var o in this.data.repertory) {
      if (this.data.repertory[o].itemId === currentItem.id) {
        this.setData({
          repertoryquantity: this.data.repertory[o].quantity //商品库存
        })
      }
    }
  },
  buynow: function() { //添加购物车
    var that = this;
    if (!that.data.signInfo.name) {
      $.confirm('姓名不能为空')
      return;
    }
    if (!that.data.signInfo.phone) {
      $.confirm('手机号不能为空')
      return;
    }
    var mobile = /^(1[0-9]{10})$/;
    if (!mobile.test(that.data.signInfo.phone)) {
      $.confirm("手机格式不正确");
      return;
    }

    if (that.data.tab == 2) {
      if (that.data.repertoryquantity <= 0) {
        $.confirm('商品库存不足')
        return;
      } else {
        var arr = {
          "itemId": that.data.currentItem.id,
          "quantity": that.data.numval,
          "signInfo": JSON.stringify(that.data.signInfo),
          "supplierId": that.data.ProductInfo.commodity.supplierId,
          "supplierName": that.data.ProductInfo.commodity.supplierName
        }
        this.data.materialId.push(arr)
        wx.navigateTo({
          url: '../ordersubmit/ordersubmit?itemid=' + JSON.stringify(this.data.materialId)
        })
        this.setData({
          materialId: [],
          selectct: 1,
          selectsp: 0,
          selectct4: 1,
          selectsp4: 0,
          flag: false,
          conponflag: false,
          btnflag: false
        })
      }
    } else {
      if (that.data.repertoryquantity <= 0) {
        $.confirm('商品库存不足')
        return;
      } else {
        this.setData({
          selectct: 1,
          selectsp: 0,
          flag: false,
          conponflag: false,
          btnflag: false,
        })
        this.data.list = [{
          systemType: "B2C",
          deviceType: "MOBILE",
          operatingUnitId: this.data.operatingUnitId,
          storeId: storeId,
          memberId: app.globalData.memberId,
          itemId: this.data.currentItem.id,
          quantity: this.data.numval,
          itemManufacturingType: "STANDARD",
          isSuite: false
        }]
        var val = {
          list: this.data.list
        }
        //console.log('添加购物车', val)
        var that = this;
        xnService.batchCart(val, function(data) {
          //console.log(data)
          if (data.firstErrorMessage == "") {
            wx.showToast({
              title: '添加成功',
            })
          } else {
            $.confirm(data.firstErrorMessage)
          }
        })
      }
    }
  },

  ckselectspbuynow: function() {
    var that = this
    if (that.data.repertoryquantity <= 0) {
      $.confirm('商品库存不足')
      return;
    } else {
      this.setData({
        selectct: 1,
        selectsp: 0,
        flag: false,
        conponflag: false,
        btnflag: false,
      })
    }
  },
  commodityEvaluationNumber: function() { //获取商品评价总数和平均评分
    var val = {
      systemType: "B2C",
      deviceType: "MOBILE",
      operatingUnitId: this.data.operatingUnitId,
      id: this.data.itemid,
      tenantId: tenantId
    }
    var that = this;
    xnService.commodityEvaluationNumber(val, function(data) {
      //////console.log("获取商品评价总数和平均评分",data)
      that.setData({
        commodityEvaluationNumberpice: data
      })
    })
  },

  collectionNew: function() { //收藏
    if(app.checkLogin()){
        var that = this;
        var isCollected = this.data.isCollected;
        if (isCollected) {
            $.confirm('您已收藏过该商品！');
        } else {
            var val = {
                objectName: this.data.ProductInfo.commodity.name,
                operatingUnitId: this.data.operatingUnitId,
                objectId: this.data.itemid,
                storeId: storeId,
                memberId: app.globalData.memberId,
                objectType: "COMMODITY"
            };
            xnService.collectionNew(val, function(data) {
                if (data.firstErrorMessage == "") {
                    wx.showToast({
                        title: "收藏成功"
                    });
                    that.setData({
                        isCollected: true,
                        collectedId:data.id
                    });
                } else {
                    if (data.firstErrorMessage =="collection.tip.exist"){
                        $.confirm('您已收藏过该商品！');
                    }else{
                        wx.showToast({
                            title: data.firstErrorMessage
                        });
                    }

                }
            })
        }
    }



  },
  ClickCollectdel: function(e) {
    var val = {
      id: this.data.collectedId
    };
    var that = this;
    xnService.collectiondelete(val, function(data) {
      if (data.firstErrorMessage == "") {
        wx.showToast({
          title: '取消收藏成功',
        });
        that.setData({
          isCollected: false,
          collectedId:null
        })
      }
    })
  },
  memberDefalutLocation: function() { //获取会员默认地址
    var val = {
      ip: "127.0.0.1",
      tenantId: tenantId,
      memberId: app.globalData.memberId,
    }
    var that = this;
    xnService.memberDefalutLocation(val, function(data) {
      //console.log('获取会员默认地址', data)
      if (data.hasDefaultLocation){
        that.setData({
          memberDefalutLocationInfo: data,
          address: data.location.provinceName + data.location.cityName + data.location.districtName
        })
      }else{ //无默认地址时获取授权
        that.BindCitys()
        
      }
      //console.log(that.data.address)
    })
  },
  commodityPartsByCommodity: function() { //获取商品配件 
    var val = {
      id: this.data.itemid,
      tenantId: tenantId,
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
    };
    xnService.commodityPartsByCommodity(val, function(data) {
      //////console.log('获取商品配件',data)
      if (data.firstErrorMessage == "") {
        commodityPartscount: data
      }
    })
  },
  onSlideChangeEnd: function(e) {
    var that = this;
    that.setData({
      index: e.detail.current + 1
    })
    //console.log(that.data.index)

  },
  //获取商品评价
  coupon: function() {
    this.setData({
      conponflag: true,
      selectsp: 0,
      selectct: 0,
    })
  },
  BindCitys: function() { //地理定位
    var that = this;
    wx.getLocation({
      success: function(res) {
        console.log(res)
        if (res.errMsg == 'getLocation:ok') {
          var val = {
            location: res.longitude + ',' + res.latitude
          }
          //console.log(val)
          service.addressByLatitude(val, function(data) {
            console.log(data)
            if (data.firstErrorMessage == "") {
              that.setData({
                address: data.address
              })
            }
          })
        }else{
          //授权失败 读取后台默认值
          var pars = {
            code: 'ebiz.setting.delivery.province',//发货地址省
            level: "TENANT"
          }
          xnServiceapi.profile_option_value(pars, function (province) {
            var pars = {
              code: 'ebiz.setting.delivery.city',//发货地址市
              level: "TENANT"
            }
            xnServiceapi.profile_option_value(pars, function (city) {
              that.setData({
                address: province.value + city.value
              })
            })
          })
        }
      },
    })
  },

  exitCollection: function() { //检查收藏的状态
    var val = {
      memberId: app.globalData.memberId,
      objectId: this.data.itemid,
      objectType: 'COMMODITY',
      storeId: storeId
    }
    var that = this;
    xnServiceapi.exitCollection(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == '') {
        that.setData({
          isCollected: data.result,
          collectedId:data.id
        })
      }
      //console.log(that.data.isCollected)
    })
  },

  settingNonPassport: function() { //未登录状态下 获取经营单元id
    var val = {
      systemType: "B2C",
      deviceType: "MOBILE",
      tenantId: tenantId,
    };
    var that = this;
    xnServiceapi.settingNonPassport(val, function(data) {
      if (data.firstErrorMessage == '') {
        that.setData({
          operatingUnitId: data.systemSite.operatingUnitId
        });
        that.productdetail();
        that.curriculumdetail();
      }
    })
  },
  productdetail: function() { //商品详情
    var that = this;
    var val = {
      id: that.data.itemid,
      operatingUnitId: that.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      tenantId: tenantId
    };
    xnService.commodityNew(val, function(data) {
      if (data.firstErrorMessage != '') {
        $.confirm(data.firstErrorMessage, function() {
          wx.navigateBack();
        });
        return false;
      }

      // 商品规格
      that.setData({
        ProductInfo: data
      });
      var content = that.data.ProductInfo.commodityText.replace(/\<img/gi, '<img class="rich-img" ');; //防止富文本图片过大
      that.setData({
        Therichtext: content
      });

      var itemList = that.data.ProductInfo.itemList;
      for(let i=0;i<itemList.length;i++){
          var item = itemList[i];
          var key = "";
          if (item.spec1ValueName) {
              key += item.spec1ValueName + ";";
          }
          if (item.spec2ValueName) {
              key += item.spec2ValueName + ";";
          }
          if (item.spec3ValueName) {
              key += item.spec3ValueName + ";";
          }
          item.key = key;
      }

      if (data.spec1AttrList && data.spec1AttrList.length > 0) {
          that.setData({
              spec1ValueName: data.spec1AttrList[0].valueName || '',
              attributeId: data.spec1AttrList[0].valueId || 0,
          })
      }
      if (data.spec2AttrList && data.spec2AttrList.length > 0) {
          that.setData({
              spec2ValueName: data.spec2AttrList[0].valueName || '',
              spec2AttrListId: data.spec2AttrList[0].valueId || 0,
          })
      }
      if (data.spec3AttrList && data.spec3AttrList.length > 0) {
          that.setData({
              spec3ValueName: data.spec3AttrList[0].valueName,
              spec3AttrListId: data.spec3AttrList[0].valueId,
              spec3AttributeId: data.spec3AttrList[0].valueId,
          })
      }

      var val = {
            id: that.data.itemid,
            operatingUnitId: that.data.operatingUnitId,
            systemType: "B2C",
            deviceType: "MOBILE",
            tenantId: tenantId,
            memberId: app.globalData.memberId
        };
      if (app.globalData.memberId==''){
        val.memberId=null;
      };
      xnService.commoditySkuInfo(val, function(data) {
          if (data.firstErrorMessage == '') {
              let balanceList = data.balanceList;
              let itemOuList = data.itemOuList;
              that.setData({
                  repertory: balanceList
              });
              for(let i=0;i<itemList.length;i++ ){
                  for(let j=0;j<itemOuList.length;j++ ){
                    if(itemList[i].id === itemOuList[j].itemId){
                        itemList[i].unitPrice = itemOuList[j].unitPrice;
                        itemList[i].currentPrice = itemOuList[j].currentPrice;
                        itemList[i].couponDefinition = itemOuList[j].couponDefinitionList;
                        if(itemList[i].couponDefinition){
                            itemList[i].textIndex = itemList[i].couponDefinition.length;
                        } else {
                            itemList[i].couponDefinition = [];
                            itemList[i].textIndex = 0;
                        }
                    }
                  }
              }
              that.setData({
                  itemList:itemList
              });


              that.Todealwith();


              that.commodityEvaluationNumber();
              that.commodityPartsByCommodity();
              that.getCommentCount();
              that.getCommentsIndex();
          }
      });

      if (!app.checkLoginNoJump()) {
        that.BindCitys()
      }
    })
  },
  curriculumdetail:function(){
    //查询课程商品
    var that = this;
    var val = {
      id: that.data.itemid,
      tenantId: tenantId
    };
    xnService.curriculumCommodityGet(val, function (data) {
      if (data.firstErrorMessage != '') {
        $.confirm(data.firstErrorMessage, function () {
          wx.navigateBack();
        });
        return false;
      }else{
        that.setData({
          commodityCurriculum: data.commodityCurriculum
        });
      }
    });
  },
  navigatorToSupplier: function () {
    if (this.data.ProductInfo.commodity.supplierId) {
      wx.navigateTo({
        url: '../supplier/supplier?supplierId=' + this.data.ProductInfo.commodity.supplierId,
      })
    }
  },
  scrollbottom: function(e) { //向下滑动到商品详情
    // this.setData({
    //   currentTab: 1
    // })
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
    this.exitCollection();
   
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

  },

  all: function() {
    this.setData({
      allindex: 1,
      comments: [],
      pagenumber: 1,
      pagesize: 10,
    })
    this.getCommentsIndex()
  },
  withpicture: function() {
    this.setData({
      allindex: 2,
      comments: [],
      pagenumber: 1,
      pagesize: 10,
    })
    this.getCommentsIndex()
  },
  scroll: function(e) {
    this.setData({
      scposition: e.detail.scrollTop
    })
  },

  /**
   * 点击放大图片
   */
  onShowBigImageTap: function(event) {
    console.log(1111);
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    var imgArray = [];
    for (var x in imgList) {
      imgArray.push(imgList[x].filePath);
    }

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArray // 需要预览的图片http链接列表
    })

  },

  /**
   * 点击放大图片
   */
  onBigImageTap: function (event) {
    console.log(1111);
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    var imgArray = [];
    for (var x in imgList) {
      imgArray.push(imgList[x].url);
    }

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArray // 需要预览的图片http链接列表
    })

  }
})