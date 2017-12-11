//index.js
//获取应用实例
const app = getApp();
import urlObj from '../../utils/url.js';
var utils = require("../../utils/time.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    markIcon: "../resource/images/icon.png",
    paySrc: "../resource/images/pay-bg.png",
    popSrc: "../resource/images/pop.png",
    closeSrc: "../resource/images/close.png",
    earlyStar: "../resource/images/test.jpg",
    luckyStar: "../resource/images/luckyStar.jpg",
    gutsStar: "../resource/images/index-bg.png",
    // avatars: ["../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg", "../../resource/images/test.jpg"],
    earlyId: "id12",
    luckyId: "id162",
    gutsId: "id111",
    earlyTime: "06:00:01",
    luckyMoney: "131",
    gutsTabNum: "12",
    successNum: "835",
    failNum: "506",
    payStatus: false,//支付状态 0未支付，1支付,
    signStatus: false,//打卡状态
    //timeStatus:false,//时间允许打卡状态
    popStatus: false,
    popMsg: false,
    // signNum:"1356",
    days: "",
    hours: 0,
    minutes: 0,
    seconds: 0,
    motto: 'Hello World',
    userInfo: {},
    haveSHOW:true,
    today: "../resource/images/today.png",
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '正在加载...'
    })
  },
  leftTime: function () {
    var self = this;
    var leftTimeShow;
    var timeId = setInterval(function () {
      leftTimeShow = utils.leftTimeShow(self.data.remainSeconds);
      if (self.data.remainSeconds <= 0) {        
        self.setData({
          remainSeconds:0
        })
        clearInterval(timeId);
      }
      self.setData({
        payStatus: true,
        days: leftTimeShow.days,
        hours: leftTimeShow.hours,
        minutes: leftTimeShow.mins,
        seconds: leftTimeShow.seconds,
        remainSeconds: self.data.remainSeconds - 1
        // timeStatus: utils.leftTimer(endTimeSencond, endTimeSencond2).status,
      });
      
    }, 1000);
    self.setData({
      timeId: timeId
    })

  },
  getJson: function () {
    var self = this;
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/activity/get_up/index" + urlObj.url.params,
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {},
        dataType: "json",
        success: function (res) {
          wx.hideLoading()
          self.setData({
            avatars: res.data.data.avatars,
            money: res.data.data.money / 100,
            today_datas: res.data.data.today_datas,
            count: res.data.data.count,
            is_join: res.data.data.is_join,
            remainSeconds: res.data.data.remain_seconds,
            // remainSeconds: 10,
            tip: res.data.data.tip,
            is_fail_yesterday: res.data.data.is_fail_yesterday
          });
          //判断今日战况是否存在
          if (JSON.stringify(self.data.today_datas)=="{}"){
            self.setData({
              markShow:false
            })
          }else{
            self.setData({
              markShow: true
            })
          }
          //是否打卡失败
          if (self.data.is_fail_yesterday==1){
            self.setData({
              failPop:true
            })
            wx.getStorage({
              key: 'Popdate',
              success: function(res) {
                // console.log(res,"缓存")
               var nowDate =  new Date().getDate();
               if (res.data == nowDate){
                 self.setData({
                   haveSHOW:true//已经弹窗过
                 })
               }else{
                 self.setData({
                   haveSHOW: false
                 })
               }
              },
            })
          }
          //页面加载时显示倒计时
          if (self.data.remainSeconds > 0) {
            clearInterval(self.data.timeId)
            self.leftTime()
          }
        }
      })
    });
    
  },
  onShow: function () {
    var self = this;
    self.getJson();
    var currSenconds = Date.parse(new Date());

  },
  toMyMark: function () {
    wx.navigateTo({
      url: '../my-mark/my-mark',
    })
  },
  toRule: function () {
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '早起赚钱',
      path: '/pages/early-sign/index/index?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  close: function () {
    this.setData({
      // popStatus:false
      // payStatus: false
      failPop:false
    })
    wx.setStorage({
      key: "Popdate",
      data: new Date().getDate()
    })
    
  },
  toPay: function () {
    var self = this;
    var curSecond = Date.parse(new Date());
    if (curSecond > utils.nightTime().nightTime2350 && curSecond < utils.nightTime().nightTime2359) {
      wx.showToast({
        title: '系统结算时间'
      })
    } else {
      app.getToken(function (token) {
        wx.request({
          url: urlObj.url.httpSrc + "/recharge/pre_order/wxpay_getup" + urlObj.url.params,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'AppletToken ' + token
          },
          data: {
            money: 100
          },
          dataType: "json",
          success: function (res) {
            if (res.data.code == 0) {
              // var pay_info = JSON.parse(res.data.data);
              var pay_info = res.data.data;
              wx.requestPayment({
                'timeStamp': pay_info.timeStamp,
                'nonceStr': pay_info.nonceStr,
                'package': pay_info.package,
                'signType': pay_info.signType,
                'paySign': pay_info.paySign,
                'success': function (res) {
                  console.log(res)

                  wx.showToast({
                    title: '充值成功',
                  })
                  self.onShow()
                  self.setData({
                    payStatus: true
                  })

                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败',
                  })
                }
              })
            } else {
              wx.showToast({
                title: '请求失败',
              })
            }
          },
          fail: function () {

          }
        })
      })
    }
  },
  formSubmit(e){
    var formId = e.detail.formId;
    var self = this;
    var curSecond = Date.parse(new Date());
    if (curSecond > utils.nightTime().nightTime2350 && curSecond < utils.nightTime().nightTime2359) {
      wx.showToast({
        title: '系统结算时间'
      })
    } else {
      app.getToken(function (token) {
        wx.request({
          url: urlObj.url.httpSrc + "/recharge/pre_order/wxpay_getup" + urlObj.url.params,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'AppletToken ' + token
          },
          data: {
            money: 100
          },
          dataType: "json",
          success: function (res) {
            if (res.data.code == 0) {
              // var pay_info = JSON.parse(res.data.data);
              var pay_info = res.data.data;
              wx.requestPayment({
                'timeStamp': pay_info.timeStamp,
                'nonceStr': pay_info.nonceStr,
                'package': pay_info.package,
                'signType': pay_info.signType,
                'paySign': pay_info.paySign,
                'success': function (res) {
                  console.log(res)
                  getApp().sendModel(formId)
                  wx.showToast({
                    title: '充值成功',
                  })
                  self.onShow()
                  self.setData({
                    payStatus: true
                  })

                },
                'fail': function (res) {
                  wx.showToast({
                    title: '支付失败',
                  })
                }
              })
            } else {
              wx.showToast({
                title: '请求失败',
              })
            }
          },
          fail: function () {

          }
        })
      })
    }
  },
  showMsg: function () {
    var self = this;
    self.setData({
      popMsgStatus: true
    })
    var timeId = setTimeout(function () {
      self.setData({
        popMsgStatus: false
      });

    }, 2000)
  },
  toSign: function () {
    var self=this;
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/activity/get_up/sign" + urlObj.url.params,
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {},
        dataType: "json",
        success: function (res) {
          if(res.data.code==0){
            self.setData({
              signStatus: true
            })
            self.onShow()
          }else{
            // wx.showToast({
            //   title: '打卡时间错误',
            // })
            self.showMsg()
          }
        }
      })
    });
    

  },
  endChargeTime: function () {
    var curSecond = Date.parse(new Date());
    if (curSecond > utils.nightTime().nightTime2350 && curSecond < utils.nightTime().nightTime235) {
      wx.showToast({
        title: '系统结算时间'
      })
    } else {
      return true
    }

  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.getJson();
    wx.stopPullDownRefresh()
  },
})
