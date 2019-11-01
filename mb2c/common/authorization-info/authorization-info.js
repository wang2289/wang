// common/authorization-info.js
var app = getApp();
var api = require('../../service/userauthorization.js');
var tenantNumber = require('../../config').tenantNumber;
var service = require('../../service/service.js');
var tenantId = require('../../config').tenantId;
var personapi = require('../../service/personalcenter.js');
var apipro = require('../../service/product.js');
const appId = require('../../config').appId;
var storeId = require('../../config.js').storeId
Component({
  properties: {
    isMust: Boolean || false //是否必须授权
  },
  data: {
    isAuthorization: false //是否需要进行授权操作
  },
  ready: function () {
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.setData({
            isAuthorization: false
          });
        } else {
          wx.login({
            success: function (datainfo) {
              var thatdata = {
                code: datainfo.code,
              }
              that.setData({
                isAuthorization: true
              });
            }

          });
        }
      }
    });
  },
  methods: {
    bindGetUserInfo: function(e) {
      var that = this;
      if (e.detail.errMsg == 'getUserInfo:ok') { //开始更新用户信息
        that.setData({
          isAuthorization: false
        });
        var wxinfo = JSON.parse(e.detail.rawData);   //微信授权获取的用户信息
        console.log(wxinfo);
      }
      wx.login({ //通过wx.login获取code
        success: function (datainfo) {
          console.log(datainfo.code)
          var thatdata = {
            code: datainfo.code
          }
          app.globalData.code = thatdata.code;
          wx.getUserInfo({
            success: function (res) { //获取getUserInfo带出来的信息
              console.log(res)
              var val = {
                appId: appId,
                jsCode: encodeURIComponent(app.globalData.code),
                encryptData: encodeURIComponent(e.detail.encryptedData),
                iv: encodeURIComponent(e.detail.iv)
              }
              api.wechatsession(val, function (data) {
                console.log("保存Session", data)
                if (data.firstErrorMessage == "") {
                  app.globalData.openId = data.openId
                  app.globalData.unionId = data.unionId
                }
                that.securitybyOauthlogin()
              })
            }
          })
        }
      })
    },
    GetUserInfo:function(){

    },
    securitybyOauthlogin: function () { //自动登录
      var val = {
        tenantNumber: tenantNumber, //承租人号 测试环境是300029
        openId: app.globalData.unionId, // api.wechat.session.key.save接口返回的unionId
        openType: "WX_OPEN" //写死的值
      }
      var that = this;
      api.securitybyOauthlogin(val, function (data) {

        if (data.firstErrorMessage == "") {
          wx.setStorageSync('passportId', data.passport.id);
          app.globalData.userId = data.passport.userId
          app.globalData.tenantId = data.passport.tenantId;
          that.memberDetailIndexget();
          wx.switchTab({
            url: '../../pages/index/index',
          });
        } else {
          wx.removeStorage({   //如果自动登陆失败   必须清除缓存     去登录
            key: 'passportId',
            success: function (res) {
              console.log('清除缓存', res)
            }
          })
        }
      })
    },
   
    memberDetailIndexget: function () { //获取用户信息
      var val = {
        operatingUnitId: app.globalData.operatingUnitId,
        systemType: "B2C",
        deviceType: "MOBILE",
        storeId:storeId
      }
      var that = this;
      personapi.memberDetailIndexget(val, function (data) {
        if (data.firstErrorMessage == "") {
          app.globalData.userId = data.user.id;
          app.globalData.account = data.user.account;
          app.globalData.memberId = data.member.id;
          app.globalData.mobilePhone = data.member.mobilePhone;
          app.globalData.imId = data.user.imId;
          wx.setStorageSync('imid',  data.user.imId);
        }
      })
    }
  }
})