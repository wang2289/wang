// pages/answercard/answercard.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    timulist: Object
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options.pager);
    var indexs = 0;
    var value = wx.getStorageSync(options.pager)
    var data = [];
    for (var i = 0; i < value.length; i++) {
      var data1 = {
        number: []
      }
      var num  = 0;
      data1.title = value[i].typename;
      data1.all = value[i].count;
      for (var j = 0; j < value[i].items.length; j++) {
        indexs += 1
        var data2 = {}
        data2.id = value[i].items[j].id
        if (value[i].items[j].mychoice == ""){
          data2.isdone=false
        }else{
          num += 1
          data2.isdone = true
        }
        data1.istry = num
        data2.indexnew = indexs
        data1.number.push(data2)
      }
      data.push(data1)
    }
    // console.log(data);
    this.setData({
      timulist: data
    })
  },
  onTab: function(event) {
    var id = event.currentTarget.dataset.postid;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      current: id - 1
    });
    wx.navigateBack({
      delta: 1
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})