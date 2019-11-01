var webviewsrc = require('../../config.js').webviewsrc;
const app = getApp();




  Page({
    data: {
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      url: ''
    },
    //页面加载时触发
    onLoad: function (options) {
      var url = "https://" + webviewsrc + '/mb2c/index.htm';
      console.log(url);

      this.setData({
        url: url
      })
 
    },
  })