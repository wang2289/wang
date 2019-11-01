// pages/Usergiftcard/Usergiftcard.js
var app = getApp();
var api = require('../../service/personalcenter.js')
var $ = require('../../utils/util.js');
const xnServiceapi = require('../../service/confirmanorder.js');
const notice = require('../../utils/notice.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isClick: false,
    Giftcarddetails: [],
    Consumptionamount: 0, //消费金额
    isConfirm: false,
    picture: '../../img.giftcard.png',
    GiftcardamountID: [],
    amount: 0,
    Giftcardamount: 0,
    GiftcardamountTwo: 0,
    Giftcardamountone: 0,
    cardid: '',
    fid: -1,
    DefaultaddressInfo:[],
    locationid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
     // amount: parseFloat(options.amount)
      locationid: options.locationid
    })
    this.prePaidCardEntity();
    this.Defaultaddress()
  },
  prePaidCardEntity: function() { //获取礼品卡
    var val = {
      memberId: app.globalData.memberId,
      isAvailable: true,
      bindMemberId: app.globalData.memberId
    }
    console.log(val)
    var that = this
    api.prePaidCardEntity(val, function(data) {
      if (data.result != "") {
        that.setData({
          Giftcarddetails: data.result
        })
        for (var x in data.result) {
          data.result[x].isClick = false;
          data.result[x].amount = 0;
          for (var j in app.globalData.GiftcarInfo) {
            if (app.globalData.GiftcarInfo[j].bindSecurity == data.result[x].bindSecurity) {
              data.result[x].isClick = true;
              data.result[x].amount = app.globalData.GiftcarInfo[j].amount;
            }
          }
          that.setData({
            amount: parseFloat(data.result[x].amount)
          })
        }
        that.setData({
          Giftcarddetails: data.result
        })
        console.log(that.data.Giftcarddetails)
      } else {
        //  $.confirm(data.firstErrorMessage)
      }
    })
  },
  Clickselected: function(e) { //点击选中
    this.setData({
      GiftcardamountTwo: 0,
      Giftcardamountone: 0,
      fid: e.currentTarget.dataset.index
    })
    app.globalData.Giftcardamount = 0;
    app.globalData.GiftcardamountID = [];
    app.globalData.GiftcarInfo = [];
    for (var x in this.data.Giftcarddetails) {
      if (this.data.Giftcarddetails[x].bindSecurity == e.currentTarget.dataset.cardid) {
        this.data.Giftcarddetails[x].isClick = true;
        if (app.globalData.amount2 >= this.data.Giftcarddetails[x].surplusAmount){   //总金额大于礼品卡金额
          this.data.Giftcarddetails[x].amount = this.data.Giftcarddetails[x].surplusAmount;
          app.globalData.amount2 = (app.globalData.amount2 - this.data.Giftcarddetails[x].surplusAmount).toFixed(2);
          console.log(app.globalData.amount2)
         break;
        }
        if (app.globalData.amount2 < this.data.Giftcarddetails[x].surplusAmount) {   //总金额小于礼品卡金额
          this.data.Giftcarddetails[x].amount = app.globalData.amount2;
          app.globalData.amount2 = 0
         break;
        }
        // for (var j in this.data.Giftcarddetails) {
        //   if (this.data.Giftcarddetails[j].isClick) {
        //     if (this.data.Giftcarddetails[x].amount < this.data.Giftcarddetails[j].storedValue) {
        //       console.log(this.data.Giftcarddetails[x])
        //       this.setData({
        //         Giftcardamountone: this.data.Giftcarddetails[x].amount
        //       })
        //     } else {
        //       this.setData({
        //         GiftcardamountTwo: this.data.GiftcardamountTwo + parseFloat(this.data.Giftcarddetails[j].surplusAmount)
        //       })
        //       console.log(this.data.GiftcardamountTwo, '////', parseFloat(this.data.Giftcarddetails[j].surplusAmount))
        //       console.log(this.data.GiftcardamountTwo)
        //     }
        //     this.data.GiftcardamountID.push(this.data.Giftcarddetails[j].bindSecurity);
        //     app.globalData.GiftcardamountID = this.data.GiftcardamountID
        //     app.globalData.GiftcarInfo.push(this.data.Giftcarddetails[j]);
        //   }
        // }
        
      //  app.globalData.amount2 = this.data.Giftcarddetails[x].amount - this.data.GiftcardamountTwo
      }
    }
    
     this.setData({
        //  Consumptionamount: this.data.Giftcarddetails[x].storedValue,
          Giftcarddetails: this.data.Giftcarddetails,
        })
        console.log(this.data.Giftcarddetails)
  },
  Clickcancel: function(e) { //点击取消
    this.setData({
      GiftcardamountTwo: 0,
      Giftcardamountone: 0,
      fid: e.currentTarget.dataset.index
    })
    app.globalData.Giftcardamount = 0;
    app.globalData.GiftcardamountID = [];
    app.globalData.GiftcarInfo = [];
    for (var x in this.data.Giftcarddetails) {
      if (this.data.Giftcarddetails[x].bindSecurity == e.currentTarget.dataset.cardid) {
        this.data.Giftcarddetails[x].isClick = false;
        app.globalData.amount2 = app.globalData.amount2 + this.data.Giftcarddetails[x].amount;
        console.log(app.globalData.amount2)
        this.data.Giftcarddetails[x].amount = 0;
        // for (var j in this.data.Giftcarddetails) {
        //   if (this.data.Giftcarddetails[j].isClick == true) {
        //     if (this.data.Giftcarddetails[x].amount < this.data.Giftcarddetails[j].storedValue) {
        //       console.log(this.data.Giftcarddetails[x])
        //       this.setData({
        //         Giftcardamountone: this.data.Giftcarddetails[x].amount
        //       })
        //     } else {
        //       this.setData({
        //         GiftcardamountTwo: this.data.GiftcardamountTwo + parseFloat(this.data.Giftcarddetails[j].surplusAmount)
        //       })
        //       console.log(this.data.GiftcardamountTwo, '////', parseFloat(this.data.Giftcarddetails[j].surplusAmount))
        //       console.log(this.data.GiftcardamountTwo)
        //     }
        //     this.data.GiftcardamountID.push(this.data.Giftcarddetails[x].bindSecurity);
        //     app.globalData.GiftcardamountID = this.data.GiftcardamountID
        //     app.globalData.GiftcarInfo.push(this.data.Giftcarddetails[j]);

        //   }
        // }
        this.setData({
          Giftcarddetails: this.data.Giftcarddetails,
        //  amount: this.data.Giftcarddetails[j].amount
        })
        console.log(this.data.Giftcarddetails)
      }
    }
  },
  btn: function() { //点击跳转页面
    app.globalData.GiftcardamountID=[];
    app.globalData.Giftcardamount = 0;
    app.globalData.GiftcarInfo = [];

    for (var x in this.data.Giftcarddetails){
      if (this.data.Giftcarddetails[x].isClick){
        var arr = { 'bindSecurity': this.data.Giftcarddetails[x].bindSecurity, 'amount': this.data.Giftcarddetails[x].amount}
        app.globalData.GiftcardamountID.push(arr);
        app.globalData.Giftcardamount = app.globalData.Giftcardamount + this.data.Giftcarddetails[x].amount;
        app.globalData.GiftcarInfo.push(this.data.Giftcarddetails[x]);
    }
   }
    notice.sendNotice("Refresh", { name: this.data.DefaultaddressInfo});
    wx.navigateBack({
      delta:  1
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
    prevPage.setData({
      locationid: this.data.locationid,
      Defaultaddressflag:true
    })
  },
  Defaultaddress: function () { //获取会员默认地址
    var val = {
      memberId: app.globalData.memberId,
      pageNumber: 1,
      pageSize: 0
    }
    var that = this;
    xnServiceapi.memberLocationfind(val, function (data) {
      console.log(data)
      if (data.firstErrorMessage == ""){
         that.setData({
           DefaultaddressInfo: data.result
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
    this.onLoad()
    //this.prePaidCardEntity()
    // this.setData({
    //   amount: app.globalData.amount2
    // })
    // this.prePaidCardEntity()
    console.log(app.globalData.amount2)
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