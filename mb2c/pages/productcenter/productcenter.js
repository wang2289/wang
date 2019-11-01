 var app = getApp()
 const xnService = require('../../service/product.js');
 const tenantId = require('../../config').tenantId;
 var $ = require('../../utils/util.js')
 var storeId = require('../../config.js').storeId
 Page({

   /**
    * 页面的初始数据
    */
   data: {
     fid: 0,
     tapindex: 0,
     productInfo: [], //获取商品的类别
     sort: 1,
     categoryId: [],
     categoryID: "",
     screen: false,
     currentItemId: 0,
     information: [], //商品信息
     comparisonshow: false,
     contrastid: 0, //商品id
     contrastids: [], // 记录已经加入对比的商品ID
     operatingUnitId: app.globalData.operatingUnitId, //经营单元id
     Contrasttoshow: [], //对比信息展示
     ComitemId: [], //获取商品的itemid
     sortColumn: "", //枚举
     flag: false,
     categoryAttributesList: [], //商品属性
     flags: false, //分页
     pagenumber: 1,
     pagenumberone: 0,
     pagesize: 10,
     IsCheck: -1,
     subscript: -1,
     PinIndex: -1,
     Mindex: -1,
     subscriptID: [],
     PincarID: [],
     MinCarID: [],
     subscriptflag: false,
     Pincarflag: false,
     MinCarflag: false,
     showPriceSort: true,
     saleQuantitySort: true,
     evaluationQuantitySort: true,
     shelvesTimeSort: true,
     Indeflag: false,
     keyword: '',
     specId: '',
     pagescroll: -1,
     sortTypeValue: '',
     categoryAttributeAndValuesListone: [],
     Infoflag: true,
     comparedActive:false,
     clazzType:null
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function(option) {
     if (option.clazzType =='CURRICULUM'){
       this.setData({
         clazzType: option.clazzType
       })
     }
     if(!app.checkLoginNoJump()){
         this.settingNonPassport();
     } else {
         var val = {
             tenantId: tenantId,
             type: 'STANDARD'
         };
         var that = this;
         xnService.allCategoryShow(val, function(data) { //页面初始化
             if (data.result != "") {
                 that.setData({
                     productInfo: data.result,
                     categoryID: data.result[0].id
                 });
                that.GetThePositionVerticalMapProductPage();
                that.categorySearhConditio();
             }
         })
     }

   },
   Close: function() {
     this.setData({
       comparisonshow: false,
       screen: false,
       flag: false
     })
   },
   categorySearhConditio: function() { // 销量 价格 ....获取类别
     var val = {
       //categoryId: this.data.categoryID,
       tenantId: tenantId,
       language: 'ZH_CN'
     }
     if (this.data.categoryID != '') {
       val.categoryId = this.data.categoryID
     }
     console.log(val)
     var that = this;
     xnService.categorySearhCondition(val, function(data) {
       console.log("销量", data)
       for (var x in data.categoryAttributesList) {
         for (var j in data.categoryAttributesList[x].attributeValueList) {
           data.categoryAttributesList[x].attributeValueList[j].isShow = false
         }
       }
       for (var x in data.brandsList) {
         data.brandsList[x].isShow = false
       }
       that.setData({
         categoryAttributesList: data.categoryAttributesList,
         brandsList: data.brandsList,
         categoryPriceList: data.categoryPriceList
       })
       console.log('----', that.data.categoryAttributesList, '----', that.data.brandsList)
     })
   },
   allOrders: function() { //综合
     this.setData({
       tapindex: 1,
       sort: 0,
       flag: true,
       pagenumber: 1,
       pagenumberone: 0,
       pagesize: 10,
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     });
   },
   allOrdersa: function() { //综合
     this.setData({
       tapindex: 0,
       sort: 0,
       flag: false,
       pagenumber: 1,
       pagenumberone: 0,
       pagesize: 10,
       //   information:[]
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     });
   },
   toBePaid: function() { //销量
     this.setData({
       tapindex: 2,
       sort: 0,
       sortColumn: 'SALE_QUANTITY',
       flag: false,
       pagenumber: 1,
       pagenumberone: 0,
       pagesize: 10,
       information: [],
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     });
     this.GetThePositioSort();
   },
   receiptOfGoods: function() { //筛选
     this.setData({
       tapindex: 4,
       sort: 0,
       screen: true,
       flag: false,
       pagenumber: 1,
       pagenumberone: 0,
       pagesize: 10,
       information: [],
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     });
   },
   toBeEvaluated: function() { //价格
     this.setData({
       tapindex: 3,
       sort: 1,
       sortColumn: 'SHOW_PRICE',
       flag: false,
       pagenumber: 1,
       pagesize: 10,
       pagenumberone: 0,
       information: [],
       sortTypeValue: 'DESC',
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     });
     console.log(this.data.sortTypeValue)
     this.GetThePositioSort();
   },
   toBeEvaluatedone: function() {
     this.setData({
       tapindex: 3,
       sort: 0,
       sortColumn: 'SHOW_PRICE',
       pagenumber: 1,
       pagenumberone: 0,
       pagesize: 10,
       information: [],
       sortTypeValue: 'ASC',
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     });
     console.log(this.data.sortTypeValue)
     this.GetThePositioSort();
   },
   molistposen: function() { //人气
     this.setData({
       sortColumn: 'EVALUATION_QUANTITY',
       flag: false,
       pagenumber: 1,
       pagesize: 10,
       pagenumberone: 0,
       information: [],
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     })
     this.GetThePositioSort();
   },
   molisttime: function() { //上架时间
     this.setData({
       sortColumn: 'SHELVES_TIME',
       flag: false,
       pagenumber: 1,
       pagesize: 10,
       pagenumberone: 0,
       information: [],
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: []
     })
     this.GetThePositioSort();
   },
   GetThePositionVerticalMapProductPage: function() { //初始化拉取类别商品信息
     this.setData({
       categoryAttributeAndValuesListone: []
     })
     var val = {
       operatingUnitId: this.data.operatingUnitId,
       systemType: "B2C",
       deviceType: "MOBILE",
       pageNumber: 1,
       pageSize: this.data.pagesize,
       tenantId: tenantId,
       clazzType:this.data.clazzType

     }
     if (app.globalData.memberId != '') {
       val.memberId = app.globalData.memberId
     }
     if (this.data.categoryID != '') {
       val.categoryIds = [this.data.categoryID]
     }
     if (this.data.MinCarflag) {
       for (var x in this.data.categoryPriceList) {
         if (this.data.categoryPriceList[x].id == this.data.specId) {
           val.priceRangeList = [this.data.categoryPriceList[x]]
         }
       }
     }

     if (this.data.Pincarflag) {
       val.brandIdList = this.data.PincarID
     }
     if (this.data.subscriptflag) {
       for (var x in this.data.categoryAttributesList) {
         for (var j in this.data.categoryAttributesList[x].attributeValueList) {
           for (var s in this.data.subscriptID) {
             if (this.data.categoryAttributesList[x].attributeValueList[j].id == this.data.subscriptID[s]) {
               var categoryAttributeAndValuesList = {
                 attributeId: parseInt(this.data.categoryAttributesList[x].attributeValueList[j].attributeId),
                 attributeValueNameList: [this.data.categoryAttributesList[x].attributeValueList[j].name]
               }
               this.data.categoryAttributeAndValuesListone.push(categoryAttributeAndValuesList)
             }
           }
         }
       }
       val.categoryAttributeAndValuesList = this.data.categoryAttributeAndValuesListone
     }
     console.log(val)
     var that = this;
     $.loading()
     xnService.findCommodityExtend(val, function(data) {
       console.log("123565", data)
       that.setData({
         subscriptflag: false,
         Pincarflag: false,
         MinCarflag: false,
         Mindex: -1,
       })
       if (data.firstErrorMessage == "") {
         $.hideloading()
         if (data.result.length >= 10) {
           that.setData({
             information: that.data.information.concat(data.result),
             screen: false,
             flags: true,
             subscriptflag: false,
             Pincarflag: false,
             MinCarflag: false,
             Mindex:-1,
             subscript: -1,
             PinIndex: -1,
             Mindex: -1,
             pagescroll: 0,
             pagenumber: parseInt(that.data.pagenumber) + 1,
             Infoflag: true
           })
         } else {
           if (data.result.length > 0) {
             that.setData({
               information: that.data.information.concat(data.result),
               // categoryId: [],
               screen: false,
               flags: false,
               subscriptflag: false,
               Pincarflag: false,
               MinCarflag: false,
               Mindex: -1,
               subscript: -1,
               PinIndex: -1,
               Mindex: -1,
               pagescroll: -1,
               Infoflag:true
             })
           } else {
             that.setData({
               Infoflag: false
             })
           }
         }
         that.categorySearhConditio() //  综合销量排序
       }
     })
   },
   /**
    * 排序数据
    */
   GetThePositioSort: function() {
     if (this.data.pagenumberone == this.data.pagenumber) {
       return;
     }
     this.setData({
       pagescroll: 1,
       pagenumberone: this.data.pagenumber
     })
     var sortField = this.data.sortColumn;
     var saleQuantitySort = this.data.saleQuantitySort;
     var showPriceSort = this.data.showPriceSort;
     var evaluationQuantitySort = this.data.evaluationQuantitySort;
     var shelvesTimeSort = this.data.shelvesTimeSort;
     var sortType = 'DESC';
     if (sortField === 'SALE_QUANTITY') {
       sortType = 'DESC';
       this.setData({
         saleQuantitySort: !saleQuantitySort
       });
     } else if (sortField === 'SHOW_PRICE') {
       sortType = this.data.sortTypeValue,
         this.setData({

           showPriceSort: !showPriceSort
         });
     } else if (sortField === 'EVALUATION_QUANTITY') {
       sortType = 'DESC';
       this.setData({
         evaluationQuantitySort: !evaluationQuantitySort
       });
     } else if (sortField === 'SHELVES_TIME') {
       sortType = 'DESC';
       this.setData({
         shelvesTimeSort: !shelvesTimeSort
       });
     } else {
       sortType = 'ASC';

       if (sortField === 'SALE_QUANTITY') {
         this.setData({
           saleQuantitySort: !saleQuantitySort
         });
       } else if (sortField === 'SHOW_PRICE') {
         this.setData({
           showPriceSort: !showPriceSort
         });
       } else if (sortField === 'EVALUATION_QUANTITY') {
         this.setData({
           evaluationQuantitySort: !evaluationQuantitySort
         });
       } else if (sortField === 'SHELVES_TIME') {
         this.setData({
           shelvesTimeSort: !shelvesTimeSort
         });
       }
     }
     var val = {
       operatingUnitId: this.data.operatingUnitId,
       systemType: "B2C",
       deviceType: "MOBILE",
       // categoryIds: [this.data.categoryID],
       pageNumber: this.data.pagenumber,
       pageSize: this.data.pagesize,
       tenantId: tenantId,
       sortColumn: sortField,
       sortType: sortType
     }
     console.log(val)
     if (this.data.categoryID != '') {
       val.categoryIds = [this.data.categoryID]
     }
     var that = this;
     xnService.findCommodityExtend(val, function(data) {
       console.log(data);
       if (that.data.information.length <= parseInt(data.totalCount)) {
         if (data.result.length >= 10) {
           that.setData({
             information: that.data.information.concat(data.result),
             flags: true,
             pagescroll: 0,
             pagenumber: parseInt(that.data.pagenumber) + 1,
             //  pagenumberone: parseInt(that.data.pagenumber) + 1,
           })
         } else {
           that.setData({
             information: that.data.information.concat(data.result),
             flags: false,
             pagescroll: 1
           })
           // wx.showToast({
           //   title: '没有更多啦',
           // })
         }
       } else {
         that.setData({
           information: that.data.information.concat(data.result),
           flags: false,
           pagescroll: 1
         })
       }
     })
   },
   /**
    * 分页功能
    */
   GetThePositio: function() {
     if (this.data.pagenumberone == this.data.pagenumber) {
       return;
     }
     this.setData({
       pagescroll: 1,
       pagenumberone: this.data.pagenumber
     })
     var val = {
       operatingUnitId: this.data.operatingUnitId,
       systemType: "B2C",
       deviceType: "MOBILE",
       //  categoryIds: [this.data.categoryID],
       pageNumber: this.data.pagenumber,
       pageSize: this.data.pagesize,
       tenantId: tenantId,
       // sortColumn: this.data.sortColumn,
       sortType: 'DESC'
     }
     if (app.globalData.memberId != '') {
       val.memberId = app.globalData.memberId
     }
     if (this.data.sortColumn != '') {
       val.sortColumn = this.data.sortColumn
     }
     if (this.data.categoryID != '') {
       val.categoryIds = [this.data.categoryID]
     }
     if (this.data.MinCarflag) {
       for (var x in this.data.categoryPriceList) {
         if (this.data.categoryPriceList[x].id == this.data.specId) {
           val.priceRangeList = [this.data.categoryPriceList[x]]
         }
       }
     }
     if (this.data.Pincarflag) {
       val.brandIdList = this.data.PincarID
     }
     if (this.data.subscriptflag) {
       for (var x in this.data.categoryAttributesList) {
         for (var j in this.data.categoryAttributesList[x].attributeValueList) {
           for (var s in this.data.subscriptID) {
             if (this.data.categoryAttributesList[x].attributeValueList[j].id == this.data.subscriptID[s]) {
               var categoryAttributeAndValuesList = {
                 attributeId: parseInt(this.data.categoryAttributesList[x].attributeValueList[j].attributeId),
                 attributeValueNameList: [this.data.categoryAttributesList[x].attributeValueList[j].name]
               }
               this.data.categoryAttributeAndValuesListone.push(categoryAttributeAndValuesList)
             }
           }
         }
       }
       val.categoryAttributeAndValuesList = this.data.categoryAttributeAndValuesListone
     }
     console.log(val)
     var that = this;
     xnService.findCommodityExtend(val, function(data) {
       console.log(data)
       console.log(that.data.information.length)
       if (data.firstErrorMessage == '') {
         if (that.data.information.length <= parseInt(data.totalCount)) {
           if (data.result.length < 10) {
             that.setData({
               information: that.data.information.concat(data.result),
               flags: false,
               pagescroll: 1
             })
             // wx.showToast({
             //   title: '没有更多啦',
             // })
           } else {
             that.setData({
               information: that.data.information.concat(data.result),
               flags: true,
               pagescroll: 0,
               pagenumber: parseInt(that.data.pagenumber) + 1,
               //  pagenumberone: parseInt(that.data.pagenumber) + 1
             })
           }
         } else {
           that.setData({
             flags: false,
             pagescroll: 1
           })
         }
       }
     })
   },
   ckCategoryitem: function(e) { //点击获取类别商品类别的商品信息
     console.log(e)
     this.setData({
       fid: e.currentTarget.dataset.prduindex,
       information: [],
       categoryID: e.currentTarget.dataset.id,
       tapindex: 0,
       pagenumber: 1,
       pagesize: 10,
       pagenumberone: 0,
       flag: false,
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: [],
       keyword: ''
     })
     // this.data.categoryId.push(e.currentTarget.dataset.id)
     this.GetThePositionVerticalMapProductPage()
   },
   //关闭模态框
   replacement: function() {

     for (var x in this.data.categoryAttributesList) {
       for (var j in this.data.categoryAttributesList[x].attributeValueList) {
         this.data.categoryAttributesList[x].attributeValueList[j].isShow = false
       }
     }
     for (var x in this.data.brandsList) {
       this.data.brandsList[x].isShow = false
     }
     for (var x in this.data.categoryPriceList) {
       this.data.categoryPriceList[x].isShow = false
     }

     this.setData({
       subscriptflag:false,
       subscriptID: [],
       categoryAttributesList: this.data.categoryAttributesList,
       brandsList: this.data.brandsList,
       Mindex: -1,
       MinCarID: [],
       MinCarflag: false,
       specId: '',
     })

    //  this.setData({
    //    screen: false,
    //    // categoryId: [],
    //    subscriptflag: false,
    //    Pincarflag: false,
    //    MinCarflag: false,
    //    subscript: -1,
    //    PinIndex: -1,
    //    Mindex: -1,
    //    MinCarflag: false,
    //    Pincarflag: false,
    //    subscriptflag: false,
    //    PincarID: [],
    //    subscriptID: []
    //  })
   },
   //点击显示购物车
   gowuclick: function(e) {
     console.log(e.currentTarget.dataset.id)
     this.setData({
       currentItemId: e.currentTarget.dataset.id,
       Indeflag: true,
       flag: false
     })

   },
   // 点击显示商品详情
   prouclick: function(e) {
     this.setData({
       flag: false
     })
     wx.navigateTo({
       url: '../productdetail/productdetail?currentItemId=' + e.currentTarget.dataset.id + '&clazzType=' + e.currentTarget.dataset.clazztype,
     })
   },
   contrast: function(even) { //加入对比
     if (this.data.Contrasttoshow.length >= 4) {
       $.confirm('对比商品数量已上限')
       return;
     }
     console.log(even)
     var contrastids = this.data.contrastids;
     this.setData({
       contrastid: even.currentTarget.dataset.id,
       currentItemId: "",
       contrastids: [even.currentTarget.dataset.id]
     })
     var val = {
       operatingUnitId: this.data.operatingUnitId,
       systemType: "B2C",
       deviceType: "MOBILE",
       commodityId: this.data.contrastid,
       tenantId: tenantId
     }
     console.log(val)
     var that = this;
     xnService.commodityDefaultItemNew(val, function(data) {
       console.log(data)
       if (data.firstErrorMessage == "") {
         for (var i in that.data.information) {
           console.log(that.data.information[i].id)
           if (that.data.contrastid == that.data.information[i].id) {
             
             if (that.data.Contrasttoshow.length >= 1) {
               if (that.data.Contrasttoshow[0].clazzId != that.data.information[i].clazzId) {
                 $.confirm('只能对比相同类目商品');
                 return
               }
             }
             // todo 判断是否已添加过
             
            //  if (that.data.Contrasttoshow.length == 2) {
            //    if (that.data.Contrasttoshow[0].id == that.data.Contrasttoshow[1].id) {
            //      $.confirm('加入对比成功');
            //      that.data.Contrasttoshow.splice(1, 1)
            //      return
            //    }
            //  }
             var cId = [];
             console.log(that.data.Contrasttoshow)
             for (var j = 0; j < that.data.Contrasttoshow.length; j++) {
               if (that.data.Contrasttoshow[j].id == that.data.information[i].id){
                 $.confirm('已添加过相同商品');
                 return
               }
             }

             that.data.Contrasttoshow.push(that.data.information[i]);
             $.confirm('加入对比成功');

            
             for (var j = 0; j < that.data.Contrasttoshow.length; j++) {
               if (that.data.Contrasttoshow[j].itemId != undefined || that.data.Contrasttoshow[j].itemId != null) {
                 cId.push(that.data.Contrasttoshow[j].itemId);
                 //  wx.showToast({
                 //    title: "添加成功"
                 //  });
               }

             }

             that.setData({
               ComitemId: cId
             });
             console.log(that.data.ComitemId);
           }
         }
       } else {
         wx.showToast({
           title: "添加失败",
           image: '../../img/warn.png'
         })
       }
     })
   },
   inArray: function(arr, value) {
     for (var i = 0; i < arr.length; i++) {
       if (value === arr[i]) {
         return true;
       }
     }
     return false;
   },
   Cloak: function() {
     this.setData({
       currentItemId: "",
     })
   },
   comparison: function() {
     if (this.data.Contrasttoshow.length == 0) {
       $.confirm('您还没有选择对比商品')
       this.setData({
         flag: false
       })
       return;
    
     }else {
       this.setData({
         comparisonshow: true,
         Contrasttoshow: this.data.Contrasttoshow,
         flag: false
       })
     }
   },
   replacementcontrast: function(e) {
     this.setData({
       comparisonshow: false,
       Contrasttoshow: [],
       contrastids: [],
       attributeValueList: [],
       ComitemId: [],
     })
   },
   contrastcart: function(e) { //加入购物车
     this.setData({
       contrastid: e.currentTarget.dataset.id,
       currentItemId: ""
     })
     var val = {
       commodityId: this.data.contrastid,
       storeId: storeId,
       operatingUnitId: this.data.operatingUnitId,
       systemType: "B2C",
       deviceType: "MOBILE",
       memberId: app.globalData.memberId
     }
     console.log(val)
     xnService.cartBySingleCommodity(val, function(data) {
       console.log(data)
       if (data.firstErrorMessage == "") {
         wx.showToast({
           title: "添加成功"
         });
       } else {
         $.confirm(data.firstErrorMessage)
       }
     })
   },
   ensure: function() { //点击确定跳转商品对比页
    if (this.data.Contrasttoshow.length<2){
       $.confirm('请选择至少两个商品');
       return;
    }

     var model = JSON.stringify(this.data.ComitemId);
     wx.navigateTo({
       url: '../Comparison/Comparison?ComitemId=' + model + '&operatingUnitId=' + this.data.operatingUnitId,
     })
     this.setData({
       tapindex: 1,
      //  ComitemId: [],
       comparisonshow: false,
      //  Contrasttoshow: []
     })
   },
   scrollbottom: function() { //滚动到底部进行分页
     console.log("112515")
     console.log(this.data.flags, this.data.pagescroll)
     if (this.data.flags && this.data.pagescroll == 0) { //判断是否可以分页
       var thisobj = this;
       clearTimeout(time);
       var time = setTimeout(function() { //延迟处理处理，防止多次快速滑动
         if ((thisobj.data.tapindex == 1 || thisobj.data.tapindex == 2 || thisobj.data.tapindex == 3) && thisobj.data.keyword == '') {
           thisobj.GetThePositioSort()
         } else if (thisobj.data.keyword != '' || (thisobj.data.tapindex == 1 || thisobj.data.tapindex == 2 || thisobj.data.tapindex == 3)) {
           thisobj.search()
         } else {
           thisobj.GetThePositio();
         }
       }, 500);
     } else {
       // wx.showToast({
       //   title: '没有更多啦',
       // })
     }
   },
   ckitem: function(e) {
     console.log(e)
     for (var i = 0; i < this.data.Contrasttoshow.length; i++) {
       console.log(this.data.Contrasttoshow[i])
       if (this.data.Contrasttoshow[i].id == e.currentTarget.dataset.id) {
         this.data.Contrasttoshow.splice(i, 1)
         this.setData({
           Contrasttoshow: this.data.Contrasttoshow
         })
        //  return true;
       }
     }
     for (var i = 0; i < this.data.ComitemId.length; i++) {
       if (this.data.ComitemId[i] == e.currentTarget.dataset.itemid) {
         this.data.ComitemId.splice(i, 1);
         this.setData({
           ComitemId: this.data.ComitemId
         })

       }
     }
     console.log(this.data.ComitemId)
   },
   Clickonthescreen: function(e) { // 风格
     console.log(e)
     this.setData({
       subscriptID: []
     })
     // this.setData({
     //   subscript: e.currentTarget.dataset.index,
     //   subscriptID: e.currentTarget.dataset.categoryid,
     //   subscriptflag: true,
     // })
     for (var x in this.data.categoryAttributesList) {
       for (var j in this.data.categoryAttributesList[x].attributeValueList) {
         if (this.data.categoryAttributesList[x].attributeValueList[j].name == e.currentTarget.dataset.name) {
           this.data.categoryAttributesList[x].attributeValueList[j].isShow = true;
         }
       }
     }

     for (var x in this.data.categoryAttributesList) {
       for (var j in this.data.categoryAttributesList[x].attributeValueList) {
         if (this.data.categoryAttributesList[x].attributeValueList[j].isShow == true) {
           this.data.subscriptID.push(this.data.categoryAttributesList[x].attributeValueList[j].id)
           this.setData({
             subscriptflag: true
           })
         }
       }
     }
     console.log(this.data.subscriptID)
     this.setData({
       categoryAttributesList: this.data.categoryAttributesList,
     })
   },
   Clickonthescreenexit: function(e) { //取消风格
     this.setData({
       subscriptID: []
     })
     for (var x in this.data.categoryAttributesList) {
       for (var j in this.data.categoryAttributesList[x].attributeValueList) {
         if (this.data.categoryAttributesList[x].attributeValueList[j].name == e.currentTarget.dataset.name) {
           this.data.categoryAttributesList[x].attributeValueList[j].isShow = false
         }
       }
     }
     this.setData({
       categoryAttributesList: this.data.categoryAttributesList,
     })

     for (var x in this.data.categoryAttributesList) {
       for (var j in this.data.categoryAttributesList[x].attributeValueList) {
         if (this.data.categoryAttributesList[x].attributeValueList[j].isShow == true) {
           this.data.subscriptID.push(this.data.categoryAttributesList[x].attributeValueList[j].id)
           this.setData({
             subscriptflag: true
           })
         }
       }
     }

   },

   ClickonthescreenPinexit: function(e) { //取消品牌
     this.setData({
       PincarID: [],
     })
     for (var x in this.data.brandsList) {
       if (x == e.currentTarget.dataset.index) {
         this.data.brandsList[x].isShow = false;
       }
     }
     this.setData({
       brandsList: this.data.brandsList
     })
     for (var x in this.data.brandsList) {
       if (this.data.brandsList[x].isShow == true) {
         this.data.PincarID.push(this.data.brandsList[x].brandId)
         this.setData({
           Pincarflag: true,
         })
       }
     }
   },
   ClickonthescreenPin: function(e) { //品牌
     console.log(e)
     this.setData({
       PincarID: [],
     })
     for (var x in this.data.brandsList) {
       if (x == e.currentTarget.dataset.index) {
         this.data.brandsList[x].isShow = true;
       }
     }
     for (var x in this.data.brandsList) {
       if (this.data.brandsList[x].isShow == true) {
         this.data.PincarID.push(this.data.brandsList[x].brandId)
         this.setData({
           Pincarflag: true,
         })
       }
     }
     console.log(this.data.PincarID)
     this.setData({
       brandsList: this.data.brandsList
     })
   },
   
   ClickonthescreenMany: function(e) { //价钱
     console.log(e)
     this.setData({
       Mindex: e.currentTarget.dataset.index,
       MinCarID: e.currentTarget.dataset.categoryid,
       MinCarflag: true,
       specId: e.currentTarget.dataset.specid
     })
   },
   ClickSuccess: function() {
     this.setData({
       information: []
     })

     this.GetThePositionVerticalMapProductPage()
   },
   startinput: function(e) {
     this.setData({
       keyword: e.detail.value
     })
   },
   search: function() { //搜索
     if (this.data.pagenumberone == this.data.pagenumber) {
       return;
     }
     this.setData({
       flag: false,
       MinCarflag: false,
       Pincarflag: false,
       subscriptflag: false,
       PincarID: [],
       subscriptID: [],
       pagescroll: 1,
       pagenumberone: this.data.pagenumbe
     })
     var val = {
       operatingUnitId: this.data.operatingUnitId,
       systemType: "B2C",
       deviceType: "MOBILE",
       // categoryIds: [this.data.categoryID],
       pageNumber: this.data.pagenumber,
       pageSize: this.data.pagesize,
       tenantId: tenantId,
       keyword: this.data.keyword
     }
     console.log(val)
     var that = this;
     xnService.findCommodityExtend(val, function(data) {
       console.log(data);
       if (data.result != "") {
         if (that.data.information.length <= parseInt(data.totalCount)) {
           if (data.result.length < 10) {
             that.setData({
               information: that.data.information.concat(data.result),
               flags: false,
               pagescroll: 1
             })
             // wx.showToast({
             //   title: '没有更多啦',
             // })
           } else {
             that.setData({
               information: that.data.information.concat(data.result),
               flags: true,
               pagescroll: 0,
               pagenumber: parseInt(that.data.pagenumber) + 1,
               //   pagenumberone: parseInt(that.data.pagenumber) + 1,
             })
           }
         } else {
           that.setData({
             flags: false,
             pagescroll: 1
           })
         }
       } else {
         $.alert('未搜索到商品');
       }
     })
   },
   filter: function(e) { //点击筛选事件
     var animation = wx.createAnimation({ //创建动画
       duration: 1000,
       timingFunction: 'ease',
       width: 300,
       height: 800,
       top: 0,
       bottom: 0,
       right: 0,
       backgroundColor: '#fff',
       opcity: 0.5
     })

     this.animation = animation

     animation.translateX(-100 + 'vh').step() //动画效果向右滑动100vh

     this.setData({
       animationData: animation.export(),
       show: true
     })
   },
   screenproduct: function() {
     var animation = wx.createAnimation({ //创建动画
       duration: 1000,
       timingFunction: 'ease',
       width: 300,
       height: 800,
       top: 0,
       bottom: 0,
       right: 0,
       backgroundColor: '#fff',
       opcity: 0.5
     })

     this.animation = animation

     animation.translateX(+100 + 'vh').step() //动画效果向右滑动100vh

     this.setData({
       animationData: animation.export(),
       show: false
     })
   },
   settingNonPassport: function() { //未登录状态下 获取经营单元id
     var val = {
       systemType: "B2C",
       deviceType: "MOBILE",
       tenantId: tenantId,
     }
     var that = this;
     xnService.settingNonPassport(val, function(data) {
       console.log(data)
       if (data.firstErrorMessage == '') {
         that.setData({
           operatingUnitId: data.systemSite.operatingUnitId,
         })
         var vas = {
           tenantId: tenantId,
           type: 'STANDARD'
         }
         xnService.allCategoryShow(vas, function(data) { //页面初始化 
           console.log(data)
           if (data.result != "") {
             that.setData({
               productInfo: data.result,
               categoryID: data.result[0].id
             })
             that.GetThePositionVerticalMapProductPage()
             that.categorySearhConditio()
           }
         })

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
     var that = this;
     wx.getStorage({
       key: 'orderNum',
       success: function(res) {
         console.log(res)
         that.setData({
           keyword: res.data,
           information: [],
           pagenumber: 1
         })
         that.search();
         wx.removeStorage({
           key: 'orderNum',
           success: function(res) {
             console.log(res)
           }
         })
       },
       fail: function(res) {
         console.log(res);
         that.setData({
           keyword: ''
         })
       }
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

   }
 })