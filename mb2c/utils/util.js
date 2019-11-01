function formatTime(number) {
  if (number) {
    var date = new Date(parseInt(number));
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/') + " " + [hour, min, sec].map(formatNumber).join(':');
  }
}

function alert(content, callback, duration) { //普通弹出框
  wx.showToast({
    icon: "success",
    title: content || "成功",
    duration: duration || 2000,
    success: callback
  });
}

function formatTime1(number) {
  if (number) {
    var date = new Date(parseInt(number));
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return [year, month, day].map(formatNumber).join('-') + " " + [hour, min, sec].map(formatNumber).join(':');

  }
}

function formatDay(number) {
  if (number) {
    var date = new Date(parseInt(number));
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(formatNumber).join('-');
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatText(num) {
  return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

/**
 * 获取小时如：09：10
 * 
 * 参数 时间戳
 */

function getHourTime(number) {
  if (number) {
    var date = new Date(parseInt(number));
    var hour = date.getHours();
    var min = date.getMinutes();
    return [hour, min].map(formatNumber).join('：');
  }
}

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
var accAdd = function(arg1, arg2) {
  var r1, r2, m, c;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
    var cm = Math.pow(10, c);
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", "")) * cm;
    } else {
      arg1 = Number(arg1.toString().replace(".", "")) * cm;
      arg2 = Number(arg2.toString().replace(".", ""));
    }
  } else {
    arg1 = Number(arg1.toString().replace(".", ""));
    arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
};


/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
var accSub = function(arg1, arg2) {
  var r1, r2, m, n;
  try {
    r1 = arg1.toString().split(".")[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = arg2.toString().split(".")[1].length;
  } catch (e) {
    r2 = 0;
  }
  m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
};


/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
var accMul = function(arg1, arg2) {
  var m = 0,
    s1 = arg1.toString(),
    s2 = arg2.toString();
  try {
    m += s1.split(".")[1].length;
  } catch (e) {}
  try {
    m += s2.split(".")[1].length;
  } catch (e) {}
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
};


/**
 ** 除法函数，用来得到精确的除法结果
 ** 说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
 ** 调用：accDiv(arg1,arg2)
 ** 返回值：arg1除以arg2的精确结果
 **/
var accDiv = function(arg1, arg2) {
  var t1 = 0,
    t2 = 0,
    r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length;
  } catch (e) {}
  try {
    t2 = arg2.toString().split(".")[1].length;
  } catch (e) {}
  r1 = Number(arg1.toString().replace(".", ""));
  r2 = Number(arg2.toString().replace(".", ""));
  return (r1 / r2) * Math.pow(10, t2 - t1);
};

var toAmount = function(num) {
  var amount = num - 0;
  if (amount) {
    amount = Math.round(amount * 100000) / 100000 + "";
    var list = amount.split(".");
    if (list.length == 1) {
      return list[0] + ".00";
    } else {
      for (var i = list[1].length - 1; i > 1; i--) {
        if ('0' == list[1].charAt(i)) {
          list[1] = list[1].substring(0, i);
        } else {
          break;
        }
      }
      if (list[1].length == 0) {
        list[1] = "00";
      }
      if (list[1].length == 1) {
        list[1] += "0";
      }
      return list[0] + "." + list[1];
    }
  } else {
    return "0.00";
  }

};

var getOrderStatus = function(status) {
  var result = "";
  switch (status) {
    case "UN_PAID":
      result = "待付款";
      break;
    case "UN_FINISHED":
      result = "已预订";
      break;
    case "UN_EVALUATIONED":
      result = "已完成";
      break;
    case "EVALUATIONED":
      result = "已评价";
      break;
    case "CANCELLED":
      result = "已取消";
      break;
  }
  return result;
};

let xnShowWarn = function(content) {

  wx.showModal({
    title: '警告',
    content: content,
    showCancel: false,
    success: function(res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

}

// #region Date

Date.prototype.add = function(milliseconds) {
  var m = this.getTime() + milliseconds;
  return new Date(m);
};
Date.prototype.addSeconds = function(second) {
  return this.add(second * 1000);
};
Date.prototype.addMinutes = function(minute) {
  return this.addSeconds(minute * 60);
};
Date.prototype.addHours = function(hour) {
  return this.addMinutes(60 * hour);
};
Date.prototype.addDays = function(day) {
  return this.addHours(day * 24);
};
Date.isLeepYear = function(year) {
  return (year % 4 == 0 && year % 100 != 0)
};
Date.daysInMonth = function(year, month) {
  if (month == 2) {
    if (year % 4 == 0 && year % 100 != 0)
      return 29;
    else
      return 28;
  } else if ((month <= 7 && month % 2 == 1) || (month > 7 && month % 2 == 0))
    return 31;
  else
    return 30;
};
Date.prototype.addMonth = function(n) {
  if (n == undefined) {
    n = 1;
  }
  var mindate = new Date(this.getFullYear(), this.getMonth() + n, 1, this.getHours(), this.getMinutes(), this.getSeconds());
  var maxdate = new Date(this.getFullYear(), this.getMonth() + n, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
  if (maxdate.getMonth() == mindate.getMonth()) {
    //说明日期没超限
    return maxdate;
  } else {
    //超限则返回最大日期值
    return new Date(this.getFullYear(), this.getMonth() + n + 1, 0, this.getHours(), this.getMinutes(), this.getSeconds());
  }
};
Date.prototype.subMonth = function() {
  var m = this.getMonth();
  if (m == 0) return new Date(this.getFullYear() - 1, 12, this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
  var day = this.getDate();
  var daysInPreviousMonth = Date.daysInMonth(this.getFullYear(), this.getMonth());
  if (day > daysInPreviousMonth) {
    day = daysInPreviousMonth;
  }
  return new Date(this.getFullYear(), this.getMonth() - 1, day, this.getHours(), this.getMinutes(), this.getSeconds());
};
Date.prototype.addYears = function(year) {
  return new Date(this.getFullYear() + year, this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds());
};
Date.prototype.format = function(fmt) { //author: meizz 
  var o = {
    "M+": this.getMonth() + 1, //月份 
    "d+": this.getDate(), //日 
    "h+": this.getHours(), //小时 
    "m+": this.getMinutes(), //分 
    "s+": this.getSeconds(), //秒 
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
    "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

function confirm(content, callback, isCancel) { //确认对话框
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: isCancel || false,
    success: callback
  })
}

function loading(content, time, callback) { //数据加载
  wx.showLoading({
    mask: true,
    title: content || "loading...",
    success: callback
  });
}

function hideloading() { //隐藏提示框
  var time = setTimeout(function () {
    wx.hideLoading()
  }, 500);
}
// #endregion
module.exports = {
  formatTime: formatTime,
  formatTime1,
  getHourTime,
  formatDay: formatDay,
  formatNumber,
  accAdd: accAdd,
  accSub: accSub,
  accMul: accMul,
  accDiv: accDiv,
  toAmount: toAmount,
  getOrderStatus: getOrderStatus,
  xnShowWarn: xnShowWarn,
  formatText: formatText,
  confirm: confirm, //带确定的提示框
  isNull: isNull, //判断是否为空
  alert: alert,
  loading: loading,
  hideloading: hideloading
}

function Regular(str, reg) {
  if (reg.test(str))
    return true;
  return false;
}

function isNull(o) {
  return o == undefined || o == "undefined" || o == null || o == '';
}
// function IsChinese(str){
//   var reg=/^[\u0391-]
// }