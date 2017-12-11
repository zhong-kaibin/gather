const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//获取明天具体的截止时间点,传入参数格式"05:00:00"
function endTime(str){
  var curDate = new Date();
  var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);  //后一天
  // 次日5点时间戳,先获得当日的年月日时分秒
  var endYear = nextDate.getFullYear();
  var endMonth = nextDate.getMonth() + 1;//getMonth只有0-11，比较特殊
  var endDay = nextDate.getDate();
  var endTime = endYear + "-" + endMonth + "-" + endDay;//拼凑明天的时间eg:2017-11-23
  var endTimeSencond = Date.parse(new Date(endTime + " " + str));
  return endTimeSencond
}
//导出倒计时的时分秒params:endTimeSencond为具体的时间戳通过endTime方法可得
function leftTimer(endTimeSencond,endTimeSencond2) {
  var curDate = new Date();
  //var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);  //前一天 
  var leftTime = endTimeSencond - Date.parse(new Date()); //计算剩余的毫秒数 
  var leftTime2 = endTimeSencond2 - Date.parse(new Date()); //计算剩余的毫秒数 
  var status = false;//时间条件是否显示打卡
  if (leftTime>0){
    status = false//还不到打卡时间
  } else if (leftTime <= 0 && leftTime2 >= 0){
    status = true//指定时间段
  }else{
    status = false
  }
  var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数 
  var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时 
  var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟 
  var seconds = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数 
  days = checkTime(days);
  hours = checkTime(hours);
  minutes = checkTime(minutes);
  seconds = checkTime(seconds);
  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    status: status
  }
  // document.getElementById("timer").innerHTML = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
}
//将0-9的数字前面加上0，例1变为01 
function checkTime(i) { 
  if (i < 10) {
    i = "0" + i;
  }
  return i;
} 

// 今晚23：50—24：00时间戳
function nightTime(){
  var curDate = new Date();  
  var Year = curDate.getFullYear();
  var Month = curDate.getMonth() + 1;
  var Day = curDate.getDate();
  var Time = Year + "-" + Month + "-" + Day;
  var nightTimeSencond = Date.parse(new Date(Time + " 23:50:00"));//今晚23：50
  var nightTimeSencond1 = Date.parse(new Date(Time + " 23:59:59"));//今晚23：59
  return {
    nightTime2350: nightTimeSencond,
    nightTime2359: nightTimeSencond1
  }
}

function tomorrowHour58(){
  var curDate = new Date();
  //var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);  //前一天
  var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);  //后一天
  // 次日5点时间戳,先获得当日的年月日时分秒
  var tomorrowYear = nextDate.getFullYear();
  var tomorrowMonth = nextDate.getMonth() + 1;//getMonth只有0-11，比较特殊
  var tomorrowDay = nextDate.getDate();
  var tomorrowTime = tomorrowYear + "-" + tomorrowMonth + "-" + tomorrowDay;
  var tomorrowTime5 = Date.parse(new Date(tomorrowTime + " 05:00:00"));
  var tomorrowTime8 = Date.parse(new Date(tomorrowTime + " 08:00:00"));
  return {
    tomorrowTime5: tomorrowTime5,
    tomorrowTime8: tomorrowTime8
  }
}
// x为秒数
function leftTimeShow(x) {
  var minUnit = 60;
  var hourUnit = minUnit * 60;
  var dayUnit = hourUnit * 24;
  var days = 0, hours = 0, mins = 0, seconds = 0;
  //console.log(int(seconds/DAY))
  if (x < 60) {
    days = 0;
    hours = 0;
    mins = 0;
    seconds = x;
  } else if (x <= hourUnit) {
    days = 0;
    hours = 0;
    mins = parseInt(x / minUnit);
    seconds = x % minUnit;
  } else if (x < dayUnit) {
    days = 0;
    hours = parseInt(x / hourUnit);
    var leftSeconds = x % hourUnit;
    mins = parseInt(leftSeconds / minUnit);
    seconds = leftSeconds % minUnit;
  }
  return {
    days: checkTime(days),
    hours: checkTime(hours),
    mins: checkTime(mins),
    seconds: checkTime(seconds)
  }

}
module.exports = {
  formatTime: formatTime,
  leftTimer: leftTimer,//倒计时
  nightTime: nightTime,//系统结算时间戳
  tomorrowHour58: tomorrowHour58,//明早5-8点打卡时间戳
  endTime:endTime,//明天具体的时间戳
  leftTimeShow:leftTimeShow
}
