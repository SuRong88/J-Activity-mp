const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
  data: {
    telephone: '',
    descript: ''
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
VM.changeData = function (e) {
  console.log(e.detail.value);
  this.setData({
    telephone: e.detail.value
  })
  if (this.data.telephone === '') {
    wx.showToast({
      title: '电话号码不能为空',
      icon: 'none',
      duration: 2000


    })
  }

}
VM.getDescript = function (e) {
  console.log(e.detail.value)
  this.setData({
    descript: e.detail.value
  })
  if (this.data.descript && this.data.descript.length > 20) {
    wx.showToast({
      title: '描述不能多于20个字',
      duration: 2000,
      icon: 'none'

    })
  }

}
VM.setDetail = function () {
  if (this.data.telephone && this.data.descript) {
    wx.showToast({
      title: '成功保存',
      duration: 2000,
      icon: 'none'
    })
  }


}
Page(VM)
