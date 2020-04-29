const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        id: '', //活动报名id
        reason: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        id: query.id
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 输入
VM.changeTxt = function(e) {
    this.setData({
        reason: e.detail.value.trim()
    });
}
VM.submitReject = function() {
    let id = this.data.id
    let reason = this.data.reason
    if (formcheck.check_null(reason)) {
        return util.Toast('请输入驳回原因')
    }
    Req.request('refuseAcceptance', {
        apply_id: id,
        refuse_reason: reason
    }, {
        method: 'put'
    }, (res) => {
        util.Toast('提交成功')
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}
Page(VM)
