//import unit from '../cost/cost.js'
import unit from '../../utils/util.js'

Page({
  // 登录
  onLoad: function (res) {
    console.log(res, 'login')
    var self = this
    getApp().getLoginKey(function (token) {
      wx.request({
        url: unit.getUrl('/recharge/recharge_list'),
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "AppletToken " + token
        },
        success: function (res) {
          console.log(res, 'test')
          var data = res.data.data
          // data =[
          //   {
          //     "status_desc": "充值中",
          //     "created": "2017.11.15 03:45",
          //     "recharge_money": 2970,
          //     "id": 2,
          //     "desc": "话费30元（13212345688）"
          //   },
          //   {
          //     "status_desc": "11",
          //     "created": "2017.11.15 03:45",
          //     "recharge_money": 2970,
          //     "id": 2,
          //     "desc": "话费30元（13212345688）"
          //   }
          // ]

          self.setData({
            list: data
          })
        },
        fail: function (err) {
          //console.log(err)
        }
      })
    })
  },



})

