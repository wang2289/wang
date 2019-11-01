// pages/Dataaddress/Dataaddress.js
var app = getApp();
const xmService = require('../../service/security.js');
const api = require('../../service/product.js');
var $ = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    operatingUnitId:app.globalData.operatingUnitId,
    UserName: "", //物流单号
    nickName: "" //物流公司
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      prouId: options.detail,
      row: options.rower
    })

  },
  getPersonaldata: function(e) { //提交物流公司物流单号
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if ($.isNull(this.data.thename)) {
      $.confirm('物流单号不能为空');
      return false;
    }
    if ($.isNull(this.data.nickName)) {
      $.confirm('物流名称不能为空');
      return false;
    }
    if (regEn.test(this.data.nickName) || regCn.test(this.data.nickName)) {
      $.confirm("请输入正确的物流名称");
      return false;
    }
    if (regEn.test(this.data.thename) || regCn.test(this.data.thename)) {
      $.confirm("请输入正确的物流单号");
      return false;
    }
    var val = {
      rowVersion: this.data.row,
      id: this.data.prouId,
      memberReturnNumber: this.data.thename,
      memberReturnCarrierName: this.data.nickName,
    }
    console.log("参数：", val)
    var that = this;
    xmService.refundMemberReturn(val, function(res) {
      console.log("未知", res)
      if (res.firstErrorMessage == "") {
        app.globalData.typefalg = true;
        $.confirm("提交成功", function() {
          wx.navigateBack({
            delta: -1,
          })
        })
      } else {
        $.confirm(res.firstErrorMessage)
      }
    })
  },
  Name: function(e) { // 物流单号
    //console.log(e)
    this.setData({
      thename: e.detail.value,
    })
  },
  NicknameInfo: function(e) { //物流公司
    this.setData({
      nickName: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})