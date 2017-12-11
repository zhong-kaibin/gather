// pages/my-mark/my-mark.js
const app= getApp();
import urlObj from '../../utils/url.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    palneIcon: "../resource/images/plane.png",
    signIcon:"../resource/images/signIcon.png",
    arrs:[],
    pageNo:1,
    pageSize:20
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var self =this;
    var thisPageSize = self.data.arrs.length % self.data.pageSize;
    var num = parseInt(self.data.arrs.length / self.data.pageSize);
    if (self.data.arrs.length == 0) {
      self.setData({
        pageNo: 1
      })
    } else if (thisPageSize == 0) {
      self.setData({
        pageNo: num
      })
    } else {
      self.setData({
        pageNo: num + 1
      })
    };
    this.setData({
      arrs:[],

    })
    app.getToken(function(token){
      wx.request({
        url: urlObj.url.httpSrc + "/activity/get_up/total_datas" + urlObj.url.params,
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {},
        dataType: "json",
        success: function (res) {
          self.setData({
            income: (res.data.data.income /100).toFixed(2),
            recharge: (res.data.data.recharge/100).toFixed(2),
            sign_times: res.data.data.sign_times.toFixed(2)
          })
        }
      })
    })
    self.getJson();
    
  },
  getJson:function(){
    var self =this;  
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/activity/get_up/join_list" + urlObj.url.params,
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          page_no: self.data.pageNo,
          page_size: self.data.pageSize
        },
        dataType: "json",
        success: function (res) {
          if (res.data.code == 0) {
            // wx.hideLoading();
            if (res.data.data.length > 0) {
              self.setData({
                arrs: self.data.arrs.concat(res.data.data),
                hasMoreData: true,
                pageNo: self.data.pageNo + 1
              })
            }else if (self.data.pageNo==1){
              self.setData({
                hasMoreData:false,
                pageNo:1
              })           
            } else{
              self.setData({
                hasMoreData: false,
                pageNo: self.data.pageNo - 1
              })
            }
          }
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var self = this;
    wx.stopPullDownRefresh()
    this.setData({
      pageNo: 1,
      pageSize: self.data.pageSize,
      hasMoreData: true,
      arrs: []
    })
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    console.log("触底了")
    if (self.data.hasMoreData) {
      self.getJson()
    } else {
      wx.showToast({
        title: '数据加载完毕'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})