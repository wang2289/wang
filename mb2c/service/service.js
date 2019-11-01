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
  login: (data, fn) => {
    data.method = "api.ebusiness.member.login";
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
  //  通过用户ID获取用户信息 id
  getUser: (data, fn) => {
    data.method = "api.master.system.user.get";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
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

  ImageVerification: (data, fn) => {  //获取图形验证码
    data.method = "api.security.loginCode.create";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`, //仅为示例，并非真实的接口地址
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
  mobileVerificationCode: (data, fn) => {   //获取手机验证码
    data.method = "api.ebusiness.mobileVerificationCode.create";
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
   mobileVerificationCodecheck: (data, fn) => {   //验证手机验证码
    data.method = "api.security.valification.check";
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
   Imagecheck: (data, fn) => {   //验证图片验证码
     data.method = "api.security.loginCode.check";
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
   register: (data, fn) => {   //注册
     data.method = "api.ebusiness.memberNew.register";
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
   updateByVerifyCode: (data, fn) => {   //重置密码
     data.method = "api.security.loginPassword.updateByVerifyCode";
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
  
   loginnewId: (data, fn) => {   // 注册获取主键id
     data.method = "api.base.newId.get";
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
   signInNew: (data, fn) => {   // 签到
     data.method = "api.ebusiness.signInNew.member";
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
   membership: (data, fn) => {   // 获取会员信息(我的账户)
     data.method = "api.master.membership.member.get";
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
   memberTransactionNew: (data, fn) => {   // 余额消费记录
     data.method = "api.ebusiness.memberTransactionNew.find";
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
  registrationAgreementNew: (data, fn) => {   //注册协议
    data.method = "api.ebusiness.registrationAgreementNew.find";
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
  addressByLatitude: (data, fn) => {   //地理定位
    data.method = "api.temp.addressByLatitude.find";
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
  passportrevoke: (data, fn) => {   //退出
    data.method = "api.security.passport.revoke";
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
  userOauthdelete: (data, fn) => {   //删除用户授权
    data.method = "api.security.userOauth.delete";
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
  //查询会员汇总交易信息
  findMemberSummaryTransaction: (data, fn) => {
      data.method = "api.crm.membercenter.member.summaryTransaction.find";
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
  //查询会员订单数量
  findOrderCount: (data, fn) => {
      data.method = "api.ebusiness.orderNew.find";
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

  //获取会员信息
  getMemberExtend: (data, fn) => {
    data.method = "api.ebusiness.memberExtend.get";
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
  //获取手机验证码（无条件发送）
  getVerificationCode: (data, fn) => {
    data.method = "api.basic.smsVerification.create";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`,
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
  //根据手机号码和短信验证码进行登录
  loginByVerificationCode: (data, fn) => {
    data.method = "api.membercenter.member.login.by.verification.code";
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
  //保存交互产生的formId
  createWechatAppForm: (data, fn) => {
    data.method = "api.wechatservice.wechatAppForm.create";
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
  //查询微信账号的详细信息
  findWxAccount: (data, fn) => {
    data.method = "api.wechat.account.find";
    var postParameter = getPostParameter(data);
    console.log(postParameter);
    wx.request({
      url: `${apiUrl}`,
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
  //获取用户云信ID
  commodityUserImid: (data, fn) => {
    data.method = "api.community.user.imId.get";
    var postParameter = getPostParameter(data);
    wx.request({
      url: `${apiUrl}`,
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

  profile_option_value: (data, fn) => {   //  获取经营单元id
      data.method = "api.foundation.profile_option_value.get";
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
  createObjectLog: (data, fn) => {  
    data.method = "api.ebusiness.object_log.create";
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
  getObjectLog: (data, fn) => {  
    data.method = "api.ebusiness.object_log.get";
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

  

}
module.exports = xnService
