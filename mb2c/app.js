const appId = require('./config').appId;
const appsecret = require('./config').appsecret;
const xnService = require('./service/service.js');
const regeneratorRuntime = require('./utils/regenerator/runtime-module');
var api = require('./service/userauthorization.js');
var tenantNumber = require('config').tenantNumber;
var tenantId = require('config').tenantId;
var operatingUnitId = require('config').operatingUnitId;
var personapi = require('./service/personalcenter.js');
var apipro = require('./service/product.js');
var storeId= require('./config.js').storeId;
var mta= require('./utils/mta_analysis.js');
var config =  require('./config.js');

import WeAppRedux from './chat/redux/index.js';
import createStore from './chat/redux/createStore.js';
import reducer from './chat/store/reducer.js';
import ENVIRONMENT_CONFIG from './chat/config/envConfig.js'
import PAGE_CONFIG from './chat/config/pageConfig.js'
const { Provider } = WeAppRedux;
const store = createStore(reducer) // redux store

App(Provider(store)(
{
  onLaunch:async function() {
      if(config.mtaAppId){
          mta.App.init({
              "appID":config.mtaAppId,
              "eventID":config.mtaEventID
          });
      }

      await this.loadMember();
      this.getOperatingUnitId();

      wx.getSystemInfo({
          success: res => {
              let clientHeight = res.windowHeight,
                  clientWidth = res.windowWidth,
                  rpxR = 750 / clientWidth;
              let calc = clientHeight * rpxR;
              this.globalData.scrollHeight = calc;
          }
      });
      let systemInfo = wx.getSystemInfoSync();
      this.globalData.videoContainerSize = {
          width: systemInfo.windowWidth,
          height: systemInfo.windowHeight
      }
  },
  GetUserInfo: function() {
    var that = this;
    wx.login({ //通过wx.login获取code
      success: function(datainfo) {
        //console.log(datainfo.code)
        var thatdata = {
          code: datainfo.code
        }
        that.globalData.code = thatdata.code;
        wx.getUserInfo({
          success: function(res) { //获取getUserInfo带出来的信息
            //console.log(res)
            var val = {
              appId: appId,
              jsCode: encodeURIComponent(that.globalData.code),
              encryptData: encodeURIComponent(res.encryptedData),
              iv: encodeURIComponent(res.iv)
            }
            //console.log(val)
            api.wechatsession(val, function(data) {
              //console.log("保存Session", data)
              if (data.firstErrorMessage == "") {
                that.globalData.openId = data.openId
                that.globalData.unionId = data.unionId
              }
              that.securitybyOauthlogin()
              typeof callback == "function" && callback(that)
            })
          }
        })
      }
    })
  },
  securitybyOauthlogin: function() { //自动登录
    var val = {
      tenantNumber: tenantNumber, //承租人号 测试环境是300029
      openId: this.globalData.unionId, // api.wechat.session.key.save接口返回的unionId
      openType: "WX_OPEN" //写死的值
      //  tenantNumber: tenantNumber,//承租人号 测试环境是300029
      //  openId: this.globalData.openId,// api.wechat.session.key.save接口返回的unionId
      //  openType: "WX_MINI_APP"//写死的值
    }
    //console.log(val)
    var that = this;
    api.securitybyOauthlogin(val, function(data) {
      //console.log('自动登录', data)
      if (data.firstErrorMessage == "") {
        wx.setStorageSync('passportId', data.passport.id);
        //console.log(data.passport.id);
        // wx.setStorageSync('memberId', data.member.id);
        that.globalData.userId = data.passport.userId
        that.globalData.tenantId = data.passport.tenantId
        that.memberDetailIndexget()
        that.securityuserOauthcreate()
      } else {
        that.securitybyOauthloginUpdate()
      }
    })
  },
  securityuserOauthcreate: function() { //自动登录成功 调用创建用户授权信息接口,记录微信授权
    var val = {
      userId: this.globalData.userId, //自动登录成功接口返回数据
      tenantId: this.globalData.tenantId, //自动登录成功返回数据
      openId: this.globalData.unionId, // api.wechat.session.key.save接口返回的unionId
      openType: "WX_OPEN", //写死的值
    }
    //先查询当前userId和unionId是否已进行绑定
    api.securityuserOauthFind(val, function (data) {
      if (data.firstErrorMessage == "" && data.totalCount == 0) {
        api.securityuserOauthcreate(val, function (res) {
          if (res.firstErrorMessage == "") {
          }
        })
      }
    })
  },
  securitybyOauthloginUpdate: function() { //自动登录不成功的话再调一次自动登录
    var val = {
      tenantNumber: tenantNumber, //承租人号 测试环境是300029
      openId: this.globalData.openId, // api.wechat.session.key.save接口返回的unionId
      openType: "WX_MINI_APP" //写死的值
    }
    //console.log(val)
    var that = this;
    api.securitybyOauthlogin(val, function(data) {
      //console.log('自动登录不成功的话再调一次自动登录', data)
      if (data.firstErrorMessage == '') {
        wx.setStorageSync('passportId', data.passport.id);
        // wx.setStorageSync('memberId', data.member.id);
        that.globalData.userId = data.passport.userId
        that.globalData.tenantId = data.passport.tenantId
        that.memberDetailIndexget();
        that.securityuserOauthcreate()
      } else {
        wx.removeStorage({   //如果自动登陆失败   必须清除缓存     去登录
          key: 'passportId',
          success: function(res) {
            //console.log('清除缓存',res)
          }
        })
      }
    })
  },
  memberDetailIndexget: function() { //获取用户信息
    var val = {
      operatingUnitId: this.globalData.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      storeId:storeId
    };
    var that = this;
    personapi.memberDetailIndexget(val, function(data) {
        wx.setStorageSync('memberId', data.member.id);
        that.globalData.userId = data.user.id;
        that.globalData.account = data.user.account;
        that.globalData.memberId = data.member.id;
        that.globalData.mobilePhone = data.member.mobilePhone;
    })
  },

  agreement: function() { //注册协议
    var val = {
      tenantId: tenantId,
      systemType: "B2C"
    };
    var that = this;
    xnService.registrationAgreementNew(val, function(data) {
      //console.log(data)
      that.globalData.registrationInfo = data.result
    })
  },
  //根据appId获取小程序的accountId
  findWxAccount: function () {
      var that = this;
      xnService.findWxAccount({ appId: appId }, function (data) {
          if (data.result != null && data.result.length > 0) {
              that.globalData.accountId = data.result[0].id;
          }
      })
  },
  globalData: {
    emitter: null,
    netcallController: null,
    ENVIRONMENT_CONFIG,
    PAGE_CONFIG,
    ImgPath: "",
    Name: "",
    memberInfo: '',
    unionId: '',
    hasLogin: false,
    openId: null,
    memberId: '',
    operatingUnitId: operatingUnitId,
    userId: "",
    photo: '',
    totalPets: 0,
    userName: "", //用户名
    code: "",
    tenantId: "",
    Giftcardamount: "", //礼品卡总金额 
    GiftcardamountID: [], //礼品卡id
    benefitAmount: 0, //优惠券总额
    couponDefinitionId: [], //优惠券id
    numval: 1, //所使用的积分
    pointRulepick: "", //积分兑换的总金额
    account: "", //手机号
    mobilePhone: "",
    GiftcarInfo: [], //礼品卡信息
    message: '', //留言
    Pay: 0, //支付方式
    registrationInfo: [],
    amount2: 0,
    couponDefinitionIdList: [],
    Commercialinvoice: '', //普通发票
    typefalg:false,
    storeId:storeId,
    accountId:null, //微信小程序的账号ID
    imId:null
  },

  getOperatingUnitId: function () {
      var that = this;
      that.agreement();
      let passportId = wx.getStorageSync('passportId');
      if (!passportId) {
          return;
      }
      var pars = {
          code: 'EBUSINESS_DEFAULT_OPERATING_UNIT_ID',
          level: "TENANT"
      };
      apipro.profile_option_value(pars, function (data) {
          that.globalData.operatingUnitId = data.value;
          that.GetUserInfo();
          that.findWxAccount();

      });
  },
    checkLogin: function () {
        let passportId = wx.getStorageSync('passportId');
        if (!passportId) {
            wx.redirectTo({
                url: '../login/login',
            });
            return false;
        }
        return true;
    },
    checkLoginNoJump:function () {
        let passportId = wx.getStorageSync('passportId');
        if (!passportId) {
            return false;
        }
        return true;
    },
    loadMember:async function () {
        let passportId = wx.getStorageSync('passportId');
        if (!passportId) {
            return false;
        }
        let _this = this;
        if(!_this.globalData.memberId || !_this.globalData.mobilePhone ){

            var promise = new Promise((resolve, reject) => {
                let val = {
                    operatingUnitId: this.globalData.operatingUnitId,
                    systemType: "B2C",
                    deviceType: "MOBILE",
                    storeId:storeId
                };
                personapi.memberDetailIndexget(val, function(data) {
                    wx.setStorageSync('memberId', data.member.id);
                    _this.globalData.userId = data.user.id;
                    _this.globalData.account = data.user.account;
                    _this.globalData.memberId = data.member.id;
                    _this.globalData.mobilePhone = data.member.mobilePhone;
                    _this.globalData.imId = data.user.imId;
                    wx.setStorageSync('imid', data.user.imId);
                    resolve(true);

                    var pages = getCurrentPages();
                    var currentPage = pages[pages.length - 1];  //上一个页面
                    currentPage.onLoad(currentPage.options)

                });
            });
            return await promise;
        }
        return true;


    },
    returnShareObj:function (obj) {
        if(!obj){
            var pages = getCurrentPages();
            var currentPage = pages[pages.length-1];
            var url = currentPage.route;

            obj = {
                path: url
            };
        }
        if(this.globalData.memberId){
            if(obj.path.indexOf("?") === -1){
                obj.path = obj.path + "?refereeMemberId=" + this.globalData.memberId;
            } else {
                obj.path = obj.path + "&refereeMemberId=" + this.globalData.memberId;
            }
        }
        return obj;
    },
    saveRefereeIdByShare:function (obj) {
        if(obj && obj.refereeMemberId){
            if(obj.refereeMemberId){
                wx.setStorageSync("refereeMemberId",obj.refereeMemberId);
            }
        }
    },
    getRefereeMemberId:function () {
        return wx.getStorageSync("refereeMemberId");
    },

    getSetting:function(){
        //获取相册授权
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wx.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            console.log('授权成功')
                        }
                    })
                }
            }
        })
    }
}
));



