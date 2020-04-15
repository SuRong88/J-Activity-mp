const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        txt:''
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
VM.changeTxt = function(e) {
    this.setData({
        txt: e.detail.value.trim()
    });
}
// 提交
VM.submitFeedback = function() {
    
}
Page(VM)
