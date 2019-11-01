// pages/addressmanage/addressmansge.js
var app = getApp();
const xnService = require('../../service/confirmanorder.js');
const xnServiceapi = require('../../service/service.js');
var $ = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0, //主键id
    cityid: 0,
    cityname: "",
    districtid: 0,
    districtname: "",
    provid: 0,
    provname: "",
    consignee: "",
    conPhone: "",
    conaddress: "",
    conNumber: "",
    isClick: false,
    memberid: 0, //会员默认地址id
    rowVersion: 0,
    tab: 0,
    addressInfo: "",
    sunbit: "",
    addressColor:"#999999",
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var addressInfo = options.provname + options.cityname + options.districtname || '请选择';
    console.log(options)
    this.setData({
      cityid: options.cityid,
      cityname: options.cityname,
      districtid: options.districtid,
      districtname: options.districtname,
      provid: options.provid,
      provname: options.provname,
      consignee: options.ctname,
      conPhone: options.ctphone,
      conNumber: options.postcode,
      rowVersion: options.rowVersion,
      isClick: false,
      conaddress: options.address ? options.address : '',
      id: options.id,
      tab: options.tab,
      addressInfo: addressInfo,
      sunbit: options.sunbit,
    })
    if (addressInfo=="请选择"){
      this.setData({
        addressColor:"red"
      })
    }
    if (options.isDefault == "false" || options.isDefault == undefined) {
      this.setData({
        isClick: false
      })
    } else if (options.isDefault == "true") {
      this.setData({
        isClick: true
      })
    }
    var that = this;
    if (that.data.tab != 1) {
      xnServiceapi.loginnewId({}, function(data) {
        that.setData({
          id: data
        })
      })
    }
  },
  showbox: function() {
    wx.navigateTo({
      url: '../Lookat/Lookat',
    })
  },
  inputconsignee: function(e) {
    this.setData({
      // consignee: e.detail.value,
      consignee: e.detail.value.replace(/\s+/g, '')
    })
  },
  inputconPhone: function(e) {
    console.log(e)
    this.setData({
      conPhone: e.detail.value.replace(/\s+/g, '')
    })
  },
  inputconNumber: function(e) {
    console.log(e)
    this.setData({
      conNumber: e.detail.value.replace(/\s+/g, '')
    })
  },
  inputconaddress: function(e) {
    console.log(e)
    this.setData({
      conaddress: e.detail.value.replace(/\s+/g, '')
    })
  },
  submitbtn: function() {
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    var  regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if ($.isNull(this.data.consignee)) {
      $.confirm("请输入您的姓名")
      return;
    }
    if ($.isNull(this.data.conPhone)) {
      $.confirm("请输入您的手机号")
      return;
    }
    if (!(/^1\d{10}$/.test(this.data.conPhone))) {
      $.confirm("请输入正确的手机号")
      return;
    }
    if (this.data.addressInfo == '请选择') {
      $.confirm("请选择所在地区")
      return;
    }

    if ($.isNull(this.data.conNumber)) {
      $.confirm("请输入邮编")
      return;
    }
    if (this.data.conNumber.length < 6) {
      $.confirm("请输入正确邮编")
      return;
    }

    if (this.data.conaddress.length < 5) {
      $.confirm("详细地址不少于5个字")
      return;
    }
    if (regEn.test(this.data.conaddress) || regCn.test(this.data.conaddress)) {
      $.confirm("请输入正确的详细地址");
      return false;
    }
    var val = {
      id: this.data.id,
      memberId: app.globalData.memberId,
      postCode: this.data.conNumber,
      contactName: this.data.consignee,
      contactPhone: this.data.conPhone,
      provinceId: this.data.provid,
      provinceName: this.data.provname,
      cityId: this.data.cityid,
      cityName: this.data.cityname,
      districtId: this.data.districtid,
      districtName: this.data.districtname,
      rowVersion: this.data.rowVersion,
      isDefault: this.data.isClick,
      address: this.data.conaddress,
      countryId: "86",
      countryName: "中国",
    }
    console.log(val)
    var that = this;
    if (that.data.tab != 1) {
      xnService.memberLocationcreate(val, function(data) { //添加地址
        console.log(data)
        if (data.firstErrorMessage == "") {
          if (that.data.sunbit == 1) {
            wx.showToast({
              title: '保存成功',
            })
            that.setData({
              memberid: data.id
            })
            if (that.data.isClick) {
              that.defaultaddress();
            }
            wx.navigateBack({
              delta: 1
            })
          } else if (that.data.sunbit == 2) {
            wx.showToast({
              title: '保存成功',
            })
            that.setData({
              memberid: data.id
            })
            if (that.data.isClick) {
              that.defaultaddress();
            }
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          } else {
            wx.showToast({
              title: '保存成功',
            })
            that.setData({
              memberid: data.id
            })
            if (that.data.isClick) {
              that.defaultaddress();
            }
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        } else {
          wx.showModal({
            title: '提示',
            content: data.firstErrorMessage,
            success: function(res) {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1000)
            }
          })
        }
      })
    } else {
      xnService.memberLocationupdate(val, function(data) { //更新地址
        console.log(data)
        if (data.firstErrorMessage == "") {
          if (data.result === "1") {
            wx.showToast({
              title: '修改成功',
              success: function () {
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000)
              }
            })
            
          } else {
            wx.showToast({
              title: '修改失败',
            })
          }

        }
      })
    }

  },

  getBLen: function(str) {
    if (str == null) return 0;
    if (typeof str != "string") {
      str += "";
    }
    return str.replace(/[^\x00-\xff]/g, "01").length;
  },

  defaultaddress: function() { //添加默认地址
    var vsl = {
      id: this.data.memberid
    }
    xnService.defaultMemberLocationset(vsl, function(data) {
      console.log(data)
    })
  },
  Clickimg: function() { //点击设置为默认
    this.setData({
      isClick: true
    })
    console.log(1)
  },
  ClickimgOne: function() {
    this.setData({
      isClick: false
    })
    console.log(2)
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