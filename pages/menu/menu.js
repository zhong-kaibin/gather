// pages/menu/menu.js
import urlObj from "../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imgSrcs: ["../../resource/images/early.jpg", "../../resource/images/话费砍价.jpg","../../resource/images/群约.jpg"],
    imgSrc: "../../resource/images/early.jpg"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var self = this;
      //getApp().getToken1()
      wx.request({
        url: urlObj.url.httpSrc + "/other/index" + urlObj.url.params,
        method:"GET",
        header:{
          "content-type":"application/json",
          'Authorization': 'AppletToken ' + getApp().token
        },
        dataType:"json",
        data:{},
        success:function(res){
          if(res.data.code==0)         
          // res.data.data[0].data.path = '../group-sign/index/index';
          // res.data.data[1].data.path = '../early-sign/index/index';          
          self.setData({
            arrs:res.data.data
          })
          wx.hideLoading()
        }
      })
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
    this.onLoad();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toGroupSign:function(){
    wx.navigateTo({
      url: '../group-sign/index/index',
    })
  },
  toearlySign:function(e){
    var path = e.currentTarget.dataset.url;
    var type = e.currentTarget.dataset.type;
    var opt = e.currentTarget.dataset.obj;
    // console.log(e)
    if(type==0){
      wx.navigateTo({
      // url: '../early-sign/index/index',
      //url: '../group-sign/index/index',
      // url: '../mobile-recharge/cost/cost'
      url:path
    })
    }else{
      wx.navigateToMiniProgram({
        appId: opt.appid,
        path: opt.path,
        extraData: {

        },
        envVersion: 'release',
        success(res) {
          console.log(res, "nav成功")
          // 打开成功
        },
        fail(res) {
          console.log(res, "nav失败")
        }
      })
    }
    
    
  }
})