const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
var WxParse = require('../../../wxParse/wxParse');
const VM = {
    data: {
        // 检查签署状态
        checkSign: true,
        //输入框
        disabled: false,
        showMask: false,
        // 展示协议
        showAgreement: false,
        // 展示协议下标
        agreementIndex: 0,
        agreementList: [{
                title: '《用户服务协议》',
                txt: ""
            },
            {
                title: '《隐私协议》',
                txt: ""
            }
        ],
        // isAuth: 0,
        //认证通过
        pass: false,
        // 表单
        name: '',
        phone: '',
        idCard: '',
        bankCard: '',
        //合同id
        contractId: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    // status是由“签署协议”页面进来才有的,此时需要删除页面栈的上一页
    if (query.status) {
        // 删除页面栈的上一页
        // let pages = getCurrentPages()
        // pages = []
        // console.log(pages);
        // pages.splice(pages.length - 2, 1)
        // console.log(pages);
    } else {
        // 判断合同是否已签署
        Req.request('getContractStatus', null, {
            method: 'get'
        }, (res) => {
            console.log(res);
            let inf = res.data
            if (inf.is_sign == 1) { // 已签署
                this.setData({
                    checkSign: false,
                    pass: true,
                    disabled: true,
                    // 表单
                    name: inf.name,
                    phone: inf.auth_phone,
                    idCard: inf.id_card,
                })
            } else { //未签署
                this.setData({
                    checkSign: false
                })
            }
        })
    }
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
    console.log(query);
    if (query.status && query.status == 'success') {
        let authInfo = app.globalData.authInfo
        this.setData({
            showMask: true,
            checkSign: false,
            pass: true,
            disabled: true,
            // 表单
            name: decodeURIComponent(query.username),
            phone: query.mobile,
            idCard: query.cardNo,
            bankCard: authInfo.bankCard
        })
    }
    if (query.status && query.status == 'fail') {
        let authInfo = app.globalData.authInfo
        this.setData({
            showMask: true,
            pass: false,
            checkSign: false,
            // 表单
            name: authInfo.name,
            phone: authInfo.phone,
            idCard: authInfo.idCard,
            bankCard: authInfo.bankCard,
        })
    }
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
VM.authHandle = function() {
    let data = this.data
    if (formcheck.check_null(data.name)) {
        return util.Toast('请填写姓名')
    }
    if (formcheck.check_null(data.phone)) {
        return util.Toast('请填写手机号')
    }
    if (formcheck.check_null(data.idCard)) {
        return util.Toast('请填写身份证号')
    }
    if (formcheck.check_null(data.bankCard)) {
        return util.Toast('请填写银行卡号')
    }
    if (!formcheck.check_cn_name(data.name)) {
        return util.Toast('姓名格式有误')
    }
    if (!formcheck.check_phone(data.phone)) {
        return util.Toast('手机号格式有误')
    }
    if (!formcheck.check_idcard(data.idCard)) {
        return util.Toast('身份证号格式有误')
    }
    if (!formcheck.check_bankCard(data.bankCard)) {
        return util.Toast('银行卡号格式有误')
    }
    // 获取合同id
    Req.request('getContract', {
        name: data.name,
        phone: data.phone,
    }, {
        method: 'post'
    }, (res) => {
        if (!res.data.contract_id) {
            return util.Toast('生成合同失败')
        }
        this.setData({
            contractId: res.data.contract_id
        })
        let autoInfo = {
            name: data.name,
            phone: data.phone,
            idCard: data.idCard,
            bankCard: data.bankCard,
        }
        app.globalData.authInfo = autoInfo
        wx.redirectTo({
            url: "/pages/authentication/auth/auth?contractId=" + data.contractId + "&phone=" +
                data.phone
        })
    })
}
// 实名认证弹窗-确定
VM.confirmHandle = function() {
    // 通过
    if (this.data.pass) {
        this.submitAuthInfo()
    } else {
        this.setData({
            showMask: false,
        })
    }
}
// 实名认证弹窗-取消
VM.cancelHandle = function() {
    // 通过
    if (this.data.pass) {
        return false;
    } else {
        this.setData({
            showMask: false,
        })
    }
}
// 提交实名认证信息
VM.submitAuthInfo = function() {
    let data = this.data
    if (formcheck.check_null(data.name)) {
        return util.Toast('请填写姓名')
    }
    if (formcheck.check_null(data.phone)) {
        return util.Toast('请填写手机号')
    }
    if (formcheck.check_null(data.idCard)) {
        return util.Toast('请填写身份证号')
    }
    if (formcheck.check_null(data.bankCard)) {
        return util.Toast('请填写银行卡号')
    }
    if (!formcheck.check_cn_name(data.name)) {
        return util.Toast('姓名格式有误')
    }
    if (!formcheck.check_phone(data.phone)) {
        return util.Toast('手机号格式有误')
    }
    if (!formcheck.check_idcard(data.idCard)) {
        return util.Toast('身份证号格式有误')
    }
    if (!formcheck.check_bankCard(data.bankCard)) {
        return util.Toast('银行卡号格式有误')
    }
    Req.request('submitAuthInfo', {
        name: data.name,
        auth_phone: data.phone,
        id_card: data.idCard,
        bank_num: data.bankCard
    }, {
        method: 'post'
    }, (res) => {
        util.Toast('入驻成功')
        setTimeout(() => {
            wx.redirectTo({
                url: "/pages/authentication/index/index"
            })
        }, 1500)
    })
}
// 展示协议
VM.showAgreement = function(e) {
    let index = util.dataset(e, 'index')
    let sign = ''
    if (this.data.agreementList[index].txt != '') {
        return this.setData({
            showAgreement: true,
            agreementIndex: index
        })
    }
    if (index == 0) {
        sign = 'register_agreement'
    } else {
        sign = 'privacy_agreement'
    }
    Req.request('getAgreement', {
        sign: sign
    }, {
        method: 'get'
    }, res => {
        WxParse.wxParse('agreementTxt', 'html', res.data.content, this, 5);
        this.setData({
            showAgreement: true,
            agreementIndex: index
        })
    })
}
// 关闭协议
VM.closeAgreement = function(e) {
    this.setData({
        showAgreement: false,
    })
}
Page(VM)
