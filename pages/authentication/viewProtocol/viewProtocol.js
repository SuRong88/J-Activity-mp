const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        url: '',
        baseUrl: 'https://xcxdemo2.mrxdtech.com/qys_sdk/view.html?contractId=',
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    // 判断合同是否已签署
    Req.request('getContractStatus', null, {
        method: 'get'
    }, res => {
        console.log(res);
        let inf = res.data
        if (inf.is_sign == 1) { // 已签署
            this.setData({
                url: this.data.baseUrl + inf.contract_id + '&mobile=' + inf.phone
            })
        } else { //未签署
            wx.navigateBack({
                delta: 1
            })
        }
    }, err => {
        util.showModal('提示', err.msg || '系统出错', false, '', '确定', () => {
            wx.navigateBack({
                delta: 1
            })
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
Page(VM)
