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
  memberMobile: (data, fn) => {
    data.method = "api.ebusiness.memberMobile.update";
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
  userTransactionPassword: (data, fn) => {
    data.method = "api.security.userTransactionPassword.update";
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
  refundMemberReturn: (data, fn) => {
    data.method ="api.ebusiness.refundMemberReturn.upload";
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
  loginPassword: (data, fn) => {
    data.method = "api.security.loginPassword.modify";
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
  memberShipdata: (data, fn) => { //保存个人资料
    data.method = "api.master.membership.member.update";
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
  memberShipget: (data, fn) => { //获取个人资料
    data.method = "api.master.membership.member.get";
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
  avatarupdate: (data, fn) => { // 更新用户头像
    data.method = "api.master.user.avatar.update";
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