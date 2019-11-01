 // pages/newcertificate/newcertificate.js
var app = getApp()
const xnServiceapi = require('../../service/certificate.js');
const xnService = require('../../service/service.js');
var $ = require('../../utils/util.js');
var Isflag = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "", //获取主键id
    taxNumber: '',
    companyName: '',
    companyAddress: '省/市/区',
    detailAddress:'',   //详细地址
    companyNumber: '',
    bankAccount: '',
    cityid: "0",
    cityname: "",
    districtid: "0",
    districtname: "",
    provid: "0",
    provname: "",
    seladstr: '',
    banlist: "",
    tab: 1,
    striry:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     console.log(options)
    var ban = JSON.parse(options.Collectlist)
    if (ban != "") {
      var banlist = JSON.parse(options.Collectlist)
      this.setData({
        banlist: JSON.parse(options.Collectlist),
        id: banlist.id,
        bankAccount: banlist.bankAccount,
        seladstr: banlist.bankName,
        taxNumber: banlist.taxpayerId,
        companyName: banlist.invoiceTitle,
        companyNumber: banlist.companyTel,
        sendLocationId: banlist.sendLocationId,
        companyAddress: options.provname + options.cityname + options.districtname || banlist.companyAddress,
        tab: options.tab,
        rowVersion:options.rowVersion
      })
     
    }
    this.locationget()
    this.setData({
      tab: options.tab,
      cityid: options.cityid,
      cityname: options.cityname,
      districtid: options.districtid,
      districtname: options.districtname,
      provid: options.provid,
      provname: options.provname,
      companyAddress: options.provname + options.cityname + options.districtname || banlist[0].companyAddress,
      addressColor: "#000000",
      striry: options.striry
    })
    // if (options.provname != "" && options.cityname != "" && options.districtname!=""){
    //    this.setData({
    //      companyAddress: options.provname + options.cityname + options.districtname
    //    })
    // }else{
    //   this.setData({
    //     companyAddress: banlist[0].companyAddress,
    //   })
    // }
     
  },
  AddressAddClick: function() {
    var that = this;
    if (Isflag == true) {
      Isflag = false
      // clearTimeout(time);
      var time = setTimeout(function() {
        Isflag = true;
      }, 2000)
      if (that.data.taxNumber == "") {
        $.confirm("纳税人识别号不能为空")
        return false;
      }
      if ($.isNull(this.data.companyName)) {
        $.confirm("公司名称不能为空")
        return;
      }
      if (that.data.cityname == "" && that.data.districtname == "" && that.data.provname == "") {
        $.confirm("公司地址不能为空")
        return false;
      }
      if (that.data.companyAddress == "") {
        $.confirm("地址不能为空")
        return false;
      }
      if (that.data.detailAddress.length<5) {
        $.confirm("请填写正确的详细地址")
        return false;
      }
      if (that.data.companyNumber == "") {
        $.confirm("公司电话不能为空")
        return false;
      }
      if (that.data.seladstr == "") {
        $.confirm("开户银行名称不能为空")
        return false;
      }
      if (that.data.bankAccount == "") {
        $.confirm("开户银行账号不能为空")
        return false;
      }
      if (this.data.bankAccount.length <16 ) {
        $.confirm("银行卡输入格式错误")
        return;
      }
      if (that.data.tab == 4) {
        var val = {
          id: that.data.id,
          countryId: 86,
          countryName: "中国",
          provinceId: that.data.provid,
          provinceName: that.data.provname,
          cityId: that.data.cityid,
          cityName: that.data.cityname,
          districtId: that.data.districtid,
          districtName: that.data.districtname,
          address: that.data.detailAddress
        }
        xnServiceapi.locationupdate(val, function(data) {
          console.log(data)
          if (data.firstErrorMessage == "") {
            var vas = {
              id: that.data.id,
              sendLocationId: data.location.id,
              memberId: app.globalData.memberId,
              taxpayerId: that.data.taxNumber,
              invoiceTitle: that.data.companyName,
              companyAddress: that.data.companyAddress,
              companyTel: that.data.companyNumber,
              bankName: that.data.seladstr,
              bankAccount: that.data.bankAccount,
              rowVersion: that.data.banlist.rowVersion
            }
            xnServiceapi.addInvoiceupdate(vas, function(data) {
              if (data.firstErrorMessage == "") {
                wx.showToast({
                  title: '保存成功！',
                  icon: "success",
                })
                setTimeout(function () {
                  wx.navigateBack({
                    delta: -1
                  })
                }, 2000)
              }
            })
          }
        })
      } else {
        var that = this;
        xnService.loginnewId({}, function(data) {
          that.setData({
            id: data
          })
          if (that.data.taxNumber == "") {
            $.confirm("纳税人识别号不能为空")
            return false;
          }
          if (that.data.cityname == "" && that.data.districtname == "" && that.data.provname == "") {
            $.confirm("公司地址不能为空")
            return false;
          }
          if (that.data.companyAddress == "") {
            $.confirm("地址不能为空")
            return false;
          }
          if (that.data.detailAddress.length < 5) {
            $.confirm("请填写正确的详细地址")
            return false;
          }
          if (that.data.companyNumber == "") {
            $.confirm("公司电话不能为空")
            return false;
          }
          if (that.data.seladstr == "") {
            $.confirm("开户银行名称不能为空")
            return false;
          }
          if (that.data.bankAccount == "") {
            $.confirm("开户银行账号不能为空")
            return false;
          }
          var val = {
            countryId: 86,
            countryName: "中国",
            provinceId: that.data.provid,
            provinceName: that.data.provname,
            cityId: that.data.cityid,
            cityName: that.data.cityname,
            districtId: that.data.districtid,
            districtName: that.data.districtname,
            address: that.data.detailAddress
          }
          xnServiceapi.locationcreate(val, function(data) {
             console.log(data)
            if (data.firstErrorMessage == "") {
              var val = {
                memberId: app.globalData.memberId,
                taxpayerId: that.data.taxNumber,
                invoiceTitle: that.data.companyName,
                companyAddress: that.data.companyAddress,
                companyTel: that.data.companyNumber,
                bankName: that.data.seladstr,
                bankAccount: that.data.bankAccount,
                sendLocationId: data.location.id
              }
              ////console.log(val)
              xnServiceapi.addInvoicecreate(val, function(data) {
                // Isflag = true;
                ////console.log(data)
                if (data.firstErrorMessage == "") {
                  if (that.data.striry==1){
                    wx.navigateBack({
                      delta: -6
                    })
                  }else{
                    wx.showToast({
                      title: '保存成功！',
                      icon: "success",
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)
                  }
               
                }

              })
            }
          })
        })
      }
    }
  },
  taxNumberInput: function(e) { //纳税人识别号

    if (e.length == 0) {
      wx.showToast({
        title: '请输入纳税人识别号！',
        icon: "success",
        duration: 1500
      })
      return false;
    }
    this.setData({
      taxNumber: e.detail.value.replace(/\s+/g, '')
    })
  },
  companyNameInput: function(e) { //请输入公司名称
    this.setData({
      companyName: e.detail.value.replace(/\s+/g, '')
    })
  },

  companyAddressInput: function(e) { //详细地址
  console.log(e)
    this.setData({
      detailAddress: e.detail.value.replace(/\s+/g, '')
    })
  },

  companyNumberInput: function(e) { //公司电话
    this.setData({
      companyNumber: e.detail.value.replace(/\s+/g, '')
    })
  },
  bankAccountname: function(e) { //银行名称
    this.setData({
      seladstr: e.detail.value.replace(/\s+/g, '')
    })
  },
  bankAccountInput: function(e) { //开户银行账号
    this.setData({
      bankAccount: e.detail.value.replace(/\s+/g, '')
     // bankAccount: '6225365271562822'
    })
  },
  companyaddress: function() {
    var model = JSON.stringify(this.data.banlist);
    wx.navigateTo({
      url: '../Lookat/Lookat?tab=' + this.data.tab + "&ban=" + model,
    })
  },

  locationget: function () { //增票地址
    var val = {
      id: this.data.sendLocationId
    }
    var that = this;
    xnServiceapi.locationget(val, function (res) {
      console.log(res)
      if (res.firstErrorMessage == '') {
        that.setData({
          cityid: res.location.cityId,
          cityname: res.location.cityName,
          districtid: res.location.districtId,
          districtname: res.location.districtName,
          provid: res.location.provinceId,
          provname: res.location.provinceName,
          sendLocationId: res.location.id,
          detailAddress: res.location.address
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