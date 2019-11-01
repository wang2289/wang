//通知方法
let __notices = []; //存放消息

/**
 * 注册通知事件
 * @param {String} name 注册名
 * @param {String} fn 对应的通知方法
 * @param {Object} that 注册对象，指Page对象
 */
let addNotice = (name, fn, that) => {
  if (name && fn) {
    if (!that) {
      console.log("addNotification Warning: no observer will can't remove notice");
    }
    var newNotice = {
      name: name,
      fn: fn,
      that: that
    };
    console.log(newNotice);
    __notices.push(newNotice);
  } else {
    console.log("addNotification error: no selector or name");
  }
}

/**
 * 移除通知方法
 * @param {String} name 注册名
 * @param {Object} that 注册对象，指Page对象
 */
let delNotice = (name, that) => {
  for (var i = 0; i < __notices.length; i++) {
    var notice = __notices[i];
    if (notice.name === name) {
      if (notice.that === that) {
        __notices.splice(i, 1);
        return;
      }
    }
  }
}

/**
 * 发送通知方法
 * @param {String} name 注册名
 * @param {Object} info 携带的参数
 */
function sendNotice(name, info) {
  if (__notices.length == 0) {
    console.log("postNotificationName error: u hadn't add any notice.");
    return;
  }
  for (var i = 0; i < __notices.length; i++) {
    var notice = __notices[i];
    if (notice.name === name) {
      notice.fn(info);
    }
  }
}

module.exports = {
  addNotice: addNotice,
  delNotice: delNotice,
  sendNotice: sendNotice
}