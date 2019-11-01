  var methods = {
  orders: {
    index: 'api.ebusiness.orderNew.find',         // 订单列表
    sign: 'api.ebusiness.order.sign',             // 确认收货
    cancel: 'api.ebusiness.order.cancel',         // 取消订单
    show: 'api.ebusiness.orderDetailNew.get',     // 订单详情
    comments:{
      order: 'api.ebusiness.order.get',           // 订单评价组装数据
      upload: 'api.foundation.attachment.upload',  // 上传评价图片
      store: 'api.ebusiness.createComment.batch',  // 发布评论
    },
    refund: {
      show: 'api.ebusiness.refundOrder.pre',        // 获取待退单信息
      upload: 'api.ebusiness.refundMemberReturn.upload', // 提交退款退货物流信息
      store: 'api.ebusiness.refund.commit',         // 提交退单
    }
  },
  IntegralMall: {
    index: 'api.ebusiness.pointCommodity.find',   // 按类别查询商品
  },
  goods: {
    comments: {
      index: 'api.ebusiness.evaluationNew.find',  // 商品评价列表
      count: 'api.ebusiness.commodityEvaluationNumber.find', // 获取商品评价统计
    },
    coupon: {
      store: 'api.ebusiness.coupon.receive',      // 领取优惠券
    },
    collection: {
      is: 'api.ebusiness.exitCollection.is', // 用户是否收藏
    } 
  },
  point: {
    exchange: 'api.ebusiness.orderNew.find', // 积分兑换记录
  }
};

module.exports = methods;