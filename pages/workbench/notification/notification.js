// pages/workbench/notify/notify.js
const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
  data: {

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
Page(VM)
