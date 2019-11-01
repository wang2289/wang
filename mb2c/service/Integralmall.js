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
  pointCommodityDetail: (data, fn) => { //积分组装商品详情
    data.method = "api.ebusiness.pointCommodityDetail.get";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function(response) {
        console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function(error) {
        requestError(error);
      }
    })
  },
  memberPointget: (data, fn) => { //查询我的积分
    data.method = "api.membership.memberPoint.get";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function(response) {
        console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function(error) {
        requestError(error);
      }
    })
  },  
  memberDefalutLocation: (data, fn) => { //积分获取会员默认地址
    data.method = "api.ebusiness.memberDefalutLocation.get";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    }) 
  },
  addInvoicefind: (data, fn) => { // 查询增票资质
    data.method = "api.ebusiness.addInvoice.find";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  memberBalanceget: (data, fn) => { // 查询我的余额
    data.method = "api.membership.memberBalance.get";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
}
module.exports = xnService