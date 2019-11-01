 var app = getApp();
 const xnService = require('../../service/service.js');
 const xnServiceapi = require('../../service/personalcenter.js');
 const api = require('../../service/product.js');
 const apiserver = require('../../service/confirmanorder.js');
 var $ = require('../../utils/util.js');
 const config = require('../../config.js');
 var tenantId = require('../../config.js').tenantId;
 var storeId = require('../../config.js').storeId;
 var IMG_URL = 'https://cdn.xiniunet.com/img/fangliao/code.jpg';
 import { connect } from '../../chat/redux/index.js';
 import { showToast, correctData } from '../../utils/util.js'

 let store = app.store
 let pageConfig = {

   /**
    * 页面的初始数据
    */
   data: {
     xnLoading:true,
     modalHidden: true,
     nocancel:true,
     img_url: IMG_URL,
     isRoot:'',

     orderItems: [{
         status: 'UN_PAID',
         name: '待付款',
         url: 'bill',
         imageurl: '../../img/paying.png',
         number:0
       },
       {
         status: 'UN_SHIPMENT',
         name: '待发货',
         url: 'bill',
         imageurl: '../../img/order_paid.png',
         number: 0
       },
       {
         status: 'UN_SIGNED',
         name: '待收货',
         url: 'bill',
         imageurl: '../../img/delivering.png',
         number: 0
       },
       {
         status: 'SIGNED',
         name: '待评价',
         url: 'bill',
         imageurl: '../../img/evaluating.png',
         number: 0
       },
       {
         status: 'EVALUATION',
         name: '退售后',
         url: 'bill',
         imageurl: '../../img/sold.png',
         number: 0
       }
     ],
     UserInfo: [],
     isClick: false,
     operatingUnitId: app.globalData.operatingUnitId, //经营单元Id
     memberUserInfo: '', //会员信息
     collection: 0, //收藏数量
     Couponamount: 0, //优惠券数量
     PointsInfo: 0

   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(options) {
     let _this=this;
     $.loading();
     console.log(app.checkLogin());
     if(app.checkLogin()) {
         $.hideloading();
         this.setData({
             xnLoading: false
         });

         var that = this;
         that.memberDetailIndexget();
         this.prePaidCardEntity();
         this.MymemberPoint();
         this.myOrderCount("UN_PAID");
         this.myOrderCount("UN_SHIPMENT");
         this.myOrderCount("UN_SIGNED");
         this.myOrderCount("SIGNED");
         this.myOrderCount("EVALUATION");
     }
     this.getRoot();
   },

     //弹出窗口
     buttonTap: function () {
         this.setData({
             modalHidden: false
         })
         this.getRoot();
     },

     //点击确认
     modalConfirm: function (e) {
       wx.getSetting({

         success(res) {
           console.log(res.authSetting['scope.writePhotosAlbum']);
           if (res.authSetting['scope.writePhotosAlbum'] === false) {
             wx.openSetting({
               success(settingdata) {
                 if (settingdata.authSetting['scope.writePhotosAlbum']) {
                   console.log('获取权限成功，再次点击图片保存到相册。');
                 } else {
                   wx.showToast({
                     title: '保存失败',
                     icon: 'none',
                     duration: 2000
                   });
                 }
               }
             });
           }
         }
       });

       wx.downloadFile({
         url: 'https://cdn.xiniunet.com/img/fangliao/code.jpg',
         success: function (res) {
           wx.saveImageToPhotosAlbum({
             filePath: res.tempFilePath,
             success: function (data) {
               wx.showToast({
                 title: '保存成功',
                 icon: 'none',
                 duration: 2000
               });
             },
             fail: function (err) {
               if (err.errMsg.indexOf('auth') !== -1) {
                 console.log('dsfsdfdsds');
               } else {
                 wx.showToast({
                   title: '保存失败',
                   icon: 'none',
                   duration: 2000
                 });
               }
             }
           });
         }
       });
         this.setData({
             modalHidden: true
         })
     },

     //点击取消
     modalCancel: function () {
         // do something
         this.setData({
             modalHidden: true
         })
     },

     //保存图片之前先进行授权操作
     getRoot: function () {
         var _this = this;
         wx.getSetting({
             success: function (res) {
                 console.log("获取用户的授权信息", res)
                 if (!res.authSetting['scope.writePhotosAlbum']) {
                     _this.setData({
                         isRoot: false
                     })
                     //主动进行相册的授权
                     wx.authorize({
                         scope: 'scope.writePhotosAlbum',
                         success: function () {
                             console.log("授权成功")
                             _this.setData({
                                 isRoot: true
                             })
                         },
                         fail: function () {
                             console.log("授权失败")
                             _this.setData({
                                 isRoot: false
                             })
                         }
                     })
                 }else {
                     _this.setData({
                         isRoot: true
                     })
                 }
             }
         })
     },

     //判断授权结果
     authOpen: function (res) {
         let _this = this;
         if (res.detail.authSetting['scope.writePhotosAlbum']) {
             _this.setData({
                 isRoot: true
             })
         } else {
             _this.setData({
                 isRoot: false
             })
         }
     },

   //订单状态的待付款数量
   myOrderCount: function (orderStatus) {
     var that  = this;
     var orderItems = this.data.orderItems;
     if ("EVALUATION" == orderStatus){
       var val = {
         memberId: app.globalData.memberId,
         storeId: storeId,
         systemType: 'B2C',
         statusList: ['UN_APPROVED', 'AGREED'],
         pageSize: 1,
       }
       apiserver.refundfind(val, function (data) {
         if (data.firstErrorMessage || data.message) {
           $.alert(data.firstErrorMessage ? data.firstErrorMessage : data.message);
         }else{
           for (var i in orderItems) {
             if (orderItems[i].status == orderStatus) {
               orderItems[i].number = data.totalCount;
             }
             that.setData({
               orderItems: orderItems
             })
           }
         }
       })
       //查退单数量
     }else{
       //查订单数量
       var val = {
         memberId: app.globalData.memberId,
         pagesize: 1,
         status: orderStatus,
         systemType: "B2C",
         isFullReturn: false,
       }
       xnService.findOrderCount(val, function (data) {
         if (data.firstErrorMessage || data.message) {
           $.alert(data.firstErrorMessage ? data.firstErrorMessage : data.message);
         } else {
           for (var i in orderItems) {
             if (orderItems[i].status == orderStatus) {
               orderItems[i].number = data.totalCount;
             }
             that.setData({
               orderItems: orderItems
             })
           }
         }
       })
     }
     
   },

   MymemberPoint: function() {
     var val = {
       memberId: app.globalData.memberId,
     };
     //console.log.log(val)
     var that = this;
     apiserver.memberPoint(val, function(data) {
       that.setData({
         PointsInfo: data.point
       })
     })
   },

   prePaidCardEntity: function() {
     var val = {
       memberId: app.globalData.memberId,
       isAvailable: true,
       bindMemberId: app.globalData.memberId
     }
     var that = this
     xnServiceapi.prePaidCardEntity(val, function(data) {
       //console.log.log(data)
       that.setData({
         GiftcardCount: data.totalCount
       })
     })
   },


   onToOrderTap: function(event) {
     console.log("tiao:",event)
     var status = event.currentTarget.dataset.status;
     wx.navigateTo({
       url: '../orders/index?status=' + status,
     })
   },
   signIn: function() {
     var val = {
       objectId: app.globalData.memberId,
     }
     //console.log(val)
     var that = this;
     xnService.signInNew(val, function(e) {
       //console.log.log(e)
       that.setData({
         isClick: true
       })
       if (e.firstErrorMessage == '') {
         wx.showToast({
           title: '已签到',
           icon: 'succes',
           duration: 1000,
         })
         var memberUserInfo = that.data.memberUserInfo;
         memberUserInfo.hasSignIn = true;
         that.setData({
           memberUserInfo: memberUserInfo
         })
         that.MymemberPoint();
         that.memberDetailIndexget()
       } else if (e.firstErrorMessage != "") {
         wx.showToast({
           title: e.firstErrorMessage,
           icon: 'succes',
           duration: 1000,
         })
         that.MymemberPoint();
         that.memberDetailIndexget()
       }
     })
   },
   memberDetailIndexget: function() {
     var val = {
       operatingUnitId: this.data.operatingUnitId,
       systemType: "B2C",
       deviceType: "MOBILE",
       storeId:storeId
     }
     //console.log(val)
     var that = this;
     xnServiceapi.memberDetailIndexget(val, function(data) {
       console.log(data)
       if (data.firstErrorMessage == "") {
         that.setData({
           memberUserInfo: data,
           collection: data.collectionNum, //收藏数量
           Couponamount: data.couponEntityNum, //优惠券数量
         })
       }
     })
   },
   security: function() {
     wx.navigateTo({
       url: '../Accountsecurity/Accountsecurity',
     })
   },
   exite: function() {
     var that = this;
     wx.showModal({
       title: '提示',
       content: '确定退出吗',
       success: function (res) {
         if (res.confirm){
           var val = {
             id: app.globalData.memberId
           }
           xnService.passportrevoke(val, function (data) {
             console.log(data)
             if (data.firstErrorMessage == '') {
               app.globalData.nim.destroy({
                 done: function () {
                   console.log('destroy nim done !!!');
                   that.userOauthdelete();
                 }
               })


             } else {
               $.confirm(data.firstErrorMessage)
             }
           })
          }
       }
     })
   },
   userOauthdelete: function() { //删除用户授权
     var val = {
       deleteType: 'BY_USER',
       tenantId: tenantId,
       userIds: [this.data.memberUserInfo.user.id]
     };
     xnService.userOauthdelete(val, function(data) {
       if (data.firstErrorMessage == '') {
         wx.removeStorage({ //清除缓存     去登录
           key: 'passportId',
           success: function(res) {
             wx.redirectTo({
               url: '../login/login',
             });
           }
         })
         wx.clearStorageSync();
         app.imLogin=false;
       } else {
         $.confirm(data.firstErrorMessage)
       }
     })
   },
   Clicklogin: function() {
     wx.redirectTo({
       url: '../login/login',
     })
   },

  // 跳转到芳聊小程序
   toFangLiao: function () {
     wx.navigateToMiniProgram({
       appId: config.fangliaoAppId,      // 要打开的小程序 appId
       path: 'pages/index/index',        // 打开的页面路径
       success(res) {
         // 打开成功
       }
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
     if(app.checkLoginNoJump()){
         this.memberDetailIndexget();
         this.MymemberPoint();
         this.prePaidCardEntity();
         this.myOrderCount("UN_PAID");
         this.myOrderCount("UN_SHIPMENT");
         this.myOrderCount("UN_SIGNED");
         this.myOrderCount("SIGNED");
         this.myOrderCount("EVALUATION");
     }
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
 }
let mapStateToData = (state) => {
  return {
    isLogin: state.isLogin || store.getState().isLogin
  }
}
let connectedPageConfig = connect(mapStateToData)(pageConfig)

Page(connectedPageConfig)