// components/course-list/index.js
var num = 1;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    course: Object,
    title: String,
    money: String,
    ismark: String,
    type: String,
    activeName: String,
    isios: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    isOn: '',
    activeNames: ['1'],
    isActive: true,
    islink: false,
    clickable: true,
    tihsi: '',
    showif: true,
    iconimg: '/images/icon_list_down@2x.png',
    downimg: '/images/icon_list_down@2x.png',
    upimg: '/images/icon_list_up@2x.png',
    isios: null
  },
  pageLifetimes: {
    show: function () {
      this.setData({
        isios: this.data.isios
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      console.log(event.detail)
      num += 1;
      this.setData({
        activeNames: event.detail,
        isActive: !this.data.isActive,
        isOn: event.detail
      });
      if (this.data.isActive) {
        this.setData({
          iconimg: this.data.downimg,
        })
      } else {
        this.setData({
          iconimg: this.data.upimg,
        })
      }
    },
    onTap(event) {
      var ismark = this.properties.ismark
      var type = this.properties.type
      let postId = event.currentTarget.dataset.id;
      let isfree = event.currentTarget.dataset.free;
      let buy = event.currentTarget.dataset.buy;
      let num = event.currentTarget.dataset.num;
      let count = event.currentTarget.dataset.count;
      // console.log(postId)
      if (buy) {
        if (ismark == "次" && num >= count) {
          let item = { title: this.properties.title, money: this.properties.money, showifs: true }
          this.triggerEvent('addInfo', item)
        } else {
          wx.navigateTo({
            url: '/pages/dotidetail/dotidetail?bid=' + postId + '&type=' + type,
          })
        }
      } else {
        if (isfree) {
          wx.navigateTo({
            url: '/pages/dotidetail/dotidetail?bid=' + postId + '&type=' + type,
          })
        } else {
          let item = { title: this.properties.title, money: this.properties.money, showif: false }
          this.triggerEvent('addInfo', item)
        }
      }
    },
  }
})
