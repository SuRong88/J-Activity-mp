const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        name: '',
        desc: '',
        address: ''
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
VM.changeInput = function(e) {
    let key = util.dataset(e, 'key')
    if (key === 'name') {
        this.setData({
            name: e.detail.value
        })
    } else if (key === 'desc') {
        this.setData({
            desc: e.detail.value
        })
    } else {
        this.setData({
            address: e.detail.value
        })
    }
}
Page(VM)
