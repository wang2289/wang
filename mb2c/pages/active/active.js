// pages/active/active.js
var webviewsrc = require('../../config.js').webviewsrc;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:null
  },
  //判断obj是否为json对象
  isJson:function(obj) {
      var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
      return isjson;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (options.scene && !this.isJson(options.scene)){
        options = decodeURIComponent(options.scene);
        var params = options.split('&');
        options = {};
        for (var i = 0; i < params.length;i++){
            let temps = params[i].split('=');
            if (temps.length == 2){
                let key = temps[0];
                let value = temps[1];
                options[key] = value;
            }
        }
    }
    var url = "https://" + webviewsrc + '/mb2c/custom/activity.htm?code=' + options.code;
    this.setData({
        url: url
    });

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