const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
      type: '' // 编辑还是添加操作

    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
  console.log(query)
  this.setData({
    type: query.type
  })
    this.init()
    base.onLoad(this)
}
Page(VM)
