var app = getApp()
const xmService = require('../../service/security.js');
const tenantId = require('../../config').tenantId;
const xnService = require('../../service/service.js');
const MD5 = require('../../utils/md5.js');
var $ = require('../../utils/util.js')
Page({

  /** 
   * 页面的初始数据 
   */
  data: {
    id: "",
    Length: 6,        //输入框个数  
    isFocus: true,    //聚焦  
    Value: "",        //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。  
    sutry:"",
    flag:false,
    newpassword:'',//第一次输入的密码
    oldpassword: ''//第二次输入的密码
  },
  onLoad: function (options) {
    var that = this;
    xnService.loginnewId({}, function (data) {
      console.log(data)
      that.setData({
        id: data
      })
    })
    this.setData({
      sutry: options.sutry
    })
  },
  Focus(e) {
    var that = this;
    console.log(e.detail.value);
    var inputValue = e.detail.value;
    that.setData({
      Value: inputValue,
    })
  },
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  formSubmit(e) {
    console.log(e.detail.value.password);
  },
  onSubmit:function(e){
    if (this.data.Value.length<6){
     $.confirm('请输入正确的支付密码')
     return;
    }
    if ($.isNull(this.data.Value)) {
      $.confirm("支付密码不能为空")
      return;
    }
    this.setData({
      newpassword: this.data.Value
    })
    var val={
      transactionPassword: MD5.hexMD5(this.data.Value),
      tenantId: tenantId,
      id: app.globalData.userId,
      // id: "992288831388913664",
    }
    console.log(val)
    var that = this;
    xmService.userTransactionPassword(val,function(res){
      console.log(res)
      if (res.firstErrorMessage==""){
        that.setData({
          flag:true,
          Value:''
        })
      }
    })
  },
  onSubmits:function(){
    this.setData({
      oldpassword: this.data.Value
    })
    if ($.isNull(this.data.oldpassword)) {
      $.confirm("支付密码不能为空")
      return;
    }
    if (this.data.oldpassword.length < 6) {
      $.confirm('请输入正确的支付密码')
      return;
    }
    if(this.data.oldpassword!=this.data.newpassword){
      $.confirm("两次支付密码不一致")
      return;
    }
    var val = {
      transactionPassword: MD5.hexMD5(this.data.Value),
      tenantId: tenantId,
      id: app.globalData.userId,
      // id: "992288831388913664",
    }
    console.log(val)
    var that = this;
    xmService.userTransactionPassword(val, function (res) {
      console.log(res)
 
      if (res.firstErrorMessage == "") {
        that.setData({
          flag: true,
          Value: ''
        })
        if (that.data.sutry == 1) {
          wx.navigateBack({
            delta: -6
          })
        }
        if (that.data.sutry == 2){
          wx.navigateBack({
            delta: -6
          })
        }
        if (that.data.sutry == 3) {
          wx.navigateBack({
            delta: -6
          })
        }
        else {
          wx.showToast({
            title: '设置成功',
            duration: 3000,
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 1500)
        }
      }
    })
  }
})  
