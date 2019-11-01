//index.js
//获取应用实例

const app = getApp()
const WXApi = require('../../wxapi/main')
import Dialog from 'vant-weapp/dialog/dialog';
import {
  Config
} from '../../utils/config';
import {
  Token
} from '../../utils/token.js'
import { requestsend, requestsendtoken } from '../../utils/util.js';
import Toast from 'vant-weapp/toast/toast';
Page({
  data: {
    motto: 'Hello 微信小程序',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isIos: null,
    myOrderList: [
      {
        ordernum: "20190906EYZLTGJFU",
        orderTitle: "初级会计考试必考指南",
        orderImgUrl:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
        orderPrice: "60.00",
        buyednum: 1,
        totalPrice: 60,
        id:1
      },
      {
        ordernum: "20190906EYZLTGJFU",
        orderTitle: "初级会计考试必考指南",
        orderImgUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
        orderPrice: "60.00",
        buyednum: 2,
        totalPrice: 60,
        id: 2
      },
      {
        ordernum: "20190906EYZLTGJFU",
        orderTitle: "初级会计考试必考指南",
        orderImgUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
        orderPrice: "60.00",
        buyednum: 3,
        totalPrice: 60,
        id:3
      },
      {
        ordernum: "20190906EYZLTGJFU",
        orderTitle: "初级会计考试必考指南",
        orderImgUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
        orderPrice: "60.00",
        buyednum: 4,
        totalPrice: 60,
        id: 4
      }
    ],
    orderList: [],
  },
  onLoad: function () {
    this.setData({
      isIos: app.globalData.isIos
    })
  },
  onShow: function(){
    Toast.loading({
      mask: false,
      message: '加载中...',
      duration: 0
    });
    this.getOrderList()
  },
  onClose(event) {
    const { position, instance } = event.detail;
    console.log(event)
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {
          instance.close();
          this.setData({
            myOrderList: [
              // {
              //   ordernum: "20190906EYZLTGJFU",
              //   orderTitle: "初级会计考试必考指南",
              //   orderImgUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
              //   orderPrice: "60.00",
              //   buyednum: 1,
              //   totalPrice: 60,
              //   id: 1
              // },
              {
                ordernum: "20190906EYZLTGJFU",
                orderTitle: "初级会计考试必考指南",
                orderImgUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
                orderPrice: "60.00",
                buyednum: 2,
                totalPrice: 60,
                id: 2
              },
              {
                ordernum: "20190906EYZLTGJFU",
                orderTitle: "初级会计考试必考指南",
                orderImgUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
                orderPrice: "60.00",
                buyednum: 3,
                totalPrice: 60,
                id: 3
              },
              {
                ordernum: "20190906EYZLTGJFU",
                orderTitle: "初级会计考试必考指南",
                orderImgUrl: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4086949766,808648332&fm=26&gp=0.jpg",
                orderPrice: "60.00",
                buyednum: 4,
                totalPrice: 60,
                id: 4
              }
            ]
          })
        });
        break;
    }
  },
  gotoMyOrderDetail: function(e){
    console.log(e)
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/myorderdetail/myorderdetail?id=' + id
    })
  },
  getOrderList: function(){
    var params = {}
    requestsendtoken('api/QX/GetMyOrder', 'GET', params, this.getOrderListAjax)
  },
  getOrderListAjax: function(res){
    if (res.code == 0) {
      Toast.clear()
      console.log(res)
      this.setData({
        orderList: res.data,
      })
    } else {
      Toast.clear()
      Toast.fail("服务器异常")
    }
  },
  deleteOder: function(e){
    var id = e.currentTarget.dataset.id
    Dialog.confirm({
      message: '确定删除吗？'
    }).then(() => {
      Toast.loading({
        mask: false,
        message: '删除中...',
        duration: 0
      });
      var params={
        OrderNo: id
      }
      requestsendtoken('api/QX/DelMyOrder', 'GET', params, this.deleteOderAjax)
    });
  },
  deleteOderAjax: function(res){
    if(res.code == 0){
      Toast.clear()
      Toast.success(res.msg)
      this.getOrderList()
    } else{
      Toast.fail(res.mag)
    }
  }

})
