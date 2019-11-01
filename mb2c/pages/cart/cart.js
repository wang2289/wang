// pages/cart/cart.js
var app = getApp();
const xnService = require('../../service/service.js');
const xnServiceapi = require('../../service/commodity.js');
const api = require('../../service/product.js');
var $ = require('../../utils/util.js')
var storeId = require('../../config.js').storeId
Page({
  data: {
    id: 0, // 商品id
    price: 0, //商品价钱
    quantity: 0, //商品数量
    operatingUnitId: app.globalData.operatingUnitId, //经营单元id
    cardListgetInfo: [], //商品信息列表
    selectcardListgetInfo: [], //选中的商品信息
    IsCheck: false,
    itemid: "", //选中的商品id
    shopItem: [], //选中的商品id集合
    flag: false,
    totalpice: 0, //总价
    totalnum: 0, //选中的数量
    balance: "", //库存
    linshi: [],
    IsShow: false,
    num: 0,
    pid:[],
    arr: [],  
    Piceflag:0,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if(app.checkLogin()){
        var that = this;
        that.ShopListInfo();
    }
  },
  ShopListInfo: function() { //获取列表
    var val = {
      memberId: app.globalData.memberId,
      operatingUnitId: this.data.operatingUnitId,
      storeId: storeId,
      systemType: "B2C",
      deviceType: "MOBILE",
    }
    //console,log(val)
    var that = this;
    xnServiceapi.cardListget(val, function(data) {
      //console,log("商品列表", data)
      if (data.firstErrorMessage == "") {
        for (var x in data.supplierCartList) {
          data.supplierCartList[x].IsCheck = false
          for (var j in data.supplierCartList[x].cartList) {
            data.supplierCartList[x].cartList[j].IsCheck = false
          }
        }
        if (data.supplierCartList!=''){
          data.supplierCartList[0].id = 0;
          //console,log(data.supplierCartList)
        }
        var linshi = that.data.linshi;
        if (linshi.length > 0) {
          for (var i = 0; i < linshi.length; i++) {
            for (var j = 0; j < data.supplierCartList.length; j++) {
              if (linshi[i].id == data.supplierCartList[j].id) {
                data.supplierCartList[j].IsCheck = linshi[i].IsCheck;
              };
              for (var x = 0; x < linshi[i].cartList.length; x++) {
                for (var y = 0; y < data.supplierCartList[j].cartList.length; y++) {
                  if (linshi[i].cartList[x].id == data.supplierCartList[j].cartList[y].id) {
                    data.supplierCartList[j].cartList[y].IsCheck = linshi[i].cartList[x].IsCheck;
                  };
                }
              }
            }
          };
          that.setData({
            cardListgetInfo: data.supplierCartList,
          })
          that.calculateprice();
        }

        that.setData({
          cardListgetInfo: data.supplierCartList,
          IsCheck: false,
           
        })
      }
    })
  },
  sub: function(e) { //减数量
    //console,log(e)
    if (e.currentTarget.dataset.quantity == 1) {
      return;
    }
    this.setData({
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      quantity: e.currentTarget.dataset.quantity - 1,
      IsCheck: false,
      totalnum: 0,
      totalpice: 0,
     
    })
    this.UpdataShopListInfo();
  },
  add: function(e) { //加数量
    if (e.currentTarget.dataset.quantity > e.currentTarget.dataset.balance) {
      $.alert('数量超出范围');
      return;
    }
    this.setData({
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      quantity: e.currentTarget.dataset.quantity + 1,
      IsCheck: false,
      totalnum: 0,
      totalpice: 0,
      balance: e.currentTarget.dataset.balance, //库存
     
    })

    this.UpdataShopListInfo();
  },
  writenum: function(e) {
    //console,log(e.detail.value, e.currentTarget.dataset.balance);
    var numRegExp =/(^[1-9]\d*$)/;    
    if (!(numRegExp.test(e.detail.value))){
      $.alert('数量不能小于1');   
      this.setData({
        id: e.currentTarget.dataset.id,
        price: e.currentTarget.dataset.price,
        quantity:1,
        IsCheck: false,
        totalnum: 0,
        totalpice: 0,
        balance: e.currentTarget.dataset.balance, //库存

      })
      this.UpdataShopListInfo();
      return;
    }
    if (parseInt(e.detail.value) > e.currentTarget.dataset.balance) {
      $.alert('数量超出范围');
      return;
    }
    this.setData({
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      quantity: e.detail.value,
      IsCheck: false,
      totalnum: 0,
      totalpice: 0,
      balance: e.currentTarget.dataset.balance //库存
    })

    this.UpdataShopListInfo();
  },
  UpdataShopListInfo: function() { //更新购物车数目
    var val = {
      id: this.data.id,
      systemType: "B2C",
      deviceType: "MOBILE",
      unitPrice: this.data.price,
      quantity: this.data.quantity
    }
    var that = this;
    xnServiceapi.cartNew(val, function(data) {
      //console,log("更新购物车", data)
      if (data.firstErrorMessage == "") {
        that.ShopListInfo()
      }
    })
  },

  calculateprice: function() { //计算价钱
    var totalpice =0;
    var num = 0;
    var arr = [];
    var pid = [];
    for (var x in this.data.cardListgetInfo) {
      for (var j in this.data.cardListgetInfo[x].cartList) {
        if (this.data.cardListgetInfo[x].cartList[j].IsCheck == true) {
          totalpice += this.data.cardListgetInfo[x].cartList[j].unitPrice * this.data.cardListgetInfo[x].cartList[j].quantity;
          num = num + 1;
          pid.push(this.data.cardListgetInfo[x].cartList[j].id);
          var List = {
            itemId: this.data.cardListgetInfo[x].cartList[j].itemId,
            quantity: this.data.cardListgetInfo[x].cartList[j].quantity,
            cartid: this.data.cardListgetInfo[x].cartList[j].id
          };
          arr.push(List);
        }
      }
    };
    this.setData({
      totalpice: (totalpice).toFixed(2),
      num: num,
      pid: pid,
      arr: arr,
      Piceflag: (totalpice).toFixed(2),
    })
    this.setData({
      Piceflag:this.data.totalpice 
    })
  },
  ckall: function() { //点击选中全部
    this.setData({
      totalnum: 0,
      shopItem: []
    })
    for (var x in this.data.cardListgetInfo) {
      for (var j in this.data.cardListgetInfo[x].cartList) {
        this.data.cardListgetInfo[x].cartList[j].IsCheck = true;
        //console,log(this.data.cardListgetInfo)
        this.data.shopItem.push(this.data.cardListgetInfo[x].cartList[j].id)
        this.setData({
          cardListgetInfo: this.data.cardListgetInfo,
          IsCheck: true,
          totalnum: this.data.totalnum + 1
        })
        this.calculateprice()
      }
    }
  },
  ckalldel: function() { //点击取消全部
    //console,log('56132123123')
    for (var x in this.data.cardListgetInfo) {
      for (var j in this.data.cardListgetInfo[x].cartList) {
        this.data.cardListgetInfo[x].cartList[j].IsCheck = false;
        // //console,log(this.data.cardListgetInfo)
        this.setData({
          cardListgetInfo: this.data.cardListgetInfo,
          IsCheck: false,
          totalpice: 0,
          totalnum: 0,
          shopItem: []
        })
      }
    }
  },
  ckitems: function(e) {
    this.setData({
      IsCheck: false,
      itemid: e.currentTarget.dataset.itemid
    })
  },
  del: function() { //删除购物车
    var that = this;
    console.log(that.data.pid.length)
    if (that.data.pid.length==0){
      $.confirm('请选择要删除的商品!')
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function(res) { //确认之后执行的
        //console,log(res);
        if (res.confirm) {
          // if (that.data.shopItem.length == 1) {
          //console,log(that.data.shopItem)
          if (that.data.pid.length == 1) {
            that.setData({
              pid: that.data.pid + ''
            })
            var val = {
              id: that.data.pid
            }
            //console,log(val)
            xnServiceapi.cartdelete(val, function(data) { //删除单个
              //console,log(data)
              if (data.firstErrorMessage == "") {
                that.ShopListInfo()
                that.setData({
                  totalnum: 0,
                  totalpice: 0
                })
              }
            })
          } else {

            var val = {
              ids: that.data.pid
            }
            //console,log(val)
            xnServiceapi.batchCartdelete(val, function(data) { //删除多个
              //console,log(data)
              if (data.firstErrorMessage == "") {
                that.ShopListInfo()
              }
            })
          }

          // } 
          // else {
          //   var val = {
          //     ids: that.data.shopItem
          //   }
          //   //console,log(val)
          //   xnServiceapi.batchCartdelete(val, function(data) { //删除多个
          //     //console,log(data)
          //     if (data.firstErrorMessage == "") {
          //       that.ShopListInfo()
          //     }
          //   })
          // }
        }
      }
    })
  },
  compile: function() {
    this.setData({
      flag: true
    })
  },
  accomplish: function() {
    this.setData({
      flag: false
    })
  },
  submitorder: function() {
    app.globalData.Giftcardamount = '',
      app.globalData.GiftcardamountID = '',
      app.globalData.benefitAmount = '',
      app.globalData.couponDefinitionId = '',
      app.globalData.numval = '',
      app.globalData.pointRulepick = '',
      app.globalData.Commercialinvoice = ''
    var arr = JSON.stringify(this.data.arr)
    if (this.data.num == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择商品进行结算',
      })
    } else {
      wx.navigateTo({
        url: '../ordersubmit/ordersubmit?itemid=' + arr,
      })

      this.ShopListInfo()
      this.setData({
        arr: [],
        shopItem: [],
        totalpice: 0,
        totalnum: 0,
        IsCheck: false
      })
    }

  },
  onReady: function() {

  },
  onShow: function() {
    this.ShopListInfo(),
      this.setData({
        IsCheck: false,
        totalpice: 0,
        totalnum: 0,
        shopItem: [],
        flag: false,
        linshi: [],
        IsShow: false,
        num:0
      })
  },
  _bindStore: function(e) { //点击门店事件
    var that = this;
    var cardListgetInfo = that.data.cardListgetInfo;
    for (var i = 0; i < cardListgetInfo.length; i++) {
      if (e.currentTarget.dataset.vid == cardListgetInfo[i].id) {
        if (cardListgetInfo[i].IsCheck == true) {
          cardListgetInfo[i].IsCheck = false;
        } else {
          cardListgetInfo[i].IsCheck = true
        };
        that._storeList(cardListgetInfo[i]);
      }
    };
    this.setData({
      cardListgetInfo: cardListgetInfo,
    })
  },
  _storeList: function(Info) { //处理点击门店显示数据
    var that = this;
    var cardListgetInfo = that.data.cardListgetInfo;
    for (var i = 0; i < cardListgetInfo.length; i++) {
      if (Info.id == cardListgetInfo[i].id) {
        for (var j = 0; j < cardListgetInfo[i].cartList.length; j++) {
          if (cardListgetInfo[i].IsCheck == true) {
            cardListgetInfo[i].cartList[j].IsCheck = true;
          } else {
            cardListgetInfo[i].cartList[j].IsCheck = false;
          };
        }
      }
    };
    this.setData({
      cardListgetInfo: cardListgetInfo,
    });
    that.judge();
  },
  _bindPro: function(e) { //点击商品事件
    //console,log(this.data.cardListgetInfo)
    var that = this;
    var cardListgetInfo = that.data.cardListgetInfo;
    for (var i = 0; i < cardListgetInfo.length; i++) {
      for (var j = 0; j < cardListgetInfo[i].cartList.length; j++) {
        if (e.currentTarget.dataset.id == cardListgetInfo[i].cartList[j].id) {
          if (cardListgetInfo[i].cartList[j].IsCheck == true) {
            cardListgetInfo[i].cartList[j].IsCheck = false;
          } else {
            cardListgetInfo[i].cartList[j].IsCheck = true;
          };
          that._ProList(e);
        }
      }
    };
    this.setData({
      cardListgetInfo: cardListgetInfo,
    })
  },
  _ProList: function(e) { //处理商品选中门店的显示
    var that = this;
    var cardListgetInfo = that.data.cardListgetInfo;
    var _isTrue = true;
    var _Vid = e.currentTarget.dataset.vid;
    for (var i = 0; i < cardListgetInfo.length; i++) {
      for (var j = 0; j < cardListgetInfo[i].cartList.length; j++) {
        if (_Vid == cardListgetInfo[i].id) {
          if (cardListgetInfo[i].cartList[j].IsCheck == false) {
            _isTrue = false;
            break;
          };
        }
      }
    };
    for (var i = 0; i < cardListgetInfo.length; i++) {
      //console,log(_isTrue, _Vid, cardListgetInfo[i].id);
      if (_Vid == cardListgetInfo[i].id) {
        if (_isTrue == true) {
          cardListgetInfo[i].IsCheck = true;
        } else {
          cardListgetInfo[i].IsCheck = false;
        }
      };
    }
    this.setData({
      cardListgetInfo: cardListgetInfo,
    });
    that.judge();
  },
  _bindCart: function(e) { //全选点击事件
    var that = this;
    var cardListgetInfo = that.data.cardListgetInfo;
    for (var i = 0; i < cardListgetInfo.length; i++) {
      for (var j = 0; j < cardListgetInfo[i].cartList.length; j++) {
        if (e.currentTarget.dataset.isshow == 1) {
          cardListgetInfo[i].cartList[j].IsCheck = true;
          cardListgetInfo[i].IsCheck = true;
          this.setData({
            IsShow: true,
          })
        } else {
          cardListgetInfo[i].cartList[j].IsCheck = false;
          cardListgetInfo[i].IsCheck = false;
          this.setData({
            IsShow: false,
          })
        };
      }
    };
    this.setData({
      cardListgetInfo: cardListgetInfo,
    });
    that.judge();
  },
  judge: function() { //全选按钮是否选中
    var that = this;
    var cardListgetInfo = that.data.cardListgetInfo;
    var IsSet = true;
    for (var i = 0; i < cardListgetInfo.length; i++) {
      if (cardListgetInfo[i].IsCheck == false) {
        IsSet = false;
        break;
      }
    };
    if (IsSet == true) {
      that.setData({
        IsShow: true
      })
    } else {
      that.setData({
        IsShow: false
      })
    };
    that.setData({
      linshi: cardListgetInfo,
    })
    that.calculateprice();
  },

})