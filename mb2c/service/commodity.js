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
  commodityNew: (data, fn) => {   //商品详情
    data.method = "api.ebusiness.commodityNew.get";
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

  curriculumCommodityGet: (data, fn) => {   //商品详情
    data.method = "api.curriculum.commodity.get";
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
 
  cartNew: (data, fn) => {   //更新购物车
    data.method = "api.ebusiness.cartNew.update";
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
  cardList: (data, fn) => {   //商品详情
    data.method = "api.temp.cardList.get";
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
  commoditySkuInfo: (data, fn) => {   // 获取商品物料的价格、库存及促销信息
    data.method = "api.ebusiness.commoditySkuInfo.find";
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
  batchCart: (data, fn) => {   //商品详情  添加购物车
    data.method = "api.ebusiness.batchCart.add ";
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
  couponreceive: (data, fn) => {   //领取优惠券
    data.method = "api.ebusiness.coupon.receive";
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
  commodityEvaluationNumber: (data, fn) => {   //获取商品评价总数和平均评分
    data.method = "api.ebusiness.commodityEvaluationNumber.find";
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
  collectionNew: (data, fn) => {   //收藏
    data.method = "api.ebusiness.collectionNew.create";
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
  collectionfind: (data, fn) => {   //查询
    data.method = "api.ebusiness.collection.find ";
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
  collectiondelete: (data, fn) => {   //取消收藏
    data.method = "api.ebusiness.collection.delete";
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
  memberDefalutLocation: (data, fn) => {   //获取会员默认地址
    data.method = "api.ebusiness.memberDefalutLocation.get";
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
  commodityPartsByCommodity: (data, fn) => {   //获取商品配件 
    data.method = "api.ebusiness.commodityPartsByCommodity.find";
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
  cardListget: (data, fn) => {   //购物车列表
    data.method = "api.ebusiness.cardList.get";
    var postParameter = getPostParameter(data);
    //console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址0
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
  cartdelete: (data, fn) => {   //购物车选择单个删除
    data.method = "api.ebusiness.cart.delete";
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
  batchCartdelete: (data, fn) => {   //购物车批量删除
    data.method = "api.ebusiness.batchCart.delete";
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

  createWfxAppScene: (data, fn) => {   //【小程序】创建场景二维码
    data.method = "api.wfx.appScene.create.no.passport";
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