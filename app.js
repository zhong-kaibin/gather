//app.js
import urlObj from 'pages/utils/url.js';
App({
  onLaunch: function (options) {
    this.query = options.query;
    wx.showLoading({
      title: '正在加载..',
    })
    this.getToken1();

  },
  //强制登录
  getToken: function(cb){
    //调用登录接口获取登录凭证，进而换取用户登录态信息
    var self = this
    if (this.token){
      cb(this.token)
    }else{
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            wx.getUserInfo({
              success: function (res) {
                self.globalData.userInfo = res.userInfo
                //发起网络请求
                wx.request({
                  // url: 'https://devapi.bjpio.com/user/login',
                  // url: self.data.url + '/user/login' + urlObj.url.params,
                  url: urlObj.getUrl('/user/login'),
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  dataType: "json",
                  data: {
                    code: code,
                    rawData: res.rawData,
                    signature: res.signature,
                    encryptedData: res.encryptedData,
                    iv: res.iv  
                  },
                  success: function (res) {
                    console.log(res, "用户登录返回信息")
                    self.token = res.data.data.token                    
                    cb(res.data.data.token)
                  },
                  fail: function () {

                  },
                  complete: function () {

                  }
                })
              },
              fail: function () {
                wx.hideLoading()
                self.showAutoModel()
                console.log("获取用户信息失败")
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        },
        fail:function(res){
            console.log(res)
        }
      });
    }   
  },
  getToken1:function(){
    var self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code;
          //获取用户信息，需要用户点击允许
          wx.getUserInfo({
            success: function (res) {
              self.globalData.userInfo = res.userInfo
              // console.log(res,"用户信息")
              //发起网络请求
              wx.request({
                // url: 'https://devapi.bjpio.com/user/login',
                // url: self.data.url + '/user/login' + urlObj.url.params,
                url: urlObj.getUrl('/user/login'),
                method: "POST",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                dataType: "json",
                data: {
                  code: code,
                  rawData: res.rawData,
                  signature: res.signature,
                  encryptedData: res.encryptedData,
                  iv: res.iv
                },
                success: function (res) {
                  console.log(res, "用户登录返回信息")
                  self.token = res.data.data.token
                  // cb(res.data.data.token)
                },
                fail: function () {

                },
                complete: function () {

                }
              })
            },
            fail: function () {
              wx.hideLoading()
              // self.showAutoModel()
              console.log("获取用户信息失败")
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        console.log(res)
      }
    });
  },
  globalData: {
    userInfo: null
  },
  //提示授权
  showAutoModel: function () {
    var self = this
    wx.showModal({
      title: '用户未授权',
      content: '如需正常使用群约管家，请按确定并在授权管理中选中“用户信息”，仅是获取用户公开的信息。',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function success(res) {
              //我去，默认成功后调用获取数据？？
              var page = getCurrentPages()[0]
              page.onLoad(this.query)
            }
          });
        } else {
          self.showAutoModel()
        }
      }
    })
  },
  data:{
    // url:"https://devapi.bjpio.com",
    url:"https://api.bjpio.com",//线上
    mesId:""
  },
  sendModel: function (formId){
    var self = this;
    //发送模板消息
    this.getToken(function(token){
      wx.request({
        // url: getApp().data.url + "/other/collect_form_id" + urlObj.url.params,
        url: urlObj.getUrl('/other/collect_form_id'),
        method: "GET",
        header: {
          'content-type': 'application/json',
          'Authorization': 'AppletToken ' + self.token
        },
        data: {
          form_id: formId
        },
        dataType: "json",
        success: function (res) {
        }
      })
    })
    
  }
})