const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        url: '',
        baseUrl: 'https://xcxdemo2.mrxdtech.com/qys_sdk/sign.html?contractId=',
        contractId: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let userInfo = query.userInfo
    console.log(query);
    console.log(JSON.parse(userInfo).mobile);
    console.log(userInfo);
    this.setData({
        url: this.data.baseUrl + query.contractId + '&phone=' + JSON.parse(userInfo).mobile + '&userInfo=' + userInfo
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
VM.bindGetMsg = function(e) {
    console.log(e)
}
VM.test = function() {
    console.log('test');
}
Page(VM)
