const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    p: 1,    //分页请求
    totalpage: null,    //总页数
    isloading: true,    //是否显示加载动画
    newsList: [],    //数据
    isIos: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      isIos: app.globalData.isIos
    })
    if (wx.getStorageSync("userName") != "") {
      util.requestsendtoken("api/QX/GetTaoCanMoreLogin?", null, {
        pageindex: that.data.p
      }, res => {
        console.log("onload登陆：");
        console.log(res);
        that.setData({
          newsList: res.data.list,
          isloading: true,
          totalpage: res.data.sumpage
        })
      });

    } else {

      util.requestsend("api/OrgCourseMoney/GetTaoCanMore?", null, {
        pageindex: that.data.p
      }, res => {
      


        that.setData({
          newsList: res.data.list,
          isloading: true,
          totalpage: res.data.sumpage
        })


      });

    }

    // util.requestsendtoken("api/QX/GetMyTaoCan?", null, {
    // }, res => {
    //   console.log("购买的套餐");
    //   console.log(res)

    // })

  },
  bindnavtopackage: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/packagedetail/packagedetail?id=' + id,
    })

  },
  // processData: function (res) {
  //   console.log("获取的：");
  //   console.log(res.data);
  //   var that = this
  //   that.setData({
  //     list:res.data


  //   })

   

  // },
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
  obtainNews: function () {

    var that = this;
    if (wx.getStorageSync("userName") != "") {
      util.requestsendtoken("api/QX/GetTaoCanMoreLogin?", null, {
        pageindex: that.data.p
      }, res => {
        var newsArr = that.data.newsList;
        for (var i = 0; i < res.data.list.length; i++) {
          let getdata = res.data.list[i];
          newsArr.push(res.data.list[i])
        }
        that.setData({
          newsList: newsArr,
          isloading: true,
          totalpage: res.data.sumpage
        })
      });

    }else{
      util.requestsend("api/OrgCourseMoney/GetTaoCanMore?", null, {
        pageindex: that.data.p
      }, res => {
     
        var newsArr = that.data.newsList;
        for (var i = 0; i < res.data.list.length; i++) {
          let getdata = res.data.list[i];
          newsArr.push(res.data.list[i])
        }
        that.setData({
          newsList: newsArr,
          isloading: true,
          totalpage: res.data.sumpage
        })


      })

    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
    var p = this.data.p;
    console.log("当前页：" + p);
    var totalpage = this.data.totalpage ;
    console.log("总数量："+totalpage);
    p++;
    if (p > totalpage) {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
      return;
    }
    this.setData({
      isloading: false,
      p: p
    })
    this.obtainNews()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})