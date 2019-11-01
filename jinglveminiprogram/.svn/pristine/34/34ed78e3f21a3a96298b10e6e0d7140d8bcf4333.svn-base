const util = require('../../../utils/util.js')
import Dialog from 'vant-weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultaddres: "",
    alladdress: [],
  },

  onDel(event) {
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？'
        }).then(() => {

          util.requestsendtoken('api/UsersAddress/DelMayAddress?', null, {
            id: event.currentTarget.dataset.id
          }, res => {
            if (res.code == 0) {
              instance.close();
              let alladdres = this.data.alladdress;
              alladdres.splice(event.currentTarget.dataset.index, 1);
              this.setData({
                alladdress: alladdres
              });
            } else {
              wx.showToast({
                title: res.msg,
              })
            }
          })
          console.log(event.currentTarget.dataset.id);
        }).catch(() => {
          instance.close();
        });
        break;
    }
  },
  onclicknavito: function(e) {
    wx.navigateTo({
      url: '../addressmodif/addressmodif?id=' + e.currentTarget.dataset.id,
    })
  },
  onclicktest:function()
  {
    var pages=getCurrentPages();
    console.log(pages);
    if (pages.length > 1) {
      var beforePage = pages[pages.length - 2];//获取上一个页面实例对象
      beforePage.changeData();//触发父页面中的方法
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  addaddress: function(e) {
    wx.navigateTo({
      url: '../addressadd/addressadd',
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
    console.log("morine:" + this.data.defaultaddres);
    util.requestsendtoken('api/UsersAddress/GetMyAddress?', null, {}, res => {
      console.log(res.data);
      this.setData({
        defaultaddres: res.data.defaultaddress,
        alladdress: res.data.alladdress

      })

    })

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