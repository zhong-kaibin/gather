import unit from '../../utils/url.js'

// var id;   
Page({
  onLoad: function (res) {
    var self = this
    wx.request({
      url: unit.getUrl('/other/index'),
      success: function (res) {
        console.log(res, 'index')
        self.setData({
          list: res.data.data.recharge_items,
          //market_price: res.data.data.recharge_items[self.data.moneyIndex ].market_price
        })
      }
    })

  },


  data: {
    // list:[],
    moneyIndex: -1,
    mobile_num: '',
    correct: false,
    consolebutton: false,
    cost:false,
    //id: ' '
  },

  // 选择面值
  tapListEvent: function (e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      moneyIndex: index,
      cost:true,
      consolebutton:true,
      market_price: '0',
    })

  },
  
  formId: function (e) {
    console.log(e)
    var formId = e.detail.formId
    var self = this
    
    getApp().getLoginKey(function (token) {
      wx.request({
        url: unit.getUrl('/other/collect_form_id'),
        data: {
          //"form_id": "00000"
          form_id: formId
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "AppletToken " + token
        },
        
        success: function (res) {
          console.log(res, 'froms')
        },
        fail: function (err) {
          //console.log(err)
        }
      })
    })

  },
  //电话号码
  phone_number: function (event) {
    // console.log(event)
    var mobile = event.detail.value
    var self = this

    this.setData({
      mobile_num: mobile
    })
    //return false;
    console.log(mobile, 'mobile==')
    if (mobile.length == 11) {
      wx.request({
        url: unit.getUrl('/other/query_recharge_infos'),
        data: {
          phone: self.data.mobile_num
        },
        success: function (res) {
          self.setData({
            list: res.data.data.recharge_items
          })

        }
      })
      // 手机号码归属地
      wx.request({
        url: unit.getUrl('/other/query_phone_place'),
        data: {
          phone: this.data.mobile_num
          // phone: this.data.mobile_num
        },
        success: function (res) {
          console.log(res, '000')
          if (res.data.data.info !== '') {
            var name = res.data.data.info

            self.setData({
              operator: res.data.data.info,
              correct: true,
              query_phone_place:true,
              moneyIndex:0,
              consolebutton: true,
              cost:true
              // list: res.data.data.recharge_items,
            })

          } else {
            wx.showToast({
              title: '手机号有误！',
              icon: 'success',
              duration: 1500
            })
            self.setData({
              //cost: false,
              
            })
          }
        },
        fail: function (err) {
          this.operator();
          console.log(err + '获取归属地失败')
        }
      })
    } else {
      this.setData({
        operator: '',
        correct: false,
        cost:false,
        consolebutton: false,
      })
    }
  },


  //充值按钮
  paying: function () {
    if (!this.data.correct) {
      wx.showToast({
        title: '请输入正确手机',
      })
      return
    }
    var mobile = this.data.mobile_num
    //var id = this.data.id
    var self = this

    wx.showLoading()
    if (mobile.length == 11) {
      getApp().getLoginKey(function (token) {
        console.log(token, '=====token======')
        
        wx.request({
          url: unit.getUrl('/recharge/pre_order/wftpay'),
          method: 'POST',
          data: {
            phone: self.data.mobile_num,
            goods_id: self.data.list[self.data.moneyIndex].id
          },
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "AppletToken " + token
          },
          success: function (res) {
            console.log(res, 'paly-----------')

            if (res.data.code == 0) {
              wx.hideLoading()
              var pay_info = res.data.data.pay_info
              try {
                pay_info = JSON.parse(pay_info)
              }
              catch (e) { }
              console.log(pay_info, '==================')
              wx.requestPayment({
                timeStamp: pay_info.timeStamp,
                nonceStr: pay_info.nonceStr,
                package: pay_info.package,
                signType: pay_info.signType,
                paySign: pay_info.paySign,
                success: function (res) {
                  wx.showToast({
                    title: '充值成功',
                  })
                },
                fail: function (err) {
                  wx.showToast({
                    title: '支付失败',
                  })
                }
              })
            } else {
              wx.showToast({
                //title: res.data.msg,
                title: '充值失败',
              })
            }

          }, fail: function (err) {
            wx.showToast({
                title: '充值失败',
              })
            console.log(err)
          }
        })
      })

    }

  },

  // 充值记录按钮
  skips: function () {
    wx.navigateTo({
      url: '/pages/record/record'
    })
  },

 
 // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '话费直充',
      path: '/pages/cost/cost',
    }
  }
})



