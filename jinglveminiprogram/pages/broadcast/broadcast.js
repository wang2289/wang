const util = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIos: null,
    currentIndex: 0,
    broadcasttype: 0,
    firstup: false,
    secondup: false,
    firstdisplays: 'none',
    seconddisplays: "none",
    p: 1, //分页请求
    totalpage: null, //总页数
    newsList: [], //数据
    smallclassid: '', //最小分类编号
    seleectsortid: 1, //综合排序1为热度从高到低，2为热度从低到高，3时间从高到低，4时间从低到高，5价格从高到低，6价格从低到高
    rsort: 1, //热度
    tsort: 3, //时间
    msort: 5, //价格
    typename: '实训',
    zhibolist: [], //直播

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id;
    let name = options.name;
    console.log("name");

    if (name == "undefined") {
      name = "实训"
    }
    console.log(name);
    this.setData({
      currentIndex: id,
      typename: name,
      isIos: app.globalData.isIos
    })
    if (name == "公开课") {
      this.tjzhiboload();
    } else {
      this.firstload();
    }

  },
  //推荐公开课
  tjzhiboload: function(e) {
    util.requestsend("api/OrgCourseMoney/GetTjZhiBo", null, {
      pageindex: this.data.p,
    }, res => {
      this.setData({
        zhibolist: res.data.tjzhibo
      })
      console.log(res)
    });

  },
  //往期公开课
  wqzhiboload: function(e) {
    util.requestsend("api/OrgCourseMoney/GetWqZhiBo", null, {
      pageindex: this.data.p,
    }, res => {
      console.log(res)
      this.setData({
        zhibolist: res.data.wqzhibo
      })

    });

  },
  goToWatch: function(e) {
    let id = e.currentTarget.dataset.zhiboid;
    console.log(e.currentTarget.dataset.zhiboid)
    wx.navigateTo({
      url: '../broadcastplay/broadcastplay?id=' + id,

    })
  },
  firstload: function(e) {
    let type = parseInt(this.data.currentIndex) + 1;
    let smalltype = this.data.smallclassid;
    let sort = this.data.seleectsortid;
    if (wx.getStorageSync("userName") != "") {
      util.requestsendtoken("api/QX/GetbyTypeIdLogin", null, {
        type: type,
        pageindex: this.data.p,
        smalltype: smalltype,
        sorttype: sort
      }, this.processData);
    } else {
      util.requestsend("api/OrgCourseMoney/GetbyTypeIdNoLogin", null, {
        type: type,
        pageindex: this.data.p,
        smalltype: smalltype,
        sorttype: sort
      }, this.processData);
    }


  },

  processData: function(res) {
    console.log("获取到的数据：");
    console.log(res.data)
    var that = this
    that.setData({
      // tclist: res.data.orgPackage,
      classifyItems: res.data.cpb,
      newsList: res.data.tj,
      totalpage: res.data.sumpage
    })
    console.log(this.data.newsList)

  },
  bindnavtovider: function(e) {
    console.log(e);
    let aomid = e.currentTarget.dataset.id;
    let isbegin = e.currentTarget.dataset.isbegin
    if (isbegin) {
      wx.navigateTo({
        url: '/pages/coursedetail/coursedetail?aomid=' + aomid,
      })
    } else{
      Toast('还未开课');
    }

  },
  //点击最小分类跳转查询
  bindclickclass: function(e) {
    console.log("获取最小类");
    console.log(e);
    let id = e.currentTarget.dataset.id;
    this.setData({
      smallclassid: id,
      firstup: !this.data.firstup,
      firstdisplays: "none",
      newsList: []
    })
    this.firstload();
  },
  //swiper切换时会调用
  pagechange: function(e) {
    if ("touch" === e.detail.source) {
      console.log(e.detail.currentItemId)

      let currentPageIndex = e.detail.currentItemId

      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用
  titleClick: function(e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      //拿到当前索引并动态改变
      currentIndex: e.currentTarget.dataset.idx,
      p: 1,
      smallclassid: '',
      newsList: [],
      typename: name
    });
    if (name == "公开课") {
      this.tjzhiboload();
    } else {
      this.firstload();
    }

  },
  //综合排序
  bindsort: function(e) {
    let sortid = parseInt(e.currentTarget.dataset.sortid);
    console.log(sortid);
    switch (sortid) {
      case 1:
        this.setData({
          seleectsortid: 2,
          rsort: 2
        })
        break;
      case 2:
        this.setData({
          seleectsortid: 1,
          rsort: 1
        })
        break;
      case 3:
        this.setData({
          seleectsortid: 4,
          tsort: 4
        })
        break;
      case 4:
        this.setData({
          seleectsortid: 3,
          tsort: 3
        })
        break;
      case 5:
        this.setData({
          seleectsortid: 6,
          msort: 6
        })
        break;
      case 6:
        this.setData({
          seleectsortid: 5,
          msort: 5
        })
        break;

      default:

    }
    this.setData({

      secondup: !this.data.secondup,
      seconddisplays: "none",
    })
    this.firstload();
    console.log('综合排序：');
    console.log(this.data.seleectsortid);

  },
  // 区域
  tabNav: function(e) {

    if (e.target.dataset.current == "0") {
      console.log()

      this.setData({
        firstup: !this.data.firstup,
        secondup: false,
      })
      if (this.data.firstup) {
        this.setData({

          firstdisplays: 'block',
          seconddisplays: "none",
        })
      } else {
        this.setData({
          firstdisplays: "none"
        })
      }

    } else {

      this.setData({
        firstup: false,
        secondup: !this.data.secondup
      })
      if (this.data.secondup) {
        this.setData({
          firstdisplays: 'none',
          seconddisplays: "block",



        })
      } else {
        this.setData({
          seconddisplays: "none",
        })
      }

    }
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {


      var showMode = e.target.dataset.current == 0;


      this.setData({
        currentTab: e.target.dataset.current,
        isShow: showMode
      })
    }
  },
  //事件处理函数  
  switchRightTab: function(e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
  //推荐公开课 往期公开课切换
  broadcastclick: function(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      p: 1,
      zhibolist: [],
      broadcasttype: id
    })
    if (id == 0) {
      console.log("推挤直播");
      this.tjzhiboload();
    } else {
      console.log("往期直播");
      this.wqzhiboload();
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
  obtainNews: function() {

    var that = this;
    let type = parseInt(that.data.currentIndex) + 1;
    let sort = that.data.seleectsortid
    let smalltype = that.data.smallclassid;
    if (wx.getStorageSync("userName") != "") {

      util.requestsendtoken("api/QX/GetbyTypeIdLogin?", null, {
        pageindex: that.data.p,
        type: type,
        smalltype: smalltype,
        sorttype: sort
      }, res => {
        var newsArr = that.data.newsList;
        for (var i = 0; i < res.data.tj.length; i++) {
          let getdata = res.data.tj[i];
          newsArr.push(res.data.tj[i])
        }
        that.setData({
          newsList: newsArr,

          totalpage: res.data.sumpage
        })
      });

    } else {
      util.requestsend("api/OrgCourseMoney/GetbyTypeIdNoLogin?", null, {
        pageindex: that.data.p,
        type: type,
        smalltype: smalltype,
        sorttype: sort
      }, res => {

        var newsArr = that.data.newsList;
        for (var i = 0; i < res.data.tj.length; i++) {
          let getdata = res.data.tj[i];
          newsArr.push(res.data.tj[i])
        }
        that.setData({
          newsList: newsArr,
          totalpage: res.data.sumpage
        })


      })

    }
  },
  obtainZhibo: function() {

    var that = this;
    let zhibotype = that.data.broadcasttype;
    if (zhibotype == 0) {
      util.requestsend("api/OrgCourseMoney/GetTjZhiBo?", null, {
        pageindex: that.data.p,

      }, res => {

        var newsArr = that.data.tjzhibo;
        for (var i = 0; i < res.data.tjzhibo.length; i++) {
          let getdata = res.data.tjzhibo[i];
          newsArr.push(res.data.tjzhibo[i])
        }
        that.setData({
          zhibolist: newsArr,
          totalpage: res.data.sumpage
        })


      })

    } else {
      util.requestsend("api/OrgCourseMoney/GetWqZhiBo?", null, {
        pageindex: that.data.p,

      }, res => {

        var newsArr = that.data.wqzhibo;
        for (var i = 0; i < res.data.wqzhibo.length; i++) {
          let getdata = res.data.wqzhibo[i];
          newsArr.push(res.data.wqzhibo[i])
        }
        that.setData({
          zhibolist: newsArr,
          totalpage: res.data.sumpage
        })


      })

    }

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var p = this.data.p;
    console.log("当前页：" + p);
    var totalpage = this.data.totalpage;
    console.log("总数量：" + totalpage);
    p++;
    if (p > totalpage) {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none'
      })
      return;
    }
    this.setData({
      p: p
    })
    let name = this.data.typename;
    if (name == "公开课") {
      this.obtainZhibo();
    } else {
      this.obtainNews()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})