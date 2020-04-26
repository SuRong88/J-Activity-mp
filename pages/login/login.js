const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const util = require('../../utils/util.js');
const base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        loading: false,
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
                txt: "用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议用户服务协议"
            },
            {
                title: '《隐私协议》',
                txt: "隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议隐私协议"
            }
        ],
        tipIndex: 0,
        tips: [
            '',
            '请输入图形验证码',
            '图形验证码不正确'
        ],
        captchaUrl: '',
        phone: '',
        code: '', //
        captcha: '', //
        // 倒计时
        phone_code_text: "发送验证码",
        phone_code_class: "",
        phone_code_flag: false
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
    if (this.data.phone_code_flag) {
        return util.Toast('请不要频繁操作')
    }
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    let captchaUrl = app.getCaptcha()
    this.setData({
        show1: true,
        show2: false,
        tipIndex: 0,
        captchaUrl: captchaUrl
    })
    // todo
}
// 改变图形码
VM.changeCaptcha = function() {
    this.setData({
        captchaUrl: app.getCaptcha()
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
        code: this.data.captcha
    }, {
        method: 'get'
    }, res => {
        this.setData({
            show1: false,
            captcha: '',
        })
        util.setDowntime(this)
    }, err => {
        this.setData({
            captchaUrl: app.getCaptcha(),
            tipIndex: 2
        })
    })
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
    Req.request('login', {
        phone: this.data.phone,
        code: this.data.code,
        sign: 'login'
    }, {
        method: 'get'
    }, res => {
        console.log(res);
        let data = res.data
        wx.setStorageSync('token', data.token)
        app.globalData.roleType = data.identity * 1
        util.Toast('登录成功')
        setTimeout(() => {
            wx.reLaunch({
                url: '/pages/index/index'
            })
        }, 1500)
    }, err => {
        return util.Toast(err.data.msg || '验证码不正确')
    })
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
