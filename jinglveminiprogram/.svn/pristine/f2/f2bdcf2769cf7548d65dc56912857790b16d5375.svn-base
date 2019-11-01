// pages/cart/addressadd/addressadd.js
var area = require('../../../utils/area.js')
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    show: false,
    checked: false,
    province: "省",
    city: "市",
    county: "区",
    ReceivetName: '',
    ReceiveAddress: '',
    Tel: ''
  },
  //联系人
  onChangeName(event) {
    console.log("联系人");
    this.setData({
      ReceivetName: event.detail.value
    })

  },
  //联系电话
  onChangeMobile(event) {
    console.log("联系电话");
    this.setData({
      Tel: event.detail.value
    })

  },
  //详细地址
  onChangeaddressdetail(event) {
    console.log("详细地址");
    this.setData({
      ReceiveAddress: event.detail.value
    })

  },

  oncity(event) {
    console.log(event.detail)
    this.setData({
      show: true
    });
  },
  //保存
  onsave: function (e) {
    if (this.data.ReceivetName == "") {
      wx.showToast({
        title: '收件人不能为空',
      })
      return;
    }
    if (this.data.Tel == "") {
      wx.showToast({
        title: '手机不能为空',
      })
      return;
    }
    if (this.data.Tel.length != 11) {
      wx.showToast({
        title: '手机格式不正确',
      })
      return;
    }

    if (this.data.ReceiveAddress == "") {
      wx.showToast({
        title: '详细地址不能为空',
      })
      return;
    }
    util.requestposttoken('api/UsersAddress/EditAddress?type=2', {
      ReceivetName: this.data.ReceivetName,
      ReceiveAddress: this.data.ReceiveAddress,
      Tel: this.data.Tel,
      Province: this.data.province,
      City: this.data.city,
      Area: this.data.county,
      IsDefault: this.data.checked,
      Id:this.data.id
    }, res => {
      console.log(res)
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.msg,
        })
      }
    })
  },

  onClose() {
    this.setData({
      show: false
    });
  },
  //取消按钮
  oncancel() {
    this.setData({
      show: false
    });
  },
  //确认按钮
  confirm(e) {
    console.log(e);
    this.setData({
      province: e.detail.values[0].name,
      city: e.detail.values[1].name,
      county: e.detail.values[0].name,
      show: false

    })
  },
  //默认按钮
  onSwitchChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
    console.log(detail);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let id=options.id
    util.requestsendtoken('api/UsersAddress/GetAddressbyId?', null, {
      id:id
    }, res => {
if(res.code==0)
{
this.setData({
  ReceivetName: res.data.receivetname,
  ReceiveAddress: res.data.receiveaddress,
  Tel: res.data.tel,
  checked: res.data.isdefault,
  province: res.data.province,
  city: res.data.city,
  county: res.data.area,
  id:id
})
}else{
wx.showToast({
  title: res.msg,
})
}

    });
    this.setData({
      areaList: area.default
    })
    console.log(this.data.areaList);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})