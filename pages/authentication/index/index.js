const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {}
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    util.showModal('提示', '服务器出错', false, '', '确定')
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
Page(VM)
