const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        feedback: ''
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
        feedback: e.detail.value.trim()
    });
}
// 提交
VM.submitFeedback = function() {
    if (formcheck.check_null(this.data.feedback)) {
        return util.Toast('请输入您的反馈')
    }
    Req.request('submitFeedback', {
        content: this.data.feedback
    }, {
        method: 'post'
    }, res => {
        util.Toast('提交成功')
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}
Page(VM)
