const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        prevData: null, //上个页面的data

        // 展示验证码
        showMask: false,
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

    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let prevData = prevPage.data
    this.setData({
        prevData: prevData
    })
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
// 输入
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
// 发送验证码
VM.sendCode = function(e) {
    if (this.data.phone_code_flag) {
        return util.Toast('请不要频繁操作')
    }
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    let captchaUrl = app.getCaptcha('acceptance')
    this.setData({
        showMask: true,
        tipIndex: 0,
        captchaUrl: captchaUrl
    })
    // todo
}
// 改变图形码
VM.changeCaptcha = function() {
    this.setData({
        captchaUrl: app.getCaptcha('acceptance')
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
        sign: 'acceptance'
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
            captchaUrl: app.getCaptcha('acceptance'),
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
VM.submitHandle = function() {
    let data = this.data
    let prevData = this.data.prevData
    Req.request('passAcceptance', {
        apply_id: prevData.applyId,
        final_amount: prevData.amount,
        enterprise_img: prevData.imgId,
        phone: data.phone,
        code: data.code
    }, {
        method: 'put'
    }, (res) => {
        util.Toast('提交成功')
        setTimeout(() => {
            wx.navigateBack({
                delta: 2
            })
        }, 1500)
    }, (err) => {
        util.Toast(err.msg)
    })
}
Page(VM)
