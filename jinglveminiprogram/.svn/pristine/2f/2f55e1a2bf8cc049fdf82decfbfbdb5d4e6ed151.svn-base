const util = require('../../../utils/util.js')
Page({
  data: {
    carts: [], // 购物车列表
    hasList: false, // 列表是否有数据
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: true, // 全选状态，默认全选
    contineflag: false, //是否继续,
    isshowdatelist: false, //是否展示时间选择
    datelist: [],
    selectdatelist: [], //  选择的时间列表
    obj: {
      name: "hello"
    },
    addresflag: true,
    defaultaddress:{}


  },

  payclick: function() {
    var that = this;
    var cartslist = this.data.carts;
    var selectdatelist = this.data.selectdatelist;
    var result = "";
    var date = "";
    for (let i = 0, len = cartslist.length; i < len; i++) {
   
        result += cartslist[i].type + ':' + cartslist[i].id + ';'

    }
    for (let i = 0; i < selectdatelist.length; i++) {
      date += selectdatelist[i].aomid + ':' + selectdatelist[i].dateyear + ';'
    }
    let addres="";
    if (this.data.defaultaddress!="")
    {
      addres =  this.data.defaultaddress.receiveaddress + "|" + this.data.defaultaddress.receivetname + "|" + this.data.defaultaddress.tel 
    }

    result = result.substr(0, result.length - 1) + '|' + this.data.totalPrice + '|' + addres;
    date = date.substr(0, date.length - 1)

    if (!that.data.contineflag) {
      util.requestsendtoken('api/UserShopping/GetUserShoppingListDetail?', null, {
        result: result,

      }, res => {

        console.log(res)
        if (res.code == 0) {
          if (res.count > 0) {
            var listarry = [];
            for (var i = 0; i < res.data.length; i++) {
              var aomid = res.data[i].id;
              var dateyear = "";
              for (var x = 0; x < res.data[i].date.length; x++) {
                if (res.data[i].date[x].checked) {
                  dateyear = res.data[i].date[x].year;
                }
              }
              var parmer = {
                aomid: aomid,
                dateyear: dateyear
              }
              listarry.push(parmer)
            }
            that.setData({
              datelist: res.data,
              isshowdatelist: true,
              selectdatelist: listarry

            })
          } else {
            wx.login({
              success: function(res) {
                if (res.code) {
                  console.log(result)
                  console.log("code:" + res.code)
                  that.generateOrder(res.code, result, date)
                }

              }
            })

          }


        }

      })

    } else {
      wx.login({
        success: function(res) {
          if (res.code) {
            console.log(result)
            console.log("code:" + res.code)
            that.generateOrder(res.code, result, date)
          }

        }
      })
    }
  },
  //时间选择事件
  radioChange: function(e) {
    var index = e.currentTarget.dataset.index;
    var date = e.detail.value;
    var oldlist = this.data.selectdatelist;
    for (var i = 0; i < oldlist.length; i++) {
      if (i == index) {
        oldlist[i].dateyear = date;

      }
    }
    this.setData({
      selectdatelist: oldlist
    })
    console.log(index + "-" + date)
  },
  //时间确认按钮
  dateentity: function(e) {
    this.setData({
      contineflag: true,
      isshowdatelist: false
    })
  },
  //生成商户订单
  generateOrder: function(code, result, date) {
    var that = this
    util.requestposttoken("api/WX/pay", {
      code: code,
      result: result,
      date: date
    }, res => {
      if (res.code == 0) {
        var param = {
          "timeStamp": res.timeStamp,
          "package": res.package,
          "paySign": res.paySign,
          "signType": "MD5",
          "nonceStr": res.nonceStr
        };
        //发起支付
        that.pay(param);
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 5000
        })
      }
    })



  },
  //支付
  pay: function(param) {
    var that = this;
    console.log("发起支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function(res) {
        console.log("success");
        console.log(res);
      },
      fail: function(res) {
        console.log("fail")
        console.log(res);
      },
      complete: function(res) {
        console.log("complete");
        console.log(res)
      }
    })
  },
  onLoad: function(options) {
    let getresult = options.result;
    wx.setStorageSync('rssult', getresult);
 

  },

  setdata() {
    let getresult = wx.getStorageSync('rssult');
 
    util.requestsendtoken('api/UserShopping/CheckUserShopping?', null, {
      result: getresult
    }, res => {

      this.setData({

        carts: res.data.result,
        defaultaddress: res.data.defaultaddress
        // addresflag:res.data.havejiaocai
      });
      if (res.data.result.length) {
        this.setData({
          hasList: true
        });
        this.getTotalPrice();
      }

    })
  },
  //跳转收货地址
  onclicknavigto: function(e) {
    wx.navigateTo({
      url: '../address/address',
    })
  },
// changeData:function(e){
//   util.requestsendtoken('api/UsersAddress/GetDefaultAddress?', null, {}, res => {
//     console.log(res);
//     this.setdata({
//       defaultaddress: res.data.defaultaddress
//     })

//   })
// },

  onShow() {
    console.log("onshow");
    this.setdata();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    var aomid = carts[index].id;

    util.requestsendtoken('api/UserShopping/DelUserShopping?', null, {
      aomid: aomid
    }, res => {

      if (res.code == 0) {
        carts.splice(index, 1);
        this.setData({
          carts: carts
        });
        if (!carts.length) {
          this.setData({
            hasList: false
          });
        } else {
          this.getTotalPrice();
        }
      }
    })



  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },




  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
      var money = Number(carts[i].money)
      total += money; // 所有价格加起来
    
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }

})