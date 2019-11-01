// pages/Dataaddress/Dataaddress.js
var app = getApp();
const xmService = require('../../service/security.js');
const xnServiceapi = require('../../service/personalcenter.js');
const api = require('../../service/product.js');
const config = require('../../config.js');
var $ = require('../../utils/util.js')
var storeId = require('../../config.js').storeId
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['女', '男'],
    UserInfo: [], //用户信息
    dates: "",
    isShowJiedDao: false,
    value: "",
    sexInfo: "",
    sourceNickName: '',
    name: '',
    birthYear: '',
    birthMonth: '',
    birthDate: '',
    sex: '',
    thename: '',
    year: '',
    month: '',
    day: '',
    member: [], //用户信息
    UserName: "", //姓名
    tempFilePath: "",
    memberUserInfo: "",
    operatingUnitId: app.globalData.operatingUnitId,
    OldTime: "",
    nickName: ""
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.savePersonaldata()

    var that = this;
    that.savePersonaldata()
    that.memberDetailIndexget()
    var date = new Date();
    var year = date.getFullYear() // 年
    var month = date.getMonth() + 1; // 月
    var day = date.getDate(); // 日
    this.setData({
      OldTime: year + '-' + month + '-' + day
    })
    console.log(that.data.OldTime)
  },
  bindPickerChange: function(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    if (e.detail.value == 0) {
      this.setData({
        sexInfo: '女'
      })
    } else {
      this.setData({
        sexInfo: '男'
      })
    }

  },
  bindDateChanges: function(e) {
    console.log(e.detail.value)
    this.setData({
      dates: e.detail.value
    })
    this.birthYear()
  },
  closeadj: function() { //关闭地址
    this.setData({
      isShowJiedDao: false
    });
  },
  bindChangej: function(e) {
    //console.log(e.detail.value[0])
    if (e.detail.value[0] == 0) {
      this.setData({
        sexInfo: '女'
      })
    } else {
      this.setData({
        sexInfo: '男'
      })
    }
  },

  bindsex: function() {
    this.setData({
      isShowJiedDao: true
    });
  },
  birthYear: function(e) {
    var s, year, month, day; // 声明变量。
    var s = this.data.dates;
    year = s.substr(0, 4);
    month = s.substr(5, 2);
    day = s.substr(8, 2);
    this.setData({
      year: year,
      month: month,
      day: day,
    })
  },
  getPersonaldata: function(e) { //更新会员信息
    if (this.data.sexInfo == '女') {
      this.setData({
        sex: 'FEMALE'
      })
    } else {
      this.setData({
        sex: 'MALE'
      })
    }
    var val = {
      id: app.globalData.memberId,
      rowVersion: this.data.member.rowVersion,
      sourceNickName: this.data.UserInfo.Name,
      name: this.data.thename,
      birthYear: this.data.year,
      birthMonth: this.data.month,
      birthDate: this.data.day,
      sex: this.data.sex,
      sourceNickName: this.data.nickName,
      isStrict: true
    }
    //console.log(val)
    var that = this;
    xmService.memberShipdata(val, function(res) {
      if (res.firstErrorMessage == "") {
        wx.showToast({
          title: '更新成功',
          duration: 3000,
        })
        setTimeout(function() {
          wx.switchTab({
            url: '../UserCenter/UserCenter',
          });
        }, 1500)
      }
    })
  },
  Name: function(e) {
    //console.log(e)
    this.setData({
      thename: e.detail.value,
    })
  },
  savePersonaldata: function(e) {
    var val = {
      id: app.globalData.memberId,
    }
    //console.log(val)
    var that = this;
    xmService.memberShipget(val, function(res) {
      console.log(res)
      that.data.thename = res.member.name;
      that.setData({
        member: res.member,
        dates: res.member.birthYear ? res.member.birthYear + '-' + res.member.birthMonth + '-' + res.member.birthDate :'',
        UserName: res.member.name,
        nickName: res.member.sourceNickName
      })
      //console.log(that.data.dates)
      if (res.member.sex) {
        if (res.member.sex == "MALE") {
          that.setData({
            sexInfo: '男',
          })
        } else {
          that.setData({
            sexInfo: '女',
          })
        }
      }
    })
  },
  uploadpictures: function() {
    var that = this;
    var passportId = wx.getStorageSync('passportId');
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      success: function(res) {
        //console.log(res)
        that.setData({
          tempFilePath: res.tempFilePaths[0]
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempFiles = res.tempFilePaths[0].length; //总长度
        var fileName = res.tempFilePaths[0].lastIndexOf("."); //取到文件名开始到最后一个点的长度
        var suffix = res.tempFilePaths[0].substring(fileName + 1, tempFiles); //截取
        //console.log(suffix)
        wx.uploadFile({
          url: config.uploadFileone + '?passportId=' + passportId,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            "Content-Type": 'application/x-www-form-urlencoded'
          },
          formData: {
            'ext': suffix, //文件后缀
            'name': tempFilePaths[0], //文件名称
            'type': "AVATAR" //写死的值
          },
          success: function(res) {
            //console.log(res)
            if (res.errMsg == 'uploadFile:ok') {
              var SuccessInfo = JSON.parse(res.data)
              var val = {
                avatarId: SuccessInfo.id, //data为5.2.1接口返回数据
                userId: app.globalData.userId, //用户ID
                id: app.globalData.userId
              }
              //console.log(val)
              xmService.avatarupdate(val, function(data) {
                //console.log(data)
                if (data.firstErrorMessage == "" && data.result == '1') {
                  $.confirm('修改成功')
                  that.memberDetailIndexget()
                }
              })
            }
          }
        })
      }
    })
  },
  memberDetailIndexget: function() {
    var val = {
      operatingUnitId: this.data.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      storeId: storeId
    }
    var that = this;
    xnServiceapi.memberDetailIndexget(val, function(data) {
      if (data.firstErrorMessage == "") {
        that.setData({
          memberUserInfo: data,
        })
      }
    })
  },
  NicknameInfo: function(e) { //用户昵称
    this.setData({
      nickName: e.detail.value,
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

  }
})