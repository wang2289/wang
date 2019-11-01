// components/mengceng/mengceng.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    postid:{
      type: String,
      value:''
    },
    isshow: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCancle: function (event) {
      this.setData({
        isshow: !this.data.isshow,
      })
      let item = { tijiao: false }
      this.triggerEvent('addInfo2', item)
    },
    onSubmit: function (event) {
      let item = { tijiao: true }
      this.triggerEvent('addInfo2', item)
      this.setData({
        isshow: !this.data.isshow,
      })
    }
  }
})
