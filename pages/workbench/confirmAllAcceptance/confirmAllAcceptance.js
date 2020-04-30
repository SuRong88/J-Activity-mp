const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 展示验证码
        showMask: false,
        tipIndex: 0,
        tips: [
            '',
            '请输入图形验证码',
            '图形验证码不正确'
        ],
        phone: '15015050896',
        code: '', //
        captcha: '', //
    }
}
VM.init = function() {
    util.showModal('提示', '服务器出错', false, '', '确定')
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
// 发送验证码
VM.sendCode = function(e) {
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    this.setData({
        showMask: true,
        tipIndex: 0
    })
    // todo
}
// 确认图形码
VM.confirmCaptcha = function(e) {
    if (formcheck.check_null(this.data.captcha)) {
        return this.setData({
            tipIndex: 1
        })
    }
    // todo
}
// 取消图形码
VM.cancelCaptcha = function(e) {
    this.setData({
        showMask: false,
        captcha: ''
    })
}
Page(VM)
