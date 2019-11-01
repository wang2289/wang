// components/tag/tag.js
var WxParse = require('../../wxParse/wxParse.js');

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    text: String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
  },
  attached(){
    WxParse.wxParse('article', 'html', this.properties.text, this, 0);
  }
})
