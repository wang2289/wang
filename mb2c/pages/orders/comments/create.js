const requestService = require('../../../service/request.js');
const xnService = require('../../../service/service.js');
const xnServiceapi = require('../../../service/product.js');
const $ = require('../../../utils/util.js');
const config = require('../../../config.js');
var storeId = require('../../../config.js').storeId
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    evaluate_contant: ['评分'],
    normalSrc: '../../../img/stargray.png',
    selectedSrc: '../../../img/starcolor.png',
    halfSrc: '../../../img/shoucang.png',
    imgs: [],
    operatingUnitId: app.globalData.operatingUnitId,
    Imagelist: [],
    basetext: '',
    tempFilePathsImage: [],
    imgList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var order_id = options.order_id;
    //console.log(order_id);

    if (!order_id) {
      // 订单异常点击确定后返回上一个页面
      utils.confirm('订单异常！', function() {
        wx.navigateBack();
      });
    }
    this.ordersCommentsOrderRequest(order_id);
  },



  // 获取主键ID
  getIds: function(goods) {
    var that = this;
    var goodList = goods;
    var number=0;

    for(var i in goods){
      getId(i)
    }
    function getId(i){
      xnService.loginnewId({}, function (data) {
        goodList[i].newId = data;
        number++;
        if (number == goodList.length) {
          that.setData({
            goods: goodList,
          })
        }

      })
     
    }
   
   
  },

  // 组装订单数据
  ordersCommentsOrderRequest: function(order_id) {
    var that = this;
    var params = {
      method: 'orders.show',
      id: order_id
    };
    var goods=[];

    requestService.request(params, function(res) {
      for (var i = 0; i < res.order.orderLineList.length; i++) {
        if (!res.order.orderLineList[i].isRefund){
          res.order.orderLineList[i].imgList = [];
          res.order.orderLineList[i].content = '';
          res.order.orderLineList[i].score = 0;
          res.order.orderLineList[i].isAnonymous = false;
          res.order.orderLineList[i].isAddtion = false;
          res.order.orderLineList[i].hasAttachment = false;
          res.order.orderLineList[i].hasAddtion = false;
          res.order.orderLineList[i].memberId = wx.getStorageSync('memberId');
          res.order.orderLineList[i].stars = [0, 1, 2, 3, 4];
          res.order.orderLineList[i].scores = [0, 1, 2, 3, 4];
          res.order.orderLineList[i].operatingUnitId = that.data.operatingUnitId;
          goods.push(res.order.orderLineList[i]);
        }
        
      }
     
      that.setData({
        goods: goods
      });

      if (goods.length>0){
        that.getIds(goods);
      }
      
    });

  },

  deleteImg: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var line = e.currentTarget.dataset.line;
    var goods = this.data.goods;
    var imgList = goods[line].imgList;

    imgList.splice(index, 1);
    this.setData({
      goods: goods
    });
    that.delect(id);
  },

  // 输入评价内容
  bindContentInput: function(e) {
    var goods = this.data.goods;
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].id == e.currentTarget.dataset.id) {
        goods[i].content = e.detail.value;
      }
    }
  },

  // 匿名
  onAnonymousTap: function(e) {
    var goods = this.data.goods;
    //console.log(goods);
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].id == e.currentTarget.dataset.id) {
        if (goods[i].isAnonymous) {
          goods[i].isAnonymous = false;
        } else {
          goods[i].isAnonymous = true;
        }
      }
    }
    this.setData({
      goods: goods
    });
  },

  /**        
   * 点击上传图片
   */
  onAddImgTap: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var line = e.currentTarget.dataset.line;
    var goods = this.data.goods;
    var tempFilePathsImage = [];
    var imgList = goods[line].imgList;
    var newId = goods[line].newId;
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          if (imgList.length > 4) {
            $.confirm('最多支持上传5张图片');
            break;
            return;
          };
          var fileName = tempFilePaths[i].substring(tempFilePaths[i].lastIndexOf("/") + 1, tempFilePaths[i].length);
          var fileExt = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
          var passportId = wx.getStorageSync('passportId');
          wx.uploadFile({
            url: config.uploadFile + '?passportId=' + passportId,
            filePath: tempFilePaths[i],
            name: 'file',
            header: {
              "Content-Type": 'application/x-www-form-urlencoded'
            },
            formData: {
              'method': "api.foundation.attachment.upload",
              'Ext': fileExt,
              'FileName': fileName,
              'businessId': newId,
              'businessType': "COMMODITY_COMMENT"
            },
            success: function(info) {
              var ImgData = JSON.parse(info.data);
              imgList.push(ImgData.attachment);
              that.setData({
                goods: goods
              });
            },
            fail: function(e) {
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
            complete: function() {
              wx.hideToast(); //隐藏Toast
            }
          })        
        }
      },
      fail: function(error) {

      },
    })
  },

  // 提交事件
  onSubmitTap: function() {
    var that = this;
    var goods = that.data.goods;
    var values = [];
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].score == 0) {
        if (goods.length > 1) {
          $.confirm('第' + (i + 1) + '个商品未评分！');
        } else {
          $.confirm('商品未评分！');
        }
        return false;
      } else if (goods[i].content == '') {
        if (goods.length > 1) {
          $.confirm('第' + (i + 1) + '个商品评论内容不能为空！');
        } else {
          $.confirm('评论内容不能为空！');
        }
        return false;
      } else if (goods[i].content.length < 5) {
        if (goods.length > 1) {
          $.confirm('第' + (i + 1) + '个商品评论内容不能低于5个字！');
        } else {
          $.confirm('商品评论内容不能少于5个字！');
        }
        return false;
      }

      var val = {
        id: goods[i].newId,
        content: goods[i].content,
        score: goods[i].score,
        isAnonymous: goods[i].isAnonymous,
        commodityId: goods[i].commodityId,
        commodityTitle: goods[i].commodityTitle,
        rowVersion: "1",
        orderHeadId: goods[i].orderHeadId,
        orderLineId: goods[i].id,
        memberId: goods[i].memberId,
        storeId: storeId,
        operatingUnitId: that.data.operatingUnitId,
        isAddtion: goods[i].isAddtion,
        hasAddtion: goods[i].hasAddtion
      };

      if (goods[i].imgList.length == 0) {
        val.hasAttachment = false
      } else {
        val.hasAttachment = true
      }

      values.push(val);
    }
    var params = {
      method: 'orders.comments.store',
      commodityEvaluationCreates: values
    };
    requestService.request(params, function(res) {
      if (res.firstErrorMessage == '') {
        if (res.resultCount > 0) {
          $.confirm('评论发布成功', function() {
            // wx.redirectTo({
            //   url: '/pages/orders/index?status=SIGNED'
            // });
            app.globalData.typefalg = true;
            wx.navigateBack({
              delta: -1
            })
          });
        }
      } else {
        $.confirm('评论发布失败');
      }
    });
  },
 
  //点击左边,半颗星
  selectLeft: function(e) {
    console.log(e)
    var score = e.currentTarget.dataset.score;
    var goods = this.data.goods;
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].id == e.currentTarget.dataset.id) {
        goods[i].score = score;
        goods[i].scores[e.currentTarget.dataset.idx] = score;
      }
    }
    this.setData({
      goods: goods
    })
  },
  /**
   * 上传图片
   */
  onUploadImageTap: function() {
    var params = {
      method: 'orders.comments.upload',
      businessType: '评价',
      businessId: this.data.newId,
      fileStream: '',
    };
    requestService.uploadRequest(params, function(res) {
      //console.log(res);
    });
  },
  imgtap: function(e) { //预览图片
    console.log(e)
    var current = e.currentTarget.dataset.src;
    var imgList=[];
    for (var x in this.data.imgList){
      imgList.push(this.data.imgList[x].filePath)
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls:imgList // 需要预览的图片http链接列表
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

  base64_encode: function(str) { // 编码，配合encodeURIComponent使用
    var c1, c2, c3;
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var i = 0,
      len = str.length,
      strin = '';
    while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt((c1 & 0x3) << 4);
        strin += "==";
        break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
        strin += base64EncodeChars.charAt(c1 >> 2);
        strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        strin += base64EncodeChars.charAt((c2 & 0xF) << 2);
        strin += "=";
        break;
      }
      c3 = str.charCodeAt(i++);
      strin += base64EncodeChars.charAt(c1 >> 2);
      strin += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      strin += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      strin += base64EncodeChars.charAt(c3 & 0x3F)
    }
    // this.setData({
    //   basetext: strin
    // })
    this.stringToByte(strin)
  },
  
  delect: function(id) {
    var params = {
      attachmentId: id,
    };
    console.log(params)
    xnServiceapi.createCommentbatch(params, function(res) {
      console.log(res);
      if (res.firstErrorMessage != '') {
        $.confirm(res.firstErrorMessage);
      }
    });
  }
})