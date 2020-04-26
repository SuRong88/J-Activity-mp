// pages/workbench/notify/notify.js
const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
  data: {
    rechargeData: {
      amount: '',
      img: '../../../images/workbench/upload-icon.png',
      isdefaultlogo: true
    }
  }
}
VM.init = function(query) {

  // 设置自定义头部
  util.setHeader(this);
}
VM.onLoad = function(query) {
  this.init(query)
  base.onLoad(this)
}
VM.onShareAppMessage = function() {
  return {
    title: "分享标题",
    path: '/pages/index/index',
    imageUrl: ''
  };
}
//监听金额
VM.changeamount = function(e) {
  this.setData({
    ['rechargeData.amount']: e.detail.value,
  })
}
//监听图片上传
VM.changeImg = function() {
  let that = this;
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success(res) {
      console.log(res)
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths[0]
      that.setData({
        ['rechargeData.img']: tempFilePaths,
        ['rechargeData.isdefaultlogo']: false,
      })
    }
  })

}

// VM.getData=function(e){
//   if(!e.detail.value){
//      wx.showToast({
//        title: '未填写充值金额',
//        duration:2000,
//        icon:'none'
//      })
//   }
//   this.setData({
//      number:e.detail.value
//   })
// }
VM.sumbit = function() {
  let data = this.data.rechargeData
  wx.showToast({
    title: '成功提交，充值中…',
    duration: 2000,
    icon: 'none'
  })
  console.log(data.amount)
  if (!formcheck.check_int2(data.amount)) {
    util.Toast('请输入正整数')
  } else if (data.isdefaultlogo) {
    util.Toast('请上传凭证')
  } else {
    Req.request('recharge', {
      amount: data.amount,
      evidence_img: data.img
    }, {
        method: 'post'
      }, res => {
        console.log(res)
        // util.Toast('保存成功')
        // setTimeout(() => {
        //   wx.navigateBack({})     //返回上一级      
        // }, 1000)
      }, err => {
        console.log(err)
      })
  }
}

Page(VM)