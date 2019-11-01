// pages/productdetail/productdetail.js
var app = getApp();
const xnService = require('../../service/commodity.js');
const xnServiceapi = require('../../service/product.js');
const xnServiceyx = require('../../service/service.js');
const tenantId = require('../../config').tenantId;
var $ = require('../../utils/util.js');
const requestService = require('../../service/request.js');
const service = require('../../service/service.js');
var storeId = require('../../config.js').storeId;
var mta= require('../../utils/mta_analysis.js');
var config =  require('../../config.js');
const regeneratorRuntime = require('../../utils/regenerator/runtime-module');


let store = app.store;

//chat start
import IMController from '../../chat/controller/im.js';
import { connect } from '../../chat/redux/index.js';

let mapStateToData = (state) => {
    return {
        isLogin: state.isLogin || store.getState().isLogin
    }
}

const mapDispatchToPage = (dispatch) => ({
    loginClick: function () {
        this.doYXLogin()
        return
    }
})
//chat end

let pageConfig = {
  /**
   * 页面的初始数据
   */
  data: {
    isShowToast: false,
    pictureEvaluationNumber: 0,
    evaluationNumber: 0,
    comments: [],
    operatingUnitId: app.globalData.operatingUnitId,
    numval: 1, //购买数量
    minusStatus: 'disabled ', //购买数量少于1时不能点击
    selectsp: 0,
    selectct: 0,
    flag: false,
    ProductInfo: {}, //商品信息
    itemid: 0,
    inventoryInfo: [],
    prduindex: 0,
    quantity: 0, //库存数量
    spec2AttrList: 0,
    spec3AttrList: 0,
    attributeId: 0, // 类型id
    index: 1,
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
    hideModal: true, //分享模态框的状态  true-隐藏  false-显示
    animationData: {},
    clazzType: '',
    maskHidden: false,  //生成海报模态框的状态  false-隐藏  true-显示
    imagePath: '',      //海报路径
    canvasGoodsImg: '',
    canvasQrcodeImg: '',
    screenWidth: 0,
    screenHeight: 0,
    price1: '0',
    price2: '00',
    customerServiceImId:null //供应商imid
  },

  //判断obj是否为json对象
  isJson:function(obj) {
    var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isjson;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function(options) {

    var that = this;

    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        that.setData({
          screenWidth: res.screenWidth,
          screenHeight: res.screenHeight
        });
      }
    });

    if (options.scene && !this.isJson(options.scene)){
      options = decodeURIComponent(options.scene);
      var params = options.split('&');
      options = {};
      for (var i = 0; i < params.length;i++){
        let temps = params[i].split('=');
        if (temps.length == 2){
          let key = temps[0];
          let value = temps[1];
          options[key] = value;
        }
      }
    }
    if(options.logId){
        options = await that.getOptionsByLogId(options);
    }
    app.saveRefereeIdByShare(options);
    that.setData({
      clazzType: options.clazzType,
    });

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
    if (options.clazzType == 'CURRICULUM') {
      wx.redirectTo({
        url: '../curriculumDetail/curriculumDetail?itemid=' + that.data.itemid,
      })
    }
    if(!app.checkLoginNoJump()){
        that.settingNonPassport();
    } else {
        that.memberDefalutLocation(); //查询默认地址
        that.productdetail()
        // 获取收藏数据
    }

// 自动登录
    let imInfo = wx.getStorageSync('imid');
    if (!app.imLogin && imInfo) {
      that.resetStore();
      that.doYXLogin(imInfo);
    }
  },
  getOptionsByLogId:async function(options){
      var promise = new Promise((resolve, reject) => {
          xnServiceyx.getObjectLog({id:options.logId,tenantId:config.tenantId}, function (data) {
              options = JSON.parse(data.objectLog.content);
              resolve(options);
          });
      });
      return await promise;
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
    requestService.request(params, function(res) {
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
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  navigatorToSupplier: function () {
    if (this.data.ProductInfo.commodity.supplierId){
      wx.navigateTo({
        url: '../supplier/supplier?supplierId=' + this.data.ProductInfo.commodity.supplierId,
      })
    }
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
        //  According: true,
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
        //  According: true,
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
        //  According: true,
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
    }];
    var val = {
      list: this.data.list
    };
    var that = this;
    xnService.batchCart(val, function(data) {
      if (data.firstErrorMessage == "") {
        wx.showToast({
          title: '添加成功',
        })
      } else {
        $.confirm(data.firstErrorMessage)
      }
    })
  },
  closesp: function() { //关闭选择规格面板
    var thisval = this;
    thisval.setData({
      selectct: 0,
      flag: false,
      conponflag: false,
      btnflag: false
    });
    setTimeout(function() {
      thisval.setData({
        selectsp: 0,
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
    this.setData({
      prduindex: e.currentTarget.dataset.prduindex,
      spec1ValueName: e.currentTarget.dataset.name,
      attributeId: e.currentTarget.dataset.valueid,
    });
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
    if (this.data.btn == 2) {
      if (that.data.repertoryquantity <= 0) {
        $.confirm('商品库存不足')
        return;
      } else {
        var arr = {
          "itemId": that.data.currentItem.id,
          "quantity": that.data.numval
        }
        this.data.materialId.push(arr)
        wx.navigateTo({
          url: '../ordersubmit/ordersubmit?itemid=' + JSON.stringify(this.data.materialId)
        })
        this.setData({
          materialId: [],
          selectct: 1,
          selectsp: 0,
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
        }];
        var val = {
          list: this.data.list
        };
        var that = this;
        xnService.batchCart(val, function(data) {
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
        })
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
      if (data.hasDefaultLocation){
        that.setData({
          memberDefalutLocationInfo: data,
          address: data.location.provinceName + data.location.cityName + data.location.districtName
        })
      }else{ //无默认地址时获取授权
        that.BindCitys()
        
      }
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
        if (res.errMsg == 'getLocation:ok') {
          var val = {
            location: res.longitude + ',' + res.latitude
          };
          service.addressByLatitude(val, function(data) {
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
    };
    if(!val.memberId){
        val.memberId = null;
    }
    var that = this;
    xnServiceapi.exitCollection(val, function(data) {
      if (data.firstErrorMessage == '' && data.id) {
        that.setData({
          isCollected: data.result,
          collectedId:data.id
        })
      }
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

      if(config.mtaAppId){
        mta.Event.stat("commodity_visit", {
          "supplier":data.commodity.supplierId,
          "suppliername":data.commodity.supplierName,
          "commodity":data.commodity.id,
          "commoditynumber":data.commodity.number,
          "commodityname":data.commodity.name

        });
        mta.Page.init();
      }


        if (data.clazzType == 'CURRICULUM') {
        wx.redirectTo({
          url: '../curriculumDetail/curriculumDetail?itemid=' + that.data.itemid,
        })
      }
      // 商品规格
      that.setData({
        ProductInfo: data,
        customerServiceImId:data.customerServiceImId
      });
      var content = that.data.ProductInfo.commodityText.replace(/\<img/gi, '<img class="rich-img" '); //防止富文本图片过大
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
      if(!app.globalData.memberId){
         val.memberId=null;
      }

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

  },

  /**
   * 聊天
   */
  doToChating: function (e) {
    let account = e.currentTarget.dataset.account;
    // 跳转
    let _this = this;

    let imInfo = wx.getStorageSync('imid');
    if (!imInfo) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return
    }

    let session = `p2p-${account}`;

    let State = app.store.getState();
    let friendCard = State.friendCard || [];
    let accounts = [];
    accounts = Object.keys(friendCard);

    let isHas = false;
    for (let s = 0; s < accounts.length; s++) {
      if (accounts[s] == account) {
        isHas = true;
      }
    }
    if (!isHas) {
      accounts.push(account);
      app.globalData.nim.getUsers({
        accounts: accounts,
        done: function (error, users) {
          store.dispatch({
            type: 'FriendCard_Update_Initial',
            payload: users
          })
        }
      });
    }

    try {
      if (app.globalData.nim && app.globalData.nim.getFriends) {
        app.globalData.nim.getFriends({
          done: (err, obj) => {
            if (!err) {
              let friends = obj || [];
              let isfriends = false;
              for (let i = 0; i < friends.length; i++) {
                if (account == obj[i].account) {
                  isfriends = true;
                }
              }
              if (!isfriends) {
                app.globalData.nim.addFriend({
                  account,
                  ps: '',
                  done: (err, obj) => {
                    if (!err) {
                      app.globalData.nim.getUser({
                        account,
                        done: function (err, user) {
                          store.dispatch({
                            type: 'FriendCard_Add_Friend',
                            payload: user
                          })
                          // 更新会话对象
                          store.dispatch({
                            type: 'CurrentChatTo_Change',
                            payload: session
                          })
                          // 告知服务器，标记会话已读
                          app.globalData.nim.resetSessionUnread(session)
                          store.dispatch({
                            type: 'CurrentChatTo_Change',
                            payload: `p2p-${account}`
                          })
                          _this.toChating(account, session);
                        }
                      })
                    } else {
                      _this.toChating(account, session);
                    }
                  }
                })
              } else {
                _this.toChating(account, session);
              }
            } else {
              _this.toChating(account, session);
            }
          }
        });
      } else {
        _this.toChating(account, session);
      }
    } catch (err) {
      _this.toChating(account, session);
    }

  },

  toChating: function (account, session) {
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: session
    })

    // 告知服务器，标记会话已读
    app.globalData.nim.resetSessionUnread(session);

    let chatType = 'p2p';
    wx.navigateTo({
      url: `/chat/pages/chating/chating?chatTo=${account}&type=${chatType}`,
    })
  },
    /**
     * 执行登录逻辑
     */
  doYXLogin: function (imInfo) {
      let _this=this;
        // let imInfo = "xnnt1084735734327513089";
        console.log("imInfo", imInfo);
         new IMController({
            token: imInfo,
            account: imInfo
          })
    
    },
    resetStore: function () {
        store.dispatch({
            type: 'Reset_All_State'
        })
    },
    // 显示遮罩层
    showModal: function () {
        var that = this;
        that.setData({
            hideModal: false
        });
        var animation = wx.createAnimation({
            duration: 600,             //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease',    //动画的效果 默认值是linear
        });
        this.animation = animation;
        setTimeout(function () {
            that.fadeIn();     //调用显示动画
        }, 200);
    },

    // 隐藏遮罩层
    hideModal: function () {
        var that = this;
        var animation = wx.createAnimation({
            duration: 800,            //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
            timingFunction: 'ease',   //动画的效果 默认值是linear
        });
        this.animation = animation;
        that.fadeDown();   //调用隐藏动画
        setTimeout(function () {
            that.setData({
                hideModal: true
            });
        }, 500);   //先执行下滑动画，再隐藏模块
    },

    //动画集
    fadeIn: function () {
        this.animation.translateY(0).step();
        this.setData({
            animationData: this.animation.export()   //动画实例的export方法导出动画数据传递给组件的animation属性
        });
    },
    fadeDown: function () {
        this.animation.translateY(336).step();
        this.setData({
            animationData: this.animation.export()
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let pictureList = this.data.ProductInfo.pictureList || [];
        let pictureObj = pictureList.length > 0 ? pictureList[0] : {};
        let picture = pictureObj.url || '';
        let commodity = this.data.ProductInfo.commodity || {};
        let name = commodity.name || '';
        let obj =  {
            title: '好货推荐分享-' + name,
            path: '/pages/productdetail/productdetail?itemid=' + this.data.itemid + '&clazzType=' + this.data.clazzType,
            imageUrl: picture,
            success: function (res) {
                console.log('成功', res);
            }
        };
        return app.returnShareObj(obj);
    },

    // 转发给好友
    shareToFriend: function (e) {
        this.hideModal();
        this.onShareAppMessage();
    },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    var price1 = this.data.price1;
    var price2 = this.data.price2;
    var goodsImg = '';
    var qrcodeImg = '';
    var unitW = this.data.screenWidth / 375;
    var unitH = this.data.screenHeight / 667;

    // 将商品封面图和小程序二维码下载
    wx.downloadFile({
      url: that.data.canvasGoodsImg,
      success: function (res) {
        goodsImg = res.tempFilePath || '';
        console.log(res, '商品封面图-------------------');

        wx.downloadFile({
          url: that.data.canvasQrcodeImg,
          success: function (res) {
            qrcodeImg = res.tempFilePath || '';
            console.log(res, '小程序二维码+++++++++++++++++++');

            var context = wx.createCanvasContext('mycanvas');
            context.setFillStyle("#fff");
            context.fillRect(0, 0, unitW * 285, unitH * 366);

            //将模板图片绘制到canvas, drawImage()函数
            if (goodsImg) {
              context.drawImage(goodsImg, unitW * 30, unitH * 30, unitW * 225, unitH * 225);
            } else {
              context.fillRect(unitW * 30, unitH * 30, unitW * 225, unitH * 225);
            }

            context.setFillStyle("#F04134");
            context.fillRect(unitW * 168, unitH * 221, unitW * 87, unitH * 34);
            context.setFontSize(unitW * 18);
            context.setFillStyle('#fff');
            context.setTextAlign('left');
            context.fillText('￥' + price1 + '.' + price2, unitW * 177, unitH * 244);
            context.stroke();

            //绘制文字
            context.setFontSize(unitW * 14);
            context.setFillStyle('#333');
            context.setTextAlign('left');
            context.fillText('长按识别图中的二维码', unitW * 104, unitH * 293);
            context.stroke();

            context.setFontSize(unitW * 14);
            context.setFillStyle('#333');
            context.setTextAlign('left');
            context.fillText('查看商品详情', unitW * 104, unitH * 314);
            context.stroke();

            context.setFontSize(unitW * 12);
            context.setFillStyle('#999');
            context.setTextAlign('left');
            context.fillText("保存后，可以从手机相册分享", unitW * 104, unitH * 333);
            context.stroke();

            //绘制二维码背景
            if (qrcodeImg) {
              // context.fillRect(unitW * 30, unitH * 278, unitW * 59, unitH * 59);
              context.drawImage(qrcodeImg, unitW * 30, unitH * 278, unitW * 59, unitH * 59);
            } else {
              context.fillRect(unitW * 30, unitH * 278, unitW * 59, unitH * 59);
            }

            context.draw();

            //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
            setTimeout(function () {
              wx.canvasToTempFilePath({
                canvasId: 'mycanvas',
                success: function (res) {
                  var tempFilePath = res.tempFilePath;
                  that.setData({
                    imagePath: tempFilePath
                  });

                  wx.saveImageToPhotosAlbum({
                    filePath: that.data.imagePath,
                    success: function (res) {
                      wx.hideLoading();
                      wx.showModal({
                        title: '保存图片成功',
                        content: '图片已保存到相册，赶紧晒一下吧~',
                        showCancel: false,
                        success: function (res) {
                          if (res.confirm) {
                            console.log('用户点击确定');
                            /* 该隐藏的隐藏 */
                            that.setData({
                              maskHidden: false
                            });
                          }
                        }, fail: function (err) {
                          console.log(err);
                        }
                      });
                    },
                    fail: function (res) {
                      console.log(res);
                      wx.hideLoading();
                      if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
                        wx.showModal({
                          title: '保存图片失败',
                          content: '您已取消保存图片到相册！',
                          showCancel: false
                        });
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！',
                          complete: function (res) {
                            console.log(res);
                            if (res.confirm) {
                              wx.openSetting({});     //打开小程序设置页面，可以设置权限
                            } else {
                              wx.showModal({
                                title: '保存图片失败',
                                content: '您已取消保存图片到相册！',
                                showCancel: false
                              });
                            }
                          }
                        });
                      }
                    }
                  });
                },
                fail: function (res) {
                  console.log(res);
                  wx.hideLoading();
                }
              });
            }, 200);
          }
        });
      }
    });
  },

  //点击保存到相册
  baocun: function () {
    this.createNewImg();
  },

  // 生成海报
  createPoster: function (e) {
    var that = this;
    this.hideModal();
    this.setData({
      maskHidden: false
    });
    wx.showLoading({
      title: '生成中...',
      mask: true
    });
    var param = {
        'itemid' : that.data.itemid,
        clazzType:that.data.clazzType
    };
    if(app.globalData.memberId){
        param.refereeMemberId = app.globalData.memberId;
    }
    xnServiceyx.createObjectLog({
        tenantId:config.tenantId,
        objectType:"COMMODITY_SCENE_SHARE",
        objectId:that.data.itemid,
        content:JSON.stringify(param)
    },function (data) {
        var obj = {
            appId: config.appId,
            tenantId:config.tenantId,
            scene: "logId=" + data.id,
            page: 'pages/productdetail/productdetail'
        };

        //【小程序】创建场景二维码
        xnService.createWfxAppScene(obj, function (data) {
            if (data.message) {
                wx.hideLoading();
                wx.showToast({
                    title: data.message,
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            if (!!data.errors === true && !!data.errors.length > 0) {
                wx.hideLoading();
                wx.showToast({
                    title: data.errors[0].message,
                    icon: 'none',
                    duration: 2000
                });
            } else {
                var imgUrl = data.imgUrl || '';
                var pictureList = that.data.ProductInfo.pictureList || [];
                var pictureObj = pictureList.length > 0 ? pictureList[0] : {};
                var picture = pictureObj.url || '';
                var originPrice = (that.data.Salespromotion && that.data.Salespromotion < that.data.showPrice) ? that.data.Salespromotion : that.data.showPrice;
                var priceList = (Math.round(originPrice * 100) / 100).toFixed(2).split('.');
                var price1 = priceList[0];
                var price2 = priceList[1];
                that.setData({
                    canvasGoodsImg: picture,
                    canvasQrcodeImg: imgUrl,
                    price1: price1,
                    price2: price2
                });
                wx.hideLoading();
                that.setData({
                    maskHidden: true
                });
            }
        });
    });

  },

  // 隐藏生成海报mask
  hideMask: function (e) {
      this.setData({
          maskHidden: false
      });
  },
};


let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)