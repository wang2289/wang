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
  memberDetailIndexget: (data, fn) => {   // 查询个人中心信息
    data.method = "api.ebusiness.memberDetailIndex.get";
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
  prePaidCardEntity: (data, fn) => {   // 查询礼品卡
    data.method = "membership.app.card.entity.find";
    var postParameter = getPostParameter(data);
    console.log(apiUrl,postParameter);
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