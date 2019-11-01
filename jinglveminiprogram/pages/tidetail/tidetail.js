import {
  requestsend,
  requestsendtoken
} from '../../utils/util.js'
import {
  Config
} from '../../utils/config';
// let requestsends = new requestsend()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['1'],
    tilist: Object,
    isActive: 1,
    tihsi: '',
    tihsi1:'',
    courses: true,
    title: '',
    money: '',
    isCollect: true,
    timutab: [],
    show: false,
    isIos: null,
    showif: true,
    showifs1:true,
    aomid: '',
    nodata: false,
    showl: true,
    isshowc:false,
    coursesortid: 0
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail
    });
  },
  onActive: function(e) {
    var token = wx.getStorageSync("userName")
    // wx.getStorageSync("token")
    var index = e.currentTarget.dataset.tab;
    var id = e.currentTarget.dataset.id; //获取当前点击的元素下标
    // console.log(e.currentTarget);
    this.setData({
      isActive: index,
      showl: true,
      nodata: false,
      tilist: []
    })

    var that = this;
    var param = {
      psortid: id,
      coursesortid: 0,
      classid: Config.classid,
      aomid: that.data.aomid
    }
    var param0 = {
      psortid: id,
      coursesortid: 0,
      aomid: that.data.aomid
    }
    if (token == '') {
      requestsend('api/TiKu/GetPaper', "GET", param, function(e) {
        if (e.data.data.length == 0) {
          that.setData({
            nodata: true,
            showl: false,
            tilist: []
          })
          return;
        } else {
          that.setData({
            showl: false,
            nodata: false
          })
        }
        if (e.data.data[0].title) {
          that.setData({
            courses: true
          })
        } else {
          that.setData({
            courses: false
          })
        }
        that.setData({
          tilist: e.data.data,
          money: e.data.money,
          isCollect: e.data.iscollert
        })
      })
    } else {
      requestsendtoken('api/QX/GetLoginPaper', "GET", param0, function(e) {
        if (e.data.data.length == 0) {
          that.setData({
            nodata: true,
            showl:false,
            tilist: []
          })
          return;
        } else {
          that.setData({
            nodata: false,
            showl: false
          })
        }
        if (e.data.data[0].title) {
          that.setData({
            courses: true
          })
        } else {
          that.setData({
            courses: false
          })
        }
        that.setData({
          tilist: e.data.data,
          money: e.data.money,
          isCollect: e.data.iscollert
        })
        console.log(that.data.isCollect);
      })
    }
  },
  onCollect: function() {
    var token = wx.getStorageSync("userName")
    // wx.getStorageSync("token")
    if (token == '') {
      wx.showToast({
        title: `该微信还未注册精略网校或未绑定精略网校账号，暂不可使用该功能，请尽快注册并登陆！`,
        icon: "none",
        duration: 5000
      })
    } else {
      this.setCollect()
    }

  },
  setCollect: function(e) {
    var param = {
      typeid: 1,
      aomid: this.data.aomid
    }
    var that = this;
    if (that.data.isCollect) {
      requestsendtoken('api/UserCollect/DelUserCollect', "GET", param, function(e) {
        if (e.code == 0) {
          that.setData({
            isCollect: !that.data.isCollect
          })
          wx.showToast({
            title: `` + e.msg,
            icon: "none",
            duration: 2000
          })
        } else {
          wx.showToast({
            title: `` + e.msg,
            icon: "none",
            duration: 2000
          })
        }
      })
    } else {
      requestsendtoken('api/UserCollect/AddUserCollect', "GET", param, function(e) {
        if (e.code == 0) {
          that.setData({
            isCollect: !that.data.isCollect
          })
          wx.showToast({
            title: `` + e.msg,
            icon: "none",
            duration: 2000
          })
        } else {
          wx.showToast({
            title: `` + e.msg,
            icon: "none",
            duration: 2000
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var token = wx.getStorageSync("userName")
    // wx.getStorageSync("token")
    this.setData({
      isIos: app.globalData.isIos,
      aomid: options.aomid,
      coursesortid: 0
    })
    console.log(this.data.isIos)
    console.log(options)
    var aomid = options.aomid
    var coursesortid = 0
    var param = {
      classid: Config.classid,
      aomid: aomid
    }
    var param2 = {
      psortid: 1,
      coursesortid: coursesortid,
      classid: Config.classid,
      aomid: aomid
    }
    var param3 = {
      psortid: 1,
      coursesortid: coursesortid,
      aomid: aomid
    }
    var that = this;
    //未登录
    requestsend('api/TiKu/GetTikuType', "GET", param, function(e) {
      param2.psortid = e.data.timutab[0].id
      param3.psortid = e.data.timutab[0].id
      wx.setNavigationBarTitle({
        title: e.data.title
      })
      that.setData({
        title: e.data.title,
        timutab: e.data.timutab
      })
    })
    if (token == '') {
      requestsend('api/TiKu/GetPaper', "GET", param2, function(e) {
        if (e.data.data.length == 0) {
          that.setData({
            nodata: true,
            showl: false,
            tilist: []
          })
          return;
        } else {
          that.setData({
            showl: false,
            nodata: false
          })
        }
        if (e.data.data[0].title) {
          that.setData({
            courses: true
          })
        } else {
          that.setData({
            courses: false
          })
        }
        that.setData({
          tilist: e.data.data,
          money: e.data.money,
          isCollect: e.data.iscollert
        })
      })
    } else {
      requestsendtoken('api/QX/GetLoginPaper', "GET", param3, function(e) {
        if (e.data.data.length == 0) {
          that.setData({
            nodata: true,
            showl: false,
            tilist: []
          })
          return;
        } else {
          that.setData({
            showl: false,
            nodata: false
          })
        }
        if (e.data.data[0].title) {
          that.setData({
            courses: true
          })
        } else {
          that.setData({
            courses: false
          })
        }
        that.setData({
          tilist: e.data.data,
          money: e.data.money,
          isCollect: e.data.iscollert
        })
      })
    }
  },
  getAddInfo(e) {
    console.log(e)
    if (e.detail.showifs){
      this.setData({
        tihsi1: '您的练习次数已用完。',
        showifs1: false
      })
    }else{
      this.setData({
        tihsi: '您还未购买《' + e.detail.title + '》题库，购买后开启整套题库的使用。',
        money: e.detail.money,
        showif: e.detail.showif
      })
    }
   
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
    var token = wx.getStorageSync("userName")
    var aomid = this.data.aomid
    var coursesortid = 0
    var param = {
      classid: Config.classid,
      aomid: aomid
    }
    var param2 = {
      psortid: this.data.isActive,
      coursesortid: coursesortid,
      classid: Config.classid,
      aomid: aomid
    }
    var param3 = {
      psortid: this.data.isActive,
      coursesortid: coursesortid,
      aomid: aomid
    }
    var that = this;
    //未登录
    requestsend('api/TiKu/GetTikuType', "GET", param, function(e) {
      param2.psortid = e.data.timutab[0].id
      param3.psortid = e.data.timutab[0].id
      wx.setNavigationBarTitle({
        title: e.data.title
      })
      that.setData({
        title: e.data.title,
        timutab: e.data.timutab
      })
    })
    if (token == '') {
      requestsend('api/TiKu/GetPaper', "GET", param2, function(e) {
        if (e.data.data.length == 0) {
          that.setData({
            nodata: true,
            showl: false,
            tilist: []
          })
          return;
        } else {
          that.setData({
            showl: false,
            nodata: false
          })
        }
        if (e.data.data[0].title) {
          that.setData({
            courses: true
          })
        } else {
          that.setData({
            courses: false
          })
        }
        that.setData({
          tilist: e.data.data,
          money: e.data.money,
          isCollect: e.data.iscollert
        })
      })
    } else {
      requestsendtoken('api/QX/GetLoginPaper', "GET", param3, function(e) {
        if (e.data.data.length == 0) {
          that.setData({
            nodata: true,
            showl: false,
            tilist: []
          })
          return;
        } else {
          that.setData({
            showl: false,
            nodata: false
          })
        }
        if (e.data.data[0].title) {
          that.setData({
            courses: true
          })
        } else {
          that.setData({
            courses: false
          })
        }
        that.setData({
          tilist: e.data.data,
          money: e.data.money,
          isCollect: e.data.iscollert
        })
      })
    }
  },
  // getTikuTab() {
  //   tikuModel.getTikutab(data => {
  //     console.log(data)
  //     // this.setData({
  //     //   tikutab: data
  //     // })
  //   })
  // },
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