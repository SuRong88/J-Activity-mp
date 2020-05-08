const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
var WxParse = require('../../../wxParse/wxParse');
const VM = {
    data: {
        // 展示协议
        showAgreement: false,
        // 同意协议
        isAgree: false,
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
        // let tar = 'agreementList[' + index + '].txt'
        WxParse.wxParse('agreementTxt', 'html', res.data.content, this, 5);
        this.setData({
            showAgreement: true,
            agreementIndex: index,
            // [tar]: res.data.content
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
