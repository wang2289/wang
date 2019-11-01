// pages/addresslist/addresslist.js
var app = getApp();
const xnServiceapi = require('../../service/confirmanorder.js');
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: [],
    memberid: "", //地址id
    sunbit: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    this.setData({
      sunbit: options.sunbit
    })
  },
  memberLocation: function() {
    var val = {
      memberId: app.globalData.memberId,
      pageNumber: 1,
      pageSize: 10
    }
    var that = this;
    xnServiceapi.memberLocationfind(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        that.setData({
          addressInfo: data.result
        })
      }
    })
  },

  AddAddress: function() {
    wx.navigateTo({
      url: '../addressmanage/addressmanage?sunbit=' + this.data.sunbit,
    })
  },
  EditAddress: function(e) { //  编辑收货地址
    console.log(e)
    wx.navigateTo({
      url: '../addressmanage/addressmanage?provname=' + e.currentTarget.dataset.provname + '&provid=' + e.currentTarget.dataset.provid + "&cityid=" + e.currentTarget.dataset.cityid + "&cityname=" + e.currentTarget.dataset.cityname + "&districtid=" + e.currentTarget.dataset.districtid + "&districtname=" + e.currentTarget.dataset.districtname + "&ctname=" + e.currentTarget.dataset.ctname + "&ctphone=" + e.currentTarget.dataset.ctphone + "&postcode=" + e.currentTarget.dataset.postcode + "&rowVersion=" + e.currentTarget.dataset.rowversion + "&isDefault=" + e.currentTarget.dataset.isdefault + '&address=' + e.currentTarget.dataset.address + "&id=" + e.currentTarget.dataset.id + "&tab=" + 1 + "&sunbit=" + this.data.sunbit,
    })
  },
  DelAddress: function(e) { //删除收货地址
    var that = this;
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确认删除？',
      success: function(res) {
        console.log(res)
        if (res.confirm) {
          var val = {
            id: e.currentTarget.dataset.id
          }
          xnServiceapi.memberLocationdelete(val, function(data) {
            console.log(data)
            if (data.firstErrorMessage == "") {
              wx.showToast({
                title: '删除成功',
              })
              that.memberLocation()
            }
          })
        }
      }
    })
  },
  ckitem: function(e) { //设置为默认
    console.log(e)
    this.setData({
      memberid: e.currentTarget.dataset.mebid
    })
   // this.defaultaddress()
    wx.navigateBack({
      delta: 1
    })
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      locationid: e.currentTarget.dataset.mebid
    })
  },
  defaultaddress: function() { //添加默认地址
    var that = this;
    var vsl = {
      id: that.data.memberid
    }
    xnServiceapi.defaultMemberLocationset(vsl, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        if (that.data.sunbit == 1) {
          $.alert("设置成功", function() {
            setTimeout(function() {
              that.memberLocation();
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }, 1000);

        } else if (that.data.sunbit == 2) {
          $.alert("设置成功", function() {
            setTimeout(function() {
              that.memberLocation();
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }, 1000);
        } else {
          $.alert("设置成功", function() {
            setTimeout(function() {
              that.memberLocation()
            }, 1000)
          }, 1000)
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
    this.memberLocation()
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
    //判断页面有没有被删除
    var isDeleted = true;
    if (!this.data.sunbit) {
      isDeleted = fasle;
    } else {
      var addressList = this.data.addressInfo;
      for (var i in addressList) {
        if (this.data.sunbit == addressList[i].id) {
          isDeleted = false;
        }
      }
    }

    if (isDeleted) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        locationid: ''
      })
    }
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