// pages/Comparison/Comparison.js
var app = getApp();

const xnService = require('../../service/product.js');
const tenantId = require('../../config').tenantId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operatingUnitId: app.globalData.operatingUnitId,
    itemIdList: [],
    Comparetheinformation: [], //获取对比信息
    attributeValueList: [], //比对分类数组
    compare: '暂无数据',
    commentnum: '', //后端给的分数,显示相应的星星
    countstar: '', //无数据时显示相应的星星
    commentnumone: 0,
    commentnumtwo: 5,
    countstarone: 0,
    countstartwo: 5,
    commentnumListone:0,
    commentnumListtwo:5,
    countstarListone: 0,
    countstarListtwo: 5,
    widthInght:"",
    flagthree:false,
    flagfive:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var ban = JSON.parse(options.ComitemId);
    var that = this;
    var val = {
      operatingUnitId: that.data.operatingUnitId || options.operatingUnitId,
      systemType: "B2C",
      deviceType: "MOBILE",
      itemIdList: ban,
      tenantId: tenantId
    }
    xnService.itemNew(val, function(data) {
      console.log(data)
      if (data.firstErrorMessage == "") {
        //  if (data.result[0].attributeValueList.length > data.result[1].attributeValueList.length) {

        if (data.result[0].commodityStatistics.evaluationQuantityCountB2C>0){
          that.setData({
            commentnum: data.result[0].commodityStatistics.evaluationQuantityScoreB2C / data.result[0].commodityStatistics.evaluationQuantityCountB2C,
            commentnumone: parseInt(data.result[0].commodityStatistics.evaluationQuantityScoreB2C / data.result[0].commodityStatistics.evaluationQuantityCountB2C),
            commentnumtwo: 5 - parseInt(data.result[0].commodityStatistics.evaluationQuantityScoreB2C / data.result[0].commodityStatistics.evaluationQuantityCountB2C),
            attributeValueList: data.result[0].attributeValueList,
          })
        }else{
          that.setData({
            commentnum: data.result[0].commodityStatistics.evaluationQuantityScoreB2C ,
            commentnumone: parseInt(data.result[0].commodityStatistics.evaluationQuantityScoreB2C),
            commentnumtwo: 5 - parseInt(data.result[0].commodityStatistics.evaluationQuantityScoreB2C),
            attributeValueList: data.result[0].attributeValueList,
          })
        }


        if (data.result[1].commodityStatistics.evaluationQuantityCountB2C > 0) {
          that.setData({
            countstar: data.result[1].commodityStatistics.evaluationQuantityScoreB2C / data.result[1].commodityStatistics.evaluationQuantityCountB2C,
            countstarone: parseInt(data.result[1].commodityStatistics.evaluationQuantityScoreB2C / data.result[1].commodityStatistics.evaluationQuantityCountB2C),
            countstartwo: 5 - parseInt(data.result[1].commodityStatistics.evaluationQuantityScoreB2C / data.result[1].commodityStatistics.evaluationQuantityCountB2C),
            attributeValueList: data.result[0].attributeValueList
          })
        }else{
          that.setData({
            countstar: data.result[1].commodityStatistics.evaluationQuantityScoreB2C ,
            countstarone: parseInt(data.result[1].commodityStatistics.evaluationQuantityScoreB2C ),
            countstartwo: 5 - parseInt(data.result[1].commodityStatistics.evaluationQuantityScoreB2C),
            attributeValueList: data.result[0].attributeValueList
          })
        }



        if (data.totalCount > 3 || data.totalCount ==3){
          if (data.result[2].commodityStatistics.evaluationQuantityCountB2C>0){
            that.setData({
              countstar: data.result[2].commodityStatistics.evaluationQuantityScoreB2C / data.result[2].commodityStatistics.evaluationQuantityCountB2C,
              countstarListone: parseInt(data.result[2].commodityStatistics.evaluationQuantityScoreB2C / data.result[2].commodityStatistics.evaluationQuantityCountB2C),
              countstarListtwo: 5 - parseInt(data.result[2].commodityStatistics.evaluationQuantityScoreB2C / data.result[2].commodityStatistics.evaluationQuantityCountB2C),
              flagthree: true,
              attributeValueList: data.result[0].attributeValueList
            })
          }else{
            that.setData({
              countstar: data.result[2].commodityStatistics.evaluationQuantityScoreB2C ,
              countstarListone: parseInt(data.result[2].commodityStatistics.evaluationQuantityScoreB2C),
              countstarListtwo: 5 - parseInt(data.result[2].commodityStatistics.evaluationQuantityScoreB2C ),
              flagthree: true,
              attributeValueList: data.result[0].attributeValueList
            })
          }

         }

        if (data.totalCount == 4){
          if (data.result[3].commodityStatistics.evaluationQuantityCountB2C>0){
            that.setData({
              countstar: data.result[3].commodityStatistics.evaluationQuantityScoreB2C / data.result[3].commodityStatistics.evaluationQuantityCountB2C,
              commentnumListone: parseInt(data.result[3].commodityStatistics.evaluationQuantityScoreB2C / data.result[3].commodityStatistics.evaluationQuantityCountB2C),
              commentnumListtwo: 5 - parseInt(data.result[3].commodityStatistics.evaluationQuantityScoreB2C / data.result[3].commodityStatistics.evaluationQuantityCountB2C),
              flagfive: true,
              attributeValueList: data.result[0].attributeValueList
            })
          }else{
            that.setData({
              countstar: data.result[3].commodityStatistics.evaluationQuantityScoreB2C ,
              commentnumListone: parseInt(data.result[3].commodityStatistics.evaluationQuantityScoreB2C ),
              commentnumListtwo: 5 - parseInt(data.result[3].commodityStatistics.evaluationQuantityScoreB2C),
              flagfive: true,
              attributeValueList: data.result[0].attributeValueList
            })
          }

         }

        //  console.log('---------', that.data.commentnumone, that.data.countstarone)
        // };
        that.setData({
          Comparetheinformation: data.result,
        });
        if (isNaN(that.data.commentnumone)) {
          that.setData({
            commentnumtwo: 5
          })
        }
        if (isNaN(that.data.countstarone)) {
          that.setData({
            countstartwo: 5
          })
        }
        if ((isNaN(that.data.countstarListtwo) && data.totalCount > 3) || (isNaN(that.data.countstarListtwo) && data.totalCount == 3)) {
          that.setData({
            countstarListtwo: 5,
          })
        }
        if (isNaN(that.data.commentnumListtwo) && data.totalCount == 4) {
          that.setData({
            commentnumListtwo:5,
            widthInght:'width:1055rpx',

          })
        }
      }

    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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