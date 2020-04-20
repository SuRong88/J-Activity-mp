// pages/workbench/notify/notify.js
const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
  data: {
    number:''
  }
}
VM.init = function (query) {

  // 设置自定义头部
  util.setHeader(this);
}
VM.onLoad = function (query) {
  this.init(query)
  base.onLoad(this)
}
VM.onShareAppMessage = function () {
  return {
    title: "分享标题",
    path: '/pages/index/index',
    imageUrl: ''
  };
}
VM.getData=function(e){
  if(!e.detail.value){
     wx.showToast({
       title: '未填写充值金额',
       duration:2000,
       icon:'none'
     })
  }
  this.setData({
     number:e.detail.value
  })
}
VM.sumbit=function(){
   if(this.data.number){
      wx.showToast({
        title: '成功提交，充值中…',
        duration:2000,
        icon:'none'
      })
   }
}
Page(VM)
