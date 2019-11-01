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
      //console.log(502)
      break;

    case 502:
      //console.log(502)
      break;

    case 502:
      //console.log(502)
      break;

    case 502:
      //console.log(502)
      break;

    case 502:
      //console.log(502)
      break;

  }

}

// 错误处理
const requestError = (error, fn) => {
  //console.log(error);
}

const header = {
  'Content-Type': 'application/x-www-form-urlencoded',
}
const xnService = {
  allCategoryShow: (data, fn) => {   //产品中心
    data.method = "api.ebusiness.allCategoryShow.get";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  findCommodityExtend: (data, fn) => {   //产品中心根据类别查询商品
     data.method = "api.ebusiness.findCommodityExtend.advanced";
    // data.method ="api.ebusiness.categorySearhCondition.get";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  categorySearhCondition: (data, fn) => {   //产品中心综合，销量...类别查询商品
      data.method ="api.ebusiness.categorySearhCondition.get";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  pointCommodity: (data, fn) => {   // 获取积分商城商品信息
    data.method = "api.ebusiness.pointCommodity.find";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  couponListNew: (data, fn) => {   // 获取我的优惠劵
    data.method = "api.promotion.couponEntity.find";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  commodityDefaultItemNew: (data, fn) => {   //  添加对比
    data.method = "api.ebusiness.commodityDefaultItemNew.get ";
    var postParameter = getPostParameter(data);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  profile_option_value: (data, fn) => {   //  获取经营单元id
    data.method = "api.foundation.profile_option_value.get";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  cartBySingleCommodity: (data, fn) => {   //添加购物车
    data.method = "api.ebusiness.cartBySingleCommodity.add";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },  
  itemNew:(data, fn) => {   //获取商品对比结果
    data.method = "api.ebusiness.itemNew.pk";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  pointCommodity: (data, fn) => {   //积分商城商品列表
    data.method = "api.ebusiness.pointCommodity.find";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  evaluationNew: (data, fn) => {   // 评价列表
    data.method = "api.ebusiness.evaluationNew.find";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  orderMergePayNew: (data, fn) => {   //  微信支付
    data.method = "api.ebusiness.orderMergePayNew.create";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },  
  transaction_password: (data, fn) => {   //校验是否设置支付密码
    data.method = "api.security.transaction_password.has_set";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    }) 
  },
  attachmentupload:(data, fn) => {   //评价上传图片
    data.method = "api.foundation.attachment.upload";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  createCommentbatch:(data, fn) => {   //发表评论
    data.method = "api.ebusiness.createComment.batch";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    }) 
  },
  createCommentbatch: (data, fn) => {   //删除图片
    data.method = "api.foundation.attachment.delete";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  exitCollection: (data, fn) => {   //检查是否收藏过
    data.method = "api.ebusiness.exitCollection.is";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },  
  exitCollection: (data, fn) => {   //检查是否收藏过
    data.method = "api.ebusiness.exitCollection.is";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  settingNonPassport: (data, fn) => {   //获取电商承租人设置
    data.method = "api.ebusiness.settingNonPassport.get";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
  getSupplier: (data, fn) => {   //获取供应商信息
    data.method = "api.purchasing.supplierdetail.get";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
      header: header,
      method: 'post',
      data: postParameter,
      success: function (response) {
        //console.log(response)
        doStateProcessing(response, fn)
      },
      fail: function (error) {
        requestError(error);
      }
    })
  },
}
module.exports = xnService