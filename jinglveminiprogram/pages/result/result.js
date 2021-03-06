import { requestsend, requestsendtoken } from '../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timulist: Object,
    title:'',
    pageid:'',
    minute:0,
    second:0,
    score:0,
    total:0,
    right:0,
    showl: true,
    sign:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id 
    this.setData({
      id: id
    })
    var pageid = options.pageid
    var token = wx.getStorageSync("userName")
    // wx.getStorageSync("token")
    console.log(pageid)
    var param={
      AnswerPaperGuid: id
    }
  
    var that = this;
    if (token == '') {
      var param2 = {
        Chachekey: id
      }
      requestsend('api/TiKu/GetPaperResultNoLogin', "GET", param2, function (e) {
        console.log(e);
        var num = 0;
        for (var i = 0; i < e.data.timulist.length; i++) {
          for (var j = 0; j < e.data.timulist[i].number.length; j++) {
            e.data.timulist[i].number[j].num = num;
            num += 1;
          }
        }
        var minute = e.data.time.split(':')[0]
        var second = e.data.time.split(':')[1]
        that.setData({
          id: id,
          showl: false,
          pageid: pageid,
          timulist: e.data.timulist,
          minute: minute,
          second: second,
          title: e.data.title,
          score: e.data.score,
          total: e.data.total,
          right: e.data.right,
          sign: e.data.sign
        })
      })
    }else{
      requestsendtoken('api/QX/GetPaperResult', "GET", param, function (e) {
        console.log(e);
        var num = 0;
        for (var i = 0; i < e.data.timulist.length; i++) {
          for (var j = 0; j < e.data.timulist[i].number.length; j++) {
            e.data.timulist[i].number[j].num = num;
            num += 1;
          }
        }
        var minute = e.data.time.split(':')[0]
        var second = e.data.time.split(':')[1]
        that.setData({
          id: id,
          showl: false,
          pageid: pageid,
          timulist: e.data.timulist,
          minute: minute,
          second: second,
          title: e.data.title,
          score: e.data.score,
          total: e.data.total,
          right: e.data.right,
          sign: e.data.sign
        })
      })
    }
   
  },
  onLook: function (event) {
    let postId = event.currentTarget.dataset.index;
    // let pageid = event.currentTarget.dataset.index;
    console.log(postId)
      wx.navigateTo({
        url: '../../pages/analysis/analysis?index=' + postId + '&id=' + this.data.id + '&pageid=' + this.data.pageid,
      })
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
    var id = this.data.id
    var pageid = this.data.pageid
    var token = wx.getStorageSync("userName")
    var param = {
      AnswerPaperGuid: id
    }
    var that = this;
    if (token == '') {
      var param2 = {
        Chachekey: id
      }
      requestsend('api/TiKu/GetPaperResultNoLogin', "GET", param2, function (e) {
        that.setData({
          sign: e.data.sign
        })
      })
    } else {
      requestsendtoken('api/QX/GetPaperResult', "GET", param, function (e) {
        that.setData({
          sign: e.data.sign
        })
      })
    }
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