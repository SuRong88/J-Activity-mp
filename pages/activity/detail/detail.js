const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        tabIndex: 0
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

// tab
VM.switchTab = function(e) {
    let index = util.dataset(e, 'index') * 1
    this.setData({
        tabIndex: index
    })
}
Page(VM)
