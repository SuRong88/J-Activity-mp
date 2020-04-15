const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showMask: false,
        // 表单
        phone: '15015050123',
        code: '',
        bankCard: '',
        captcha: '',
        tipIndex: 0,
        tips: [
            '',
            '请输入图形验证码',
            '图形验证码不正确'
        ]
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
    if (key == 'phone') {
        this.setData({
            phone: e.detail.value
        })
    } else if (key == 'bankCard') {
        this.setData({
            bankCard: e.detail.value
        })
    } else if (key == 'captcha') {
        this.setData({
            captcha: e.detail.value
        })
    } else {
        this.setData({
            code: e.detail.value
        })
    }
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
// 提交
VM.submitHandle = function(e) {
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    if (!formcheck.check_code(this.data.code)) {
        return util.Toast('验证码格式不正确')
    }
    // todo
}
Page(VM)
