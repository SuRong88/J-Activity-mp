const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showMask: false,
        // 表单
        captchaUrl: '',
        phone: '15015050896',
        code: '',
        bankCard: '621700322101716',
        captcha: '',
        tipIndex: 0,
        tips: [
            '',
            '请输入图形验证码',
            '图形验证码不正确'
        ],
        // 倒计时
        phone_code_text: "发送验证码",
        phone_code_class: "",
        phone_code_flag: false
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
    if (this.data.phone_code_flag) {
        return util.Toast('请不要频繁操作')
    }
    if (!formcheck.check_bankCard(this.data.bankCard)) {
        return util.Toast('银行卡号格式不正确')
    }
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    let captchaUrl = app.getCaptcha('change')
    this.setData({
        showMask: true,
        tipIndex: 0,
        captchaUrl: captchaUrl
    })
}
// 改变图形码
VM.changeCaptcha = function() {
    this.setData({
        captchaUrl: app.getCaptcha('change')
    })
}
// 确认图形码
VM.confirmCaptcha = function(e) {
    if (this.data.phone_code_flag) {
        return util.Toast('请不要频繁操作')
    }
    if (formcheck.check_null(this.data.captcha)) {
        return this.setData({
            tipIndex: 1
        })
    }
    Req.request('sendCode', {
        phone: this.data.phone,
        code: this.data.captcha,
        sign: 'change'
    }, {
        method: 'get'
    }, res => {
        this.setData({
            showMask: false,
            captcha: '',
        })
        util.setDowntime(this)
    }, err => {
        this.setData({
            captchaUrl: app.getCaptcha('change'),
            tipIndex: 2
        })
    })
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
    if (!formcheck.check_bankCard(this.data.bankCard)) {
        return util.Toast('银行卡号格式不正确')
    }
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    if (!formcheck.check_code(this.data.code)) {
        return util.Toast('验证码格式不正确')
    }
    // 修改
    Req.request('editBankCard', {
        bank_num: this.data.bankCard,
        phone: this.data.phone,
        code: this.data.code
    }, {
        method: 'post'
    }, res => {
        util.Toast('修改成功')
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 2000)
    }, err => {
        util.Toast(err.msg)
    })
}
Page(VM)
