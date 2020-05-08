const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        info: null
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    Req.request('getAuthInfo', null, {
        method: 'get'
    }, (res) => {
        this.setData({
            info: res.data
        })
    })
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
Page(VM)
