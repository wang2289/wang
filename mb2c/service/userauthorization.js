const MD5 = require('../utils/md5.js');
const apiUrl = require('../config').apiUrl;
const apiUploadUrl = require('../config').apiUploadUrl;
const getPostParameter = require('../utils/postparameter.js');

// 返回处理

const doStateProcessing = (response, fn) => {
  switch (response.statusCode) {
    case 200:
      if (typeof fn == 'function') {
        fn(response.data);
      }
      break;
    case 502:
      console.log(502)
      break;

    case 502:
      console.log(502)
      break;

    case 502:
      console.log(502)
      break;

    case 502:
      console.log(502)
      break;

    case 502:
      console.log(502)
      break;

  }

}

// 错误处理
const requestError = (error, fn) => {
  console.log(error);
}

const header = {
  'Content-Type': 'application/x-www-form-urlencoded',
}

const xnService = {
  // 登录
  wechatsession: (data, fn) => {   //调用微信wx.login接口获取code; wx.getUserInfo接口获取用户信息
    data.method = "api.wechat.session.key.save";
    var postParameter = getPostParameter(data);
    wx.request({
      url: `${apiUrl}`,
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  securitybyOauthlogin: (data, fn) => {   //自动登录
    data.method = "api.security.byOauth.login";
    var postParameter = getPostParameter(data);
    wx.request({
      url: `${apiUrl}`,
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  securityuserOauthcreate: (data, fn) => {   //自动登录成功 调用创建用户授权信息接口,记录微信授权
    data.method = "api.security.userOauth.create";
    var postParameter = getPostParameter(data);
    wx.request({
      url: `${apiUrl}`,
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  }, 
  securityuserOauthcreate: (data, fn) => {   //自动登录成功 调用创建用户授权信息接口,记录微信授权
    data.method = "api.security.userOauth.create";
    var postParameter = getPostParameter(data);
    wx.request({
      url: `${apiUrl}`,
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },

  securityuserOauthFind: (data, fn) => {
    data.method = "security.find.user.oauth";
    var postParameter = getPostParameter(data);
    wx.request({
      url: `${apiUrl}`,
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  }, 
 
}
module.exports = xnService
