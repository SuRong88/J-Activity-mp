const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        navIndex: 0,
        showMask: false
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
VM.switchNav = function(e) {
    this.setData({
        navIndex: util.dataset(e, 'index')
    })
}
// 关闭职位
VM.confirmClose = function() {

}
VM.cancelClose = function() {
    this.setData({
        showMask: false
    })
}
Page(VM)
