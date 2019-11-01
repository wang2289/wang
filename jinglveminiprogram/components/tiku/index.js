// components/tiku/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tiku: Object,
    isios: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    isios: null
  },
  pageLifetimes: {
    show: function () {
      this.setData({
        isios: this.data.isios
      })
      console.log(this.data.isios)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
