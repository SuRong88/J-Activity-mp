const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        disabled: true,
        // 展示验证码
        showMask: false,
        tipIndex: 0,
        tips: [
            '',
            '请输入图形验证码',
            '图形验证码不正确'
        ],
        imgId: '',
        list: [],
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

    let phone = wx.getStorageSync('phone')

    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let list = prevPage.data.list
    let imgId = prevPage.data.imgId
    this.setData({
        imgId: imgId,
        list: list,
        phone: phone
    })
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
VM.changeInput = function(e) {
    let key = util.dataset(e, 'key')
    let value = e.detail.value
    if (key == 'phone') {
        this.setData({
            phone: value
        })
    } else if (key == 'code') {
        let disabled = (value.length == 6) ? false : true
        this.setData({
            code: value,
            disabled: disabled
        })
    } else {
        this.setData({
            captcha: value
        })
    }
}
// 改变图形码
VM.changeCaptcha = function() {
    this.setData({
        captchaUrl: app.getCaptcha('acceptance')
    })
}
// 折叠
VM.spreadHandle = function(e) {
    let index = util.dataset(e, 'index')
    let list = this.data.list
    list[index].spread = !list[index].spread
    this.setData({
        list: list
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
// 提交
VM.confirmHandle = function() {
    // if (formcheck.check_phone(this.data.phone)) {
    //     return util.Toast('手机号格式不正确')
    // }
    if (!formcheck.check_phone(this.data.phone)) {
        return util.Toast('手机号格式不正确')
    }
    if (this.data.disabled) {
        return false;
    }
    let list = this.data.list
    let phone = this.data.phone
    let code = this.data.code
    let imgId = this.data.imgId
    let applyList = []
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list[i].apply_list.length; j++) {
            let item = {
                apply_id: list[i].apply_list[j].apply_id,
                final_amount: list[i].apply_list[j].amount
            }
            applyList.push(item)
        }
    }
    console.log(phone, code, applyList);
    Req.request('passAcceptanceAll', {
        apply_list: JSON.stringify(applyList),
        phone: phone,
        code: code,
        enterprise_img: imgId
    }, {
        method: 'post'
    }, (res) => {
        wx.redirectTo({
            url: '/pages/workbench/publishSuccess/publishSuccess?type=0'
        })
    })
}
Page(VM)
