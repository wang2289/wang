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
  orderNewconfirm: (data, fn) => {   //计算商品及促销价格等
    data.method = "api.ebusiness.orderNew.confirm";
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
  freightNewPay: (data, fn) => {   //计算运费
    data.method = "api.ebusiness.freightNewPay.count";
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
  memberPoint: (data, fn) => {   //查看我的积分
    data.method = "api.membership.memberPoint.get";
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
  orderNewfind: (data, fn) => {   //积分兑换记录
    data.method = "api.ebusiness.orderNew.find";
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
  memberLocation: (data, fn) => {   //拉取省市区信息
    data.method = "api.master.membership.memberLocation.find";
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
  memberLocationfind: (data, fn) => {   // 我的收获地址列表
    data.method = "api.master.membership.memberLocation.find";
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
  refundDetailNew: (data, fn) => {   // 退单详情
    data.method = "api.ebusiness.refundDetailNew.get";
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
  memberLocationcreate: (data, fn) => {   // 创建收货地址
    data.method = "api.master.membership.memberLocation.create";
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
  memberLocationupdate: (data, fn) => {   //编辑收货地址
    data.method ="api.master.membership.memberLocation.update";
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
  memberLocationdelete: (data, fn) => {   //删除收货地址
    data.method = "api.master.membership.memberLocation.delete";
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
  defaultMemberLocationset: (data, fn) => {   //设置默认收货地址
    data.method = "api.master.membership.defaultMemberLocation.set";
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
  orderNewcommit: (data, fn) => {   //提交订单
    data.method = "api.ebusiness.orderNew.commit";
    var postParameter = getPostParameter(data);
     console.log(apiUrl + postParameter);
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
  orderCommitForCurriculum: (data, fn) => {   //课程商品提交订单
    data.method = "api.ebiz.order.commit.batch";
    var postParameter = getPostParameter(data);
    console.log(apiUrl + postParameter);
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
  sessionkeysave: (data, fn) => {   //获取openid
    data.method ="api.wechat.session.key.save";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl,postParameter);
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
  orderLogisticsNew: (data, fn) => {   //获取物流详情
    data.method = "api.ebusiness.orderLogisticsNew.get";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
  orderMergePayNews: (data, fn) => {   // 选择支付方式
    data.method = "api.ebusiness.orderMergePayNew.create";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
  mergeAccountPaid: (data, fn) => {   //余额支付
    data.method = "api.ebusiness.mergeAccountPaid.order";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
   mergeAccountPaid: (data, fn) => {   //余额支付
    data.method = "api.ebusiness.mergeAccountPaid.order";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
  prepaidcardentity: (data, fn) => {    
    data.method = "api.epos.prepaidcard.entity.find ";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
  areaListByPid: (data, fn) => {    //获取省市区的信息
    data.method = "api.data.areaListByPid.get";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
  ordersign: (data, fn) => {    //积分确认收货按钮
    data.method = "api.ebusiness.order.sign";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
  refundfind: (data, fn) => {    //查询退单列表
    data.method = "api.ebusiness.refund.find";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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
  refundcancel: (data, fn) => {    //取消退单
    data.method = "api.ebusiness.refund.cancel";
    var postParameter = getPostParameter(data);
    //console.log(apiUrl, postParameter);
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