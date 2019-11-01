// pages/Lookat/Lookat.js
const xnServiceapi = require('../../service/confirmanorder.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:[],
    provinceInfo:[],
    CityId:0,  //市id
    DistrictId:0,  //区id
    tapindex:1,
    CityInfo:[],  //市信息
    TowInfo:[],  //区信息
    fid:0,
    fic: 0,
    fie:0,
    provname:"",
    provid:0,
    cityid:"",
    cityname:"",
    districtid:0,
    districtname:"",
    tab:0,
    tapindexa:0,
    id:"",
    itemid:"",
    numval:"",
    ban:"",
    sunbit:"",
    consignee:"",
    conPhone:"",
    conNumbe:"",
    conaddress:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.tab==4){
      this.setData({
        ban:JSON.parse(options.ban)
      })
    }
    this.setData({
      tab: options.tab,
      tapindexa: options.tapindexa,
      itemid: options.itemid,
      sunbit: options.sunbit,
      consignee: options.consignee,
      conPhone: options.conPhone,
      conNumbe: options.conNumbe,
      conaddress: options.conaddress
    })
    this.province()
  },
  allOrders: function () { //全部订单
    this.setData({
      tapindex: 1,
    });
  },
  toBePaid: function () { //待付款
    this.setData({
      tapindex: 2,
    });
    this.cityInfo();
  },
  receiptOfGoods: function () { //待发货   PROVINCE
    this.setData({
      tapindex: 3,
    });
    this.TowInfo();
  },
  province: function () {   //省信息
    var val = {
      pid: "86",
      type: "PROVINCE",
    }
    var that = this;
    xnServiceapi.areaListByPid(val, function (data) {
      console.log('省信息', data)
      that.setData({
        provinceInfo: data.areaList
      })
    })
  },
  cityInfo: function () {   //市信息
    var val = {
      pid: this.data.provid,
      type: "CITY",
    }
    console.log(val)
    var that = this;
    xnServiceapi.areaListByPid(val, function (data) {
      console.log('市信息', data)
      that.setData({
        CityInfo: data.areaList
      })
    })
  },
  TowInfo:function(){    //区信息
    var val = {
      pid: this.data.cityid,
      type: "DISTRICT",
    }
    console.log(val)
    var that = this;
    xnServiceapi.areaListByPid(val, function (data) {
      console.log('区信息',data)
      that.setData({
        TowInfo: data.areaList
      })
    })
  },
  ClickProvinc:function(e){    //省信息
  console.log(e)
   this.setData({
     fid: e.currentTarget.dataset.prduindex,
     provname: e.currentTarget.dataset.provname,
     provid: e.currentTarget.dataset.provid,
     tapindex: 2,
   })
    this.cityInfo();
  },
  ClickCity:function(e){   //市信息
     console.log(e)
     this.setData({
       cityid: e.currentTarget.dataset.cityid,
       cityname: e.currentTarget.dataset.cityname,
       fic: e.currentTarget.dataset.prduindex,
       tapindex: 3,
     })
    this.TowInfo()
     
  },
  ClickDistrict:function(e){    //区信息
    this.setData({
      districtid: e.currentTarget.dataset.districtid,
      districtname: e.currentTarget.dataset.districtname,
      fie: e.currentTarget.dataset.prduindex,
    })
    if(this.data.tab==1){
      if (this.data.provname == "" && this.data.provid == "" && this.data.cityid == "" && this.data.cityname == "") {
        wx.showToast({
          title: '请选择省市',
        })
      } else {
        var model = JSON.stringify(this.data.ban);

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          cityid: this.data.cityid,
          cityname: this.data.cityname,
          districtid: this.data.districtid,
          districtname: this.data.districtname,
          provid: this.data.provid,
          provname: this.data.provname,
          addressInfo: this.data.provname + this.data.cityname + this.data.districtname,
          companyAddress: this.data.provname + this.data.cityname + this.data.districtname,
          address: this.data.provname + this.data.cityname + this.data.districtname
        })

        wx.navigateBack();
      }
    } else if (this.data.tab == 2){
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        cityid: this.data.cityid,
        cityname: this.data.cityname,
        districtid: this.data.districtid,
        districtname: this.data.districtname,
        provid: this.data.provid,
        provname: this.data.provname,
        addressInfo: this.data.provname + this.data.cityname + this.data.districtname,
        companyAddress: this.data.provname + this.data.cityname + this.data.districtname,
        address: this.data.provname + this.data.cityname + this.data.districtname
      })

      wx.navigateBack();
    } else if (this.data.tab==4){
      var model = JSON.stringify(this.data.ban);
      
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        cityid: this.data.cityid,
        cityname: this.data.cityname,
        districtid: this.data.districtid,
        districtname: this.data.districtname,
        provid: this.data.provid,
        provname: this.data.provname,
        addressInfo: this.data.provname + this.data.cityname + this.data.districtname,
        companyAddress: this.data.provname + this.data.cityname + this.data.districtname,
        address: this.data.provname + this.data.cityname + this.data.districtname,
        tab: this.data.tab
      })

      wx.navigateBack();
    }else{
    if (this.data.provname == "" && this.data.provid == "" && this.data.cityid == "" && this.data.cityname==""){
      wx.showToast({
        title: '请选择省市',
      })
    }else{
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        cityid: this.data.cityid,
        cityname: this.data.cityname,
        districtid: this.data.districtid,
        districtname: this.data.districtname,
        provid: this.data.provid,
        provname: this.data.provname,
        addressInfo: this.data.provname + this.data.cityname + this.data.districtname,
        companyAddress: this.data.provname + this.data.cityname + this.data.districtname,
        address: this.data.provname + this.data.cityname + this.data.districtname
      })

      wx.navigateBack();
    }
    }
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
  
  }
})