const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showMask:true,
        //认证通过
        pass: true,
        // 表单
        name: '',
        phone: '',
        idCard: '',
        bankCard: ''
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
// 输入
VM.changeInput = function(e) {
    let key = util.dataset(e, 'key')
    if (key == 'name') {
        this.setData({
            name: e.detail.value
        })
    } else if (key == 'phone') {
        this.setData({
            phone: e.detail.value
        })
    } else if (key == 'idCard') {
        this.setData({
            idCard: e.detail.value
        })
    } else {
        this.setData({
            bankCard: e.detail.value
        })
    }
}
Page(VM)
