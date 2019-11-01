// pages/invoiceinformation/invoiceinformation.js
var app = getApp()
const xnServiceapi = require('../../service/certificate.js');
const tenantId = require('../../config').tenantId;
 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tapindex: 0,
    creditcode: "", //社会信用代码
    companyname: "", //公司名称
    companaddress: "", //公司地址
    companyphone: "", //公司电话
    openingbank: "", //开户行名称
    openingbankname: "", //开户行银行账号
    cityid: 0,
    cityname: "",
    districtid: 0,
    districtname: "",
    provid: 0,
    provname: "",
    id: "",
    itemid: "",
    numval: "",
    sendLocationId: '', //增票地址id
    Collectid: '', //增票id
    rowVersion: '',
    Updateid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   console.log(options)
    this.setData({
      cityid: options.cityid,
      cityname: options.cityname,
      districtid: options.districtid,
      districtname: options.districtname,
      provid: options.provid,
      provname: options.provname,
      tapindex: options.tapindexa,
      itemid: options.itemid,
      invoiceTypea: "COMMON",
      invoiceTypeb: "VAT",
      invoice: "", //发票抬头
      CollecttotalCount:'',
      invoice: app.globalData.Commercialinvoice
    })
    this.ObtainTicketList()
  },

  allOrders: function() { //不开发票
    this.setData({
      tapindex: 1,
    });
    wx.navigateBack({
      delta: 1
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      tapindex: 1
    })
  },
  toBePaid: function() { //普通发票
    this.setData({
      tapindex: 2,
      
    });
  },
  receiptOfGoods: function() { //增值税发票
    this.setData({
      tapindex: 3,
    });
    if (this.data.CollecttotalCount== '0'){
    wx.redirectTo({
      url: '../newcertificate/newcertificate?striry=' + 1,
    })
  }
  },
  successbtn: function() {
    if (this.data.tapindex == 1) {
      wx.redirectTo({
        url: '../ordersubmit/ordersubmit?tapindex=' + 1,
      })
    } else if (this.data.tapindex == 2) {
      app.globalData.Commercialinvoice = this.data.invoice
      wx.navigateBack({
        delta: 1
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        tapindex: 2,
        invoiceTypes: this.data.invoiceTypea,
        invoice: this.data.invoice,
      })
    } else if (this.data.tapindex == 3) {
      var val = {
        id: this.data.Updateid,
        countryId: 86,
        countryName: "中国",
        provinceId: this.data.provid,
        provinceName: this.data.provname,
        cityId: this.data.cityid,
        cityName: this.data.cityname,
        districtId: this.data.districtid,
        districtName: this.data.districtname
      }
      var that = this;
      console.log(val)
      xnServiceapi.locationupdate(val, function(data) {
        console.log(data)
        if (data.firstErrorMessage == '') {
          that.locationget()
          that.addInvoice();

        }
      })
      // wx.redirectTo({
      //   url: '../ordersubmit/ordersubmit?creditcodes=' + this.data.creditcode + "&companynames=" + this.data.companyname + "&companaddresss=" + this.data.companaddress + "&companyphones=" + this.data.companyphone + "&openingbanks=" + this.data.openingbank + "&openingbanknames=" + this.data.openingbankname + "&invoiceTypes=" + VAT +"&tapindex="+3,
      // })
    }
  },
  creditcode: function(e) { //社会信用代码
    //console.log(e)
    this.setData({
      creditcode: e.detail.value
    })
  },
  companyname: function(e) { //公司名称
    //console.log(e)
    this.setData({
      companyname: e.detail.value
    })
  },
  showbox: function(e) { //公司地址
    // //console.log(e)
    // this.setData({
    //   companaddress: e.detail.value
    // })
    wx.navigateTo({
      url: '../Lookat/Lookat?tab=' + 2 + "&tapindexa=" + 3 + "&itemid=" + this.data.itemid,
    })
  },
  companyphone: function(e) { //公司电话
    //console.log(e)
    this.setData({
      companyphone: e.detail.value
    })
  },
  openingbank: function(e) { //开户行名称
    //console.log(e)
    this.setData({
      openingbank: e.detail.value
    })
  },
  openingbankname: function(e) { //开户行银行账号
    //console.log(e)
    this.setData({
      openingbankname: e.detail.value
    })
  },
  invoicelookedup: function(e) {
    //console.log(e)
    this.setData({
      invoice: e.detail.value
    })
  },
  addInvoice: function() { //更新增票
    var daaress = this.data.provname + this.data.cityname + this.data.districtname
    var val = {
      id: this.data.Collectid ,
      sendLocationId: this.data.sendLocationId,
      memberId: app.globalData.memberId,
      invoiceTitle: this.data.companyname,
      taxpayerId: this.data.creditcode,
      companyAddress: daaress,
      companyTel: this.data.companyphone,
      bankName: this.data.openingbank,
      bankAccount: this.data.openingbankname,
      rowVersion: this.data.rowVersion
    }
    //console.log(val) 
    var that = this
    xnServiceapi.addInvoiceupdate(val, function(data) {
      console.log(data)
    
      if (data.firstErrorMessage == "") {
        that.ObtainTicketList()
        wx.showToast({
          title: '保存成功',
        })
        wx.navigateBack({
          delta: -2
        })
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          itemid: JSON.parse(that.data.itemid),
          creditcode: that.data.creditcode, //社会信用代码
          companyname: that.data.companyname, //公司名称
          companaddress: that.data.provname + that.data.cityname + that.data.districtname, //公司地址
          companyphone: that.data.companyphone, //公司电话
          openingbank: that.data.openingbank, //开户行名称
          openingbankname: that.data.openingbankname, //开户行银行账号
          invoiceTypes: that.data.invoiceTypeb, //发票抬头
          tapindex: 3,
        })
      }
    })
  },
  ObtainTicketList: function() { //查询增票
    var val = {
      memberId: app.globalData.memberId,
      tenantId: tenantId,
      pageNumber: 1,
      pageSize: 10,
    }
    //console.log(val)
    var that = this;
    xnServiceapi.addInvoicefind(val, function(res) {
      console.log(res)
      
      if (res.firstErrorMessage == "") {
        that.setData({
          CollecttotalCount: res.totalCount,
        })
        for (var x in res.result) {
          if (res.result[x].isDefault == true) {
            that.setData({
              Collect: res.result,
              creditcode: res.result[x].taxpayerId, //社会信用代码
              companyname: res.result[x].invoiceTitle, //公司名称
              companaddress: res.result[x].taxpayerId, //公司地址
              companyphone: res.result[x].companyTel, //公司电话
              openingbank: res.result[x].bankName, //开户行名称
              openingbankname: res.result[x].bankAccount, //开户行银行账号
              sendLocationId: res.result[x].sendLocationId,
              Collectid: res.result[x].id,
              rowVersion: res.result[x].rowVersion
            })
          } else {
            that.setData({
              
              Collect: res.result,
              creditcode: res.result[res.result.length - 1].taxpayerId, //社会信用代码
              companyname: res.result[res.result.length - 1].invoiceTitle, //公司名称
              companaddress: res.result[res.result.length - 1].taxpayerId, //公司地址
              companyphone: res.result[res.result.length - 1].companyTel, //公司电话
              openingbank: res.result[res.result.length - 1].bankName, //开户行名称
              openingbankname: res.result[res.result.length - 1].bankAccount, //开户行银行账号
              sendLocationId: res.result[res.result.length - 1].sendLocationId,
              Collectid: res.result[res.result.length - 1].id,
              rowVersion: res.result[res.result.length - 1].rowVersion
            })
          }
        }

        that.locationget()
      }
    })
  },
  locationget: function() { //增票地址
    var val = {
      id: this.data.sendLocationId
    }
    var that = this;
    xnServiceapi.locationget(val, function(res) {
      console.log(res)
      if (res.firstErrorMessage == '') {
        that.setData({
          Updateid: res.location.id,
          cityid: res.location.cityId,
          cityname: res.location.cityName,
          districtid: res.location.districtId,
          districtname: res.location.districtName,
          provid: res.location.provinceId,
          provname: res.location.provinceName,
          sendLocationId: res.location.id
        })
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
    //  this.ObtainTicketList()
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