//index.js
//获取应用实例
const app = getApp()
import {
  Config
} from '../../utils/config';
import {
  Token
} from '../../utils/token.js'
import { requestsend, requestsendtoken } from '../../utils/util.js'
import Toast from 'vant-weapp/toast/toast';
Page({
  data: {
    id: null,
    address: '',
    username: '',
    Tel: '',
    allmoney: '',
    goodslist: [],
    createtime: '',
    orderno: '',
    payNo: '',
    paytime: ''
  },
  onLoad: function (options) {
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    console.log(options)
    this.setData({
      id: options.id
    })
    console.log(this.data.id)
    this.getOrderDetail()
  },
  getOrderDetail: function(){
    var params = {
      OrderNo: this.data.id
    }
    requestsendtoken('api/QX/GetMyOrderDetail', 'GET', params, this.getMyOrderDetailAjax)
  },
  getMyOrderDetailAjax: function(res){
    if(res.code == 0){
      Toast.clear()
      console.log(res)
      var data = res.data
      var addressinfo = res.data.addressdata
      var list = data.data
      for(var i = 0; i<list.length; i++){
         var newmoney = Number(list[i].money).toFixed(2)
         list[i].money = newmoney
        console.log(list[i].money)
      }
      data.allmoney = Number(data.allmoney).toFixed(2)
      this.setData({
        address: addressinfo.address,
        username: addressinfo.username,
        Tel: addressinfo.Tel,
        allmoney: data.allmoney,
        goodslist: data.data,
        createtime: data.createtime,
        orderno: data.orderno,
        payNo: data.payNo,
        paytime: data.paytime
      })
    } else{
      Toast.clear()
      Toast.fail(res.msg)
    }
  }
})
