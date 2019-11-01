import {
  connect
} from '../../redux/index.js';
import {
  showToast,
  calcTimeHeader
} from '../../utils/util.js';
import {
  iconNoMessage
} from '../../utils/imageBase64.js';
let app = getApp();
const xnService = require("../../../service/service.js");
let store = app.store;

let startX = 0;

let pageConfig = {
  /**
   * 页面的初始数据
   */

  data: {
    iconNoMessage: '',
    loginUserAccount: '',
    translateX: 0,
    defaultUserLogo: '',
    chatList: [], // [{account,nick,lastestMsg,type,timestamp,displayTime,message,unread,status}]
    customList: [], // [{account,nick,lastestMsg,type,timestamp,displayTime,message,unread,status}]
    chatAccount: {}, // {accountName: accountName} 备注:消息通知key为notification

    //顶部tab所需
    scrollHeight: app.globalData.scrollHeight - 108, //获取页面高度
    tabIndex: 0, //默认选中第一个
    //imId: getApp().globalData.IMID
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //判断是否需要登录
    if (!wx.getStorageSync("passportId")) {
      wx.reLaunch({
        url: "/pages/fangChat/bindPhone/bindPhone?type=RE_LAUNCH"
      })
      return;
    }

    // 条目题目展示我的电脑  没有消息图标和默认头像
    console.log("iconNoMessage", iconNoMessage)
    this.setData({
      iconNoMessage,
      defaultUserLogo: app.globalData.PAGE_CONFIG.defaultUserLogo,
    })
    this.getJumpUrl();
  },

  /**
   * 切换通知与私信
   * tabChange  
   */
  tabChange: function(e) {
    let tabIndex = e.currentTarget.dataset.index
    this.setData({
      tabIndex: tabIndex
    })
  },

  getJumpUrl: function() {
    xnService.jumpUrl({}, res => {
      console.log('res', res)
      if (res.code == '1') {
        app.toastShow(this, res.message);
        return;
      }
    })
  },

  /**
   * 阻止事件冒泡空函数
   */
  stopEventPropagation() {},
  /**
   * 显示时排序
   */
  onShow() {
    // this.sortChatList()

    // setTimeout(()=>{
    //   app.customerSysMsg('007','sas','cccccceeeeee')
    // },3000)

  },
  /**
   * 排序chatlist
   */
  sortChatList() {
    if (this.data.chatList.length !== 0) {
      let chatList = [...this.data.chatList]
      chatList.sort((a, b) => {
        return parseInt(b.timestamp) - parseInt(a.timestamp)
      })
      this.setData({
        chatList
      })
    }
  },
  /**
   * 传递消息进来，添加至最近会话列表
   * 必须字段 {type, time, from,to}
   */
  addNotificationToChatList(msg) {
    let desc = ''
    let self = this
    switch (msg.type) {
      case 'addFriend':
        {
          desc = `添加好友-${msg.from}`
          break
        }
      case 'deleteFriend':
        {
          desc = `删除好友-${msg.from}`
          break
        }
      case 'deleteMsg':
        desc = `${msg.from}撤回了一条消息`
        break
      case 'custom':
        let data = JSON.parse(msg.content)
        let seen = []
        let str = data['content'] || JSON.stringify(data, function(key, val) {
          if (typeof val == "object") {
            if (seen.indexOf(val) >= 0)
              return
            seen.push(val)
          }
          return val
        }) // 可能没有content属性
        desc = `自定义系统通知-${str}`
        break
      default:
        desc = msg.type
        break
    }
    if (!self.data.chatAccount['notification']) { // 没有系统通知
      self.setData({
        chatList: [{
          account: '消息通知',
          timestamp: msg.time,
          displayTime: msg.time ? calcTimeHeader(msg.time) : '',
          lastestMsg: desc,
        }, ...self.data.chatList],
        chatAccount: Object.assign({}, self.data.chatAccount, {
          notification: 'notification'
        })
      })
    } else {
      let temp = [...self.data.chatList]
      temp.map((message, index) => {
        if (message.account === '消息通知') {
          temp[index].lastestMsg = desc
          temp[index].timestamp = msg.time
          temp[index].displayTime = msg.time ? calcTimeHeader(msg.time) : ''
          return
        }
      })
      temp.sort((a, b) => {
        return a.timestamp < b.timestamp
      })
      self.setData({
        chatList: temp
      })
    }
  },
  /**
   * 捕获从滑动删除传递来的事件
   */
  catchDeleteNotification(e) {
    let index = e.currentTarget.dataset.index;
    let time = e.currentTarget.dataset.time;
    let account = e.currentTarget.dataset.account;
    let sessionId = `p2p-${account}`
    // 从全局记录中删除
    store.dispatch({
      type: 'Delete_Single_MessageByAccount',
      payload: { sessionId: sessionId, time: time }
    })
  },
  /**
   * 捕获从滑动删除传递来的事件
   */
  catchDeleteTap(e) {
    let session = e.currentTarget.dataset.session
    let chatAccount = Object.assign({}, this.data.chatAccount)
    delete chatAccount[session]
    let chatList = [...this.data.chatList]
    let deleteIndex = 0
    chatList.map((item, index) => {
      if (item.session === session) {
        deleteIndex = index
        return
      }
    })
    chatList.splice(deleteIndex, 1)
    store.dispatch({
      type: 'Delete_All_MessageByAccount',
      payload: session
    })
    this.setData({
      chatList,
      chatAccount
    })
  },
  /**
   * 单击消息通知
   */
  getUrlParam(name,url) {  
     var parameterString = null;
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     parameterString = url.substr(url.indexOf("?"), url.length);//获取截取？以后的字符串
     var r = parameterString.substr(1).match(reg);
     if (r != null) {
       return unescape(r[2]);
     }
     return null;
  },

  switchToMessageNotification(e) {
    // 
    let item = e.currentTarget.dataset.item;
    console.log(item);

    const type = pageConfig.getUrlParam("type", item.linkUrl);
    const id = pageConfig.getUrlParam("id", item.linkUrl);
    const boardId = pageConfig.getUrlParam("boardId", item.linkUrl);
    const threadId = pageConfig.getUrlParam("threadId", item.linkUrl);
    console.log(type,id,boardId,threadId);
    switch (type){
       // url里面有个 type 参数：    // 0：图文 // 1：图集// 2：视频// 3：提问// 4：文章// 8：回答详情// 9：评论详情
      case "0":        
        wx.navigateTo({
          url: `/pages/community/img-text-detail/img-text-detail?boardId=${boardId}&threadId=${id}`,
        }); 
      break;
      case "1": 
        //图集
        wx.navigateTo({
          url: `/pages/community/atlas/atlas?boardId=${boardId}&threadId=${id}`,
        });
      break;
      case "2":
        //视频
        wx.navigateTo({
          url: `/pages/community/video/video?boardId=${boardId}&threadId=${id}`,
        });
      break;
      case "3": 
        //提问
        wx.navigateTo({
          url: `/pages/community/question-answer/question/question?boardId=${boardId}&threadId=${id}`,
        });
      break;
      case "4": 
        //文章
        wx.navigateTo({
          url: `/pages/community/text-detail/text-detail?boardId=${boardId}&threadId=${id}`
        }); 
      break;
      case "8": 
        wx.navigateTo({
          url: `/pages/community/question-answer/answer-details/answer-details?threadId=${threadId}&boardId=${boardId}&answerId=${id}`
        });
      break;
      case "9": 
        wx.navigateTo({
          url: `/pages/community/reply/reply?threadId=${id}&boardId=${boardId}`,
        })
      break;      
    }
  },
  /**
   * 单击进入聊天页面
   */
  switchToChating(e) {
    let account = e.currentTarget.dataset.account
    let session = e.currentTarget.dataset.session
    // 更新会话对象
    store.dispatch({
      type: 'CurrentChatTo_Change',
      payload: session
    })
    let typeAndAccount = session.split('-')
    var chatType
    if (typeAndAccount[0] === 'team') {
      let card = this.data.groupList[typeAndAccount[1]] || {}
      chatType = card.type || 'team'
      store.dispatch({
        type: 'Set_Current_Group',
        payload: account
      })
    } else { 
      chatType = 'p2p'
    }
    // 告知服务器，标记会话已读
    app.globalData.nim.resetSessionUnread(session)
    // 跳转
    wx.navigateTo({
      url: `../chating/chating?chatTo=${account}&type=${chatType}`,
    })
  },
  /**
   * 单击进入个人区域
   */
  switchToPersonCard(e) {
    let account = e.currentTarget.dataset.account
    // 重置该人的未读数
    // 重置某个会话的未读数,如果是已经存在的会话记录, 会将此会话未读数置为 0, 并会收到onupdatesession回调,而且此会话在收到消息之后依然会更新未读数
    app.globalData.nim.resetSessionUnread(`p2p-${account}`)
    // 压栈进入account介绍页
    this.clickLogoJumpToCard(account)
  },
  /**
   * 传入account判断是否是好友，跳转指定页面
   */
  clickLogoJumpToCard(account) {
    let friendsAccountArr = Object.keys(this.data.friendCard)

    if (friendsAccountArr.indexOf(account) !== -1) {
      // wx.navigateTo({
      //   url: '/page/partials/personcard/personcard?account=' + account,
      // })
    } else {
      // app.globalData.nim.getUser({
      //   account: account,
      //   done: function (err, user) {
      //     if (err) {
      //       console.log(err)
      //       return
      //     }
      //     wx.navigateTo({
      //       url: '/page/partials/strangercard/strangercard?account=' + user.account,
      //     })
      //   }
      // })
    }
  },
  /**
    * 判断消息类型，返回提示
    */
  judgeMessageType(rawMsg) {
    rawMsg = rawMsg || {}
    let msgType = ''
    if (rawMsg.type === 'image') {
      msgType = '[图片]'
    } else if (rawMsg.type === 'geo') {
      msgType = '[位置]'
    } else if (rawMsg.type === 'audio') {
      msgType = '[语音]'
    } else if (rawMsg.type === 'video') {
      msgType = '[视频]'
    } else if (rawMsg.type === 'custom') {
      msgType = rawMsg.pushContent || '[自定义消息]'
    } else if (rawMsg.type === 'tip') {
      msgType = '[提醒消息]'
    } else if (rawMsg.type === 'deleteMsg') {//可能是他人撤回消息
      msgType = '[提醒消息]'
    } else if (rawMsg.type === 'file') {
      msgType = '[文件消息]'
    } else if (rawMsg.type === '白板消息') {
      msgType = '[白板消息]'
    } else if (rawMsg.type === '阅后即焚') {
      msgType = '[阅后即焚]'
    } else if (rawMsg.type === 'robot') {
      msgType = '[机器人消息]'
    } else if (rawMsg.type === 'notification') {
      msgType = '[通知消息]'
    }
    return msgType
  },
  /**
   * 将原生消息转化为最近会话列表渲染数据
   */
  convertRawMessageListToRenderChatList(rawMessageList, friendCard, groupList, unreadInfo, type) {
    console.log("rawMessageList", rawMessageList);
    let chatList = []
    let customList = []
    let sessions = Object.keys(rawMessageList)
    let index = 0
    sessions.map(session => {
      let account = session.indexOf('team-') === 0 ? session.slice(5, session.length) : session.slice(4, session.length)
      let isP2p = session.indexOf('p2p-') === 0
      let chatType = isP2p ? 'p2p' : (groupList[account] && groupList[account].type)
      let sessionCard = (isP2p ? friendCard[account] : groupList[account]) || {}
      let unixtimeList = Object.keys(rawMessageList[session])
      if (!unixtimeList) {
        return
      }
      let maxTime = Math.max(...unixtimeList)    
      if (maxTime) {
        let msg = rawMessageList[session][maxTime + ''] || {}
        let msgType = this.judgeMessageType(msg)
        let lastestMsg = msgType
        let status = isP2p ? (sessionCard.status || '') : '' //离线
        let nick = isP2p ? sessionCard.nick : sessionCard.name    //非好友
        let avatar = isP2p ? (sessionCard.avatar || app.globalData.PAGE_CONFIG.defaultUserLogo) : (sessionCard.avatar || app.globalData.PAGE_CONFIG.defaultUserLogo)

        if (msg.type =='custom'){
          console.log("session", session)            
          customList = pageConfig.convertRawMessageListToRenderMessageArr(rawMessageList[session], account);
          console.log(customList);          
        }else{
          chatList.push({
            chatType,
            session,
            account,
            status,
            nick,
            avatar,
            lastestMsg: lastestMsg || msg.text,
            type: msgType || msg.type,
            timestamp: msg.time,
            unread: unreadInfo[session] || 0,
            displayTime: msg.time ? calcTimeHeader(msg.time) : ''
          })
        }
      }
    })
    // 排序
    chatList.sort((a, b) => {
      return b.timestamp - a.timestamp
    })
    // 自定义消息
    customList.sort((a, b) => {
      return b.time - a.time
    })  
    if (type =='custom'){
      return customList 
    }
    return chatList
  },
  /**
   * 计算最近一条发送的通知消息列表
   */
  caculateLastestNotification(notificationList) {
    let temp = Object.assign({}, notificationList)
    let lastestDesc = ''
    let systemMaxIndex = null
    let customMaxIndex = null
    // 从大到小
    let system = notificationList.system.sort((a, b) => {
      return b.msg.time - a.msg.time
    })
    let custom = notificationList.custom.sort((a, b) => {
      return b.msg.time - a.msg.time
    })
    if (system[0]) {
      if (custom[0]) {
        lastestDesc = system[0].msg.time - custom[0].msg.time ? system[0].desc : custom[0].desc
      } else {
        lastestDesc = system[0].desc
      }
    } else {
      if (custom[0]) {
        lastestDesc = custom[0].desc
      }
    }
    return lastestDesc
  },


   /**
   * 原始消息列表转化为适用于渲染的消息列表
   * {unixtime1: {flow,from,fromNick,idServer,scene,sessionId,text,target,to,time...}, unixtime2: {}}
   * =>
   * [{text, time, sendOrReceive: 'send', displayTimeHeader, nodes: []},{type: 'geo',geo: {lat,lng,title}}]
   */
  convertRawMessageListToRenderMessageArr(rawMsgList, account) {
    let messageArr = []
    for (let time in rawMsgList) {
      let rawMsg = rawMsgList[time]
      let msgType = rawMsg.type
      let displayTimeHeader = this.judgeOverTwoMinute(rawMsg.time, messageArr)
      let sendOrReceive = rawMsg.flow === 'in' ? 'receive' : 'send'
      let specifiedObject = {}
      let content = JSON.parse(rawMsg['content']).data;      
      specifiedObject = {       
        nodes: {
          type: 'text',
          text: content.title,
          linkUrl: content.linkUrl
        }
      }

      messageArr.push(Object.assign({}, {
        type: msgType,
        account: account,
        text: rawMsg.text || '',
        time,
        sendOrReceive,
        displayTimeHeader
      }, specifiedObject))
    }
    return messageArr
  },
  /**
  * 距离上一条消息是否超过两分钟
  */
  judgeOverTwoMinute(time, messageArr) {
    let displayTimeHeader = ''
    let lastMessage = messageArr[messageArr.length - 1]
    if (lastMessage) {//拥有上一条消息
      let delta = time - lastMessage.time
      if (delta > 0 * 60 * 1000) {//两分钟以上
        displayTimeHeader = calcTimeHeader(time)
      }
    } else {//没有上一条消息
      displayTimeHeader = calcTimeHeader(time)
    }
    return displayTimeHeader
  },
}
let mapStateToData = (state) => {
  let chatList = pageConfig.convertRawMessageListToRenderChatList(state.rawMessageList, state.friendCard, state.groupList, state.unreadInfo)
  let customList = pageConfig.convertRawMessageListToRenderChatList(state.rawMessageList, state.friendCard, state.groupList, state.unreadInfo,'custom')
  let latestNotification = pageConfig.caculateLastestNotification(state.notificationList)
  return {
    rawMessageList: state.rawMessageList,
    userInfo: state.userInfo,
    friendCard: state.friendCard,
    groupList: state.groupList,
    unreadInfo: state.unreadInfo,
    chatList: chatList,
    customList: customList,
    latestNotification
  }
}      
const mapDispatchToPage = (dispatch) => ({})
let connectedPageConfig = connect(mapStateToData, mapDispatchToPage)(pageConfig)
Page(connectedPageConfig)