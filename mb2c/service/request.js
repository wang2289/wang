const root_url = require('../config').apiUrl;
const getPostParameter = require('../utils/postparameter.js');
const methods = require('../methods.js');
const utils = require('../utils/util.js');

const header = {
  'Content-Type': 'application/x-www-form-urlencoded',
}

const requestService = {
  request: (params, fn) => {
    params.method = getMethod(params.method);
    var postParameter = getPostParameter(params);
    console.log(root_url + postParameter);
    wx.request({
      url: root_url,
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        console.log(response);
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  uploadRequest: (params, fn) => {
    params.method = getMethod(params.method);
    var postParameter = getPostParameter(params);
    console.log(root_url + postParameter);

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: root_url + postParameter,
          method: "POST",
          filePath: tempFilePaths[0],
          name: 'fileStream',
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            doStateProcessing(res, fn);
          },
          fail: function (error) {
            console.log(error);
          },
          complete: function (res) {
            
          }
        })
      },
      fail: function (res) {

      },
      complete: function (res) {

      }
    })
  }
};

// 返回处理
const doStateProcessing = (response, fn) => {
  switch (response.statusCode) {
    case 200:
      if (typeof fn == 'function') {
        // if (response.data.code) {
        //   // 订单异常点击确定后返回上一个页面
        //   utils.confirm(response.data.message);
        //   return false;
        // }
        fn(response.data);
      }
      break;

    case 502:
      console.log(502)
      break;
  }
};

function getMethod(method)
{
  var method_array = method.split('.');
  if (method_array.length == 2) {
    return methods[method_array[0]][method_array[1]];
  } else if (method_array.length == 3) {
    return methods[method_array[0]][method_array[1]][method_array[2]];
  }
}

module.exports = requestService;