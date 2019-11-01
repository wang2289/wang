// pages/applyrefund/applyrefund.js
const requestService = require('../../../service/request.js');
const xnServiceapi = require('../../../service/product.js');
const xnService = require('../../../service/service.js');
const $ = require('../../../utils/util.js');
const config = require('../../../config.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freightFee: 0,
    maxRefundAmount: 0,
    contactPhone: '',
    refundRemark: '',
    type: '',
    refundReason: '',
    requestedAmount: '',
    orderId: '',
    orderHeadId: '',
    orderLineId: '',
    quantity: '',
    typeValue: [],
    refundReasonValue: [
      '发错货',
      '七天无理由退货',
      '拍错重拍',
      '物流问题',
      '服务问题',
      '售后补偿',
      '客户补偿',
      '仓库补偿',
      '运营补偿',
      '其它原因'
    ],
    typeIndex: ['REFUND', 'REFUND_RETURN'],
    refundReasonIndex: [
      'SHIPMENT_ERROR',
      'SEVEN_NO_REASON_RETURN_EXCHANGE',
      'RE_BUY',
      'LOGISTICS_PROBLEM',
      'SERVICE_PROBLEM',
      'AFTER_SALES_COMPENSATE',
      'CUSTOMER_COMPENSATE',
      'STOREHOUSE_COMPENSATE',
      'OPERATION_COMPENSATE',
      'OTHER'
    ],
    imgList: [],
    newId: '',
    chargebackId: '',
    OtherReason: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // var order_head_id = options.order_head_id;
    // var ordre_line_id = options.order_line_id;
    if (options.orderStatus == '待发货') {
      this.setData({
        typeValue: ['退款'],
      })
    } else {
      this.setData({
        typeValue: ['退款', '退款退货'],
      })
    }
    var orderId = options.orderid;
    var order_head_id = options.orderid;
    this.setData({
      orderHeadId: options.orderid,
      orderLineId: options.orderid,
    })
    var order_line_id_list = [
      options.lineid
    ];
    this.getId()
    this.ordersRefundShowRequest(order_head_id, order_line_id_list);
  },
  getId: function() {
    var that = this;
    xnService.loginnewId({}, function(data) {
      //console.log('newId', data);
      that.setData({
        newId: data,
      })
    })
  },
  /**
   * 选择服务类型
   */
  bindTypePickerChange: function(event) {
    var index = event.detail.value;
    this.data.type = this.data.typeIndex[index];
    this.setData({
      index: index
    })
  },

  /**
   * 选择退货原因
   */
  bindRefundReasonPickerChange: function(event) {
    var index = event.detail.value;
    this.data.refundReason = this.data.refundReasonIndex[index];
    this.setData({
      key: index
    })
  },
  OtherReason: function() {
    this.setData({
      OtherReason: event.detail.value
    })
  },
  /**
   * 获取用户要求退款金额
   */
  inputRequestedAmount: function(event) {
    var that = this;
    var money = event.detail.value;
    // if (money * 100 > this.data.maxRefundAmount * 100) {
    //   util.confirm('你输入的金额大于最多退款金额！', function (res) {
    //     that.setData({
    //       requestedAmount: ''
    //     });
    //   });
    // }
    console.log(event)
    //this.data.requestedAmount = event.detail.value;
    that.setData({
      requestedAmount: event.detail.value
    })
  },

  /**
   * 获取手机号码
   */
  inputContactPhone: function(event) {
    //  this.data.contactPhone = event.detail.value;
    this.setData({
      contactPhone: event.detail.value
    })
  },

  /**
   * 获取退款说明
   */
  inputRefundRemark: function(event) {
    console.log(event)
    //this.data.refundRemark = event.detail.value;
    this.setData({
      refundRemark: event.detail.value
    })
  },

  /**
   * 获取预退单信息
   */
  ordersRefundShowRequest: function(order_head_id, order_line_id_list) {
    var that = this;
    var params = {
      method: 'orders.refund.show',
      orderHeadId: order_head_id,
      orderLineIdList: order_line_id_list
    };
    requestService.request(params, function(res) {
      console.log(res)
      if (res.orderHead) {
        var data = res.orderHead;
        that.setData({
          freightFee: res.freightFee,
          maxRefundAmount: res.maxRefundAmount,
          contactPhone: data.contactPhone,
          isAllRefund: res.isAllRefund,
          quantity: res.orderLineList[0].quantity,
          chargebackId: res.refundHeadId,
          orderHeadId: res.orderHead.id,
          orderLineId: res.orderLineList[0].id
        });
      }
    });
  },

  /**
   * 提交退单
   */
  onSubmitTap: function(event) {
    var type = this.data.type;
    var refundReason = this.data.refundReason;
    var requestedAmount = this.data.requestedAmount;
    var contactPhone = this.data.contactPhone;
    var refundRemark = this.data.refundRemark;
    var isAllRefund = this.data.isAllRefund;
    var orderId = this.data.orderId;
    var orderHeadId = this.data.orderHeadId;
    var orderLineId = this.data.orderLineId;
    var quantity = this.data.quantity;
    var chargebackId = this.data.chargebackId

    if (!type) {
      $.confirm('请选择服务类型！');
      return false;
    }
    if (!refundReason) {
      $.confirm('请选择退款退货原因！');
      return false;
    }
    // if (this.data.key == 9) {
    //   if ($.isNull(this.data.OtherReason)) {
    //     $.confirm('请说明其它原因！');
    //     return false;
    //   }
    // }
    if (!requestedAmount) {
      $.confirm('请输入退款金额！');
      return false;
    }
    if (requestedAmount > this.data.maxRefundAmount) {
      $.confirm('请输入正确退款金额！');
      return false;
    }
    var params = {
      method: 'orders.refund.store',
      id: chargebackId,
      orderHeadId: orderHeadId,
      type: type,
      refundReason: refundReason,
      requestedAmount: requestedAmount,
      contactPhone: contactPhone,
      refundRemark: refundRemark,
      isAllRefund: isAllRefund,
      refundLineCommitRequestList: [{
        orderLineId: orderLineId,
        quantity: quantity
      }]
    };
    console.log(JSON.stringify(params))

    requestService.request(params, function(res) {
      console.log(res)
      if (res.firstErrorMessage == '' && res.is != '') {
        $.confirm('提交成功', function() {
          app.globalData.typefalg = true
          wx.navigateBack({
            delta: 2
          })
        })
      } else {
        $.confirm(res.firstErrorMessage)
      }
    });
  },
  onAddImgTap: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    //console.log(e);
    var tempFilePathsImage = [];
    var imgList = that.data.imgList;
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgList.length > 4) {
            $.confirm('最多支持上传5张图片');
            break;
            return;
          };
          var fileName = tempFilePaths[i].substring(tempFilePaths[i].lastIndexOf("/") + 1, tempFilePaths[i].length);
          var fileExt = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
          var passportId = wx.getStorageSync('passportId');
          wx.uploadFile({
            url: config.uploadFile + '?passportId=' + passportId,
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            formData: {
              'method': "api.foundation.attachment.upload",
              'Ext': fileExt,
              'FileName': fileName,
              'businessId': that.data.chargebackId,
              'businessType': "REFUND",
              'businessCategory': "REASON"
            },
            success: function(info) {
              var ImgData = JSON.parse(info.data);
              var imgList = that.data.imgList;
              imgList.push(ImgData.attachment);
              that.setData({
                imgList: imgList
              });
              console.log(ImgData);
              console.log(imgList);
            },
            fail: function(e) {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
            complete: function() {
              wx.hideToast(); //隐藏Toast
            }
          })
        }
      },
      fail: function(error) {

      },
    })
  },
  deleteImg: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var imgList = this.data.imgList;
    imgList.splice(index, 1);
    this.setData({
      imgList: imgList
    });
    that.delect(id);
  },
  delect: function(id) {
    var params = {
      attachmentId: id,
    };
    console.log(params)
    xnServiceapi.createCommentbatch(params, function(res) {
      console.log(res);
      if (res.firstErrorMessage != '') {
        $.confirm(res.firstErrorMessage);
      }
    });
  },
  imgtap: function(e) { //预览图片
    console.log(e)
    var current = e.currentTarget.dataset.src;
    var imgList = [];
    for (var x in this.data.imgList) {
      imgList.push(this.data.imgList[x].filePath)
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
})