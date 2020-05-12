const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
  data: {
    financeArr: [
      {
        name: '充值',
        url: '/images/workbench/icon1.png'
      },
      {
        name: '充值记录',
        url: '/images/workbench/icon2.png'
      },
      {
        name: '充值账户明细',
        url: '/images/workbench/icon3.png'
      }
    ]
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
Page(VM)
