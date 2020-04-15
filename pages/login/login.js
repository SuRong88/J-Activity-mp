const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const util = require('../../utils/util.js');
const base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        loading: true,
        // 展示验证码
        show1: false,
        // 展示协议
        show2: false,
        // 同意协议
        isAgree: false,
        // 展示协议下标
        agreementIndex: 0,
        agreementList: [{
                title: '《用户服务协议》',
                txt: "用户服务协议"
            },
            {
                title: '《隐私协议》',
                txt: "隐私协议"
            }
        ],
        tipIndex: 0,
        tips: [
            '',
            '请输入图形验证码',
            '图形验证码不正确'
        ],
        phone: '',
        code: '', //
        captcha: '', //
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    // 启动页
    setTimeout(() => {
        this.setData({
            loading: false
        })
    }, 3000)
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
// 是否同意协议
VM.agreementToggle = function(e) {
    this.setData({
        isAgree: !this.data.isAgree
    })
}
// 展示协议
VM.showAgreement = function(e) {
    let index = util.dataset(e, 'index')
    this.setData({
        show2: true,
        agreementIndex: index
    })
}
// 关闭协议
VM.closeAgreement = function(e) {
    this.setData({
        show1: false,
        show2: false,
    })
}
// 发送验证码
VM.sendCode = function(e) {
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    this.setData({
        show1: true,
        show2: false,
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
        show1: false,
        captcha: ''
    })
}
// 登录
VM.confirmLogin = function(e) {
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    if (!formcheck.check_code(this.data.code)) {
        return util.Toast('验证码格式不正确')
    }
    if (!this.data.isAgree) {
        return util.Toast('未勾选同意协议')
    }
    // todo
}
VM.inputPhone = function(e) {
    this.setData({
        phone: e.detail.value
    })
}
VM.inputCode = function(e) {
    this.setData({
        code: e.detail.value
    })
}
VM.inputCaptcha = function(e) {
    this.setData({
        captcha: e.detail.value
    })
}
Page(VM)
