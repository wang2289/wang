// components/timu/index.js
// var answer = [];
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timu: Object,
    paperid: String,
    showmodle: Boolean,
    isdo: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isActive: -1,
    isActive2: -1,
    isActive3: -1,
    timu: [],
    answer: [],
    isChange: [],
    values:''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onActive: function (e) {
      let item = { isdo: true }
      this.triggerEvent('addInfo', item)
      var index = e.currentTarget.dataset.tab;//获取当前点击的元素下标
      var typeid = e.currentTarget.dataset.typeid;
      var id = e.currentTarget.dataset.id;
      var tips = e.currentTarget.dataset.tips;
      this.setData({
        isActive: index,
        isdo:true
      })
      var value = wx.getStorageSync(this.properties.paperid)
      for (var m = 0; m < value.length; m++) {
        if (typeid == value[m].typeid) {
          for (var i = 0; i < value[m].items.length; i++) {
            if (id == value[m].items[i].id) {
              value[m].items[i].mychoice = tips
            }
          }
        }
      }
      // console.log(tips);
      // console.log(value);
    
      wx.setStorageSync(this.properties.paperid, value)
     
    },
    addInfo() {
    },
    onActive3: function (e) {
      let item = { isdo: true }
      this.triggerEvent('addInfo', item)
      var index = e.currentTarget.dataset.tab;//获取当前点击的元素下标
      var typeid = e.currentTarget.dataset.typeid;
      var id = e.currentTarget.dataset.id;
      this.setData({
        isActive3: index,
      })
      var value = wx.getStorageSync(this.properties.paperid)
      for (var m = 0; m < value.length; m++) {
        if (typeid == value[m].typeid) {
          for (var i = 0; i < value[m].items.length; i++) {
            if (id == value[m].items[i].id) {
              //根据下标找到目标,改变状态  
              value[m].items[i].mychoice = index
            }
          }
        }
      }
      // console.log(value);
      wx.setStorageSync(this.properties.paperid, value)
    },
    Oninput: function (e){
      // console.log(e.detail);
      var typeid = e.currentTarget.dataset.typeid;
      var id = e.currentTarget.dataset.id;
      var value = wx.getStorageSync(this.properties.paperid)
      for (var m = 0; m < value.length; m++) {
        if (typeid == value[m].typeid) {
          for (var i = 0; i < value[m].items.length; i++) {
            if (id == value[m].items[i].id) {
              //根据下标找到目标,改变状态  
              value[m].items[i].mychoice = e.detail.value
            }
          }
        }
      }
      this.setData({
        values: e.detail.value
      })
      // console.log(typeid);
      // console.log(id);
      // console.log(value);
      wx.setStorageSync(this.properties.paperid, value)
    },
    onChange: function (e) {
      var index = e.currentTarget.dataset.index;//获取当前点击的元素下标
      var answer = this.data.answer
      var typeid = e.currentTarget.dataset.typeid;
      var id = e.currentTarget.dataset.id;
      var tips = e.currentTarget.dataset.tips;
      var missionArr = this.properties.timu;
      // console.log(missionArr);
      for (let i in missionArr.body) {
        //遍历列表数据      
        if (i == index) {
          //根据下标找到目标,改变状态  
          if (missionArr.body[i].status == 1) {
            missionArr.body[i].status = 0
            this.remove(answer, tips);
          } else {
            missionArr.body[i].status = 1
            answer.push(tips);
          }
        }
      }
      //数组重新赋值
      this.setData({
        timu: missionArr
      })

      var value = wx.getStorageSync(this.properties.paperid)
      for (var m = 0; m < value.length; m++) {
        if (typeid == value[m].typeid) {
          for (var i = 0; i < value[m].items.length; i++) {
            if (id == value[m].items[i].id) {
              //根据下标找到目标,改变状态  
              value[m].items[i].mychoice = answer.join(',')
            }
          }
        }
      }
      // console.log(value);
      wx.setStorageSync(this.properties.paperid, value)
    },
    confirm: function (event){
      this.setData({
        scrolltop: 10000
      })
    },
    linechange: function (event) {
      this.setData({
        scrolltop: 10000
      })
    },
    remove: function (array, val) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == val) {
          array.splice(i, 1);
        }
      }
      return -1;
    }
  }
})
