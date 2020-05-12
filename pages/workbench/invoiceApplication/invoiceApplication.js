const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        invoiceData: '', //发票抬头信息
        classifityList: [],
        classify_id: '', //开票类目ID
        classify_index: '',
        invoiceList: [{
                name: '增值税专用发票',
                sel: false
            },
            {
                name: '增值普通发票',
                sel: false
            }
        ],
        invoice_type: '',
        amount: '',
        addressInfo: null //收货地址信息
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
    this.init();
    this.getinvoiseSetting();
    this.getinvoiseClassity();
    base.onLoad(this)
}
VM.changeSel = function(e) {
    let index = e.currentTarget.dataset.index;
    let invoice_type = this.data.invoice_type;
    let invoiceList = this.data.invoiceList;
    for (let i in invoiceList) {
        invoiceList[i].sel = false
        if (i == index) {
            invoiceList[i].sel = true,
                invoice_type = i
        }
    }
    this.setData({
        invoiceList: invoiceList,
        invoice_type: invoice_type
    })
}
// 获取开票设置信息
VM.getinvoiseSetting = function() {
    Req.request('invoiceSetting', null, {
        method: 'get'
    }, res => {
        this.setData({
            invoiceData: res.data
        })
    })
}
// 获取开票类目
VM.getinvoiseClassity = function() {
    Req.request('invoiceClassifity', null, {
        method: 'get'
    }, res => {
        this.setData({
            classifityList: res.data
        })
    })
}
// 修改开票类型
VM.bindPickerChange = function(e) {
    let index = e.detail.value;
    let classifityList = this.data.classifityList;
    this.setData({
        classify_id: classifityList[index].id,
        classify_index: index
    })
}
// 输入
VM.changeInput = function(e) {
    this.setData({
        amount: e.detail.value
    })
}
// 提交申请
VM.submitApply = function() {
    let data = this.data
    if (formcheck.check_null(data.invoice_type)) {
        // return util.Toast('请选择发票类型')
        return util.Toast('申请信息未完善')
    }
    if (formcheck.check_null(data.classify_id)) {
        // return util.Toast('请选择开票类目')
        return util.Toast('申请信息未完善')
    }
    if (!data.addressInfo) {
        // return util.Toast('请选择收件地址')
        return util.Toast('申请信息未完善')
    }
    if (formcheck.check_null(data.amount)) {
        // return util.Toast('请输入开票金额')
        return util.Toast('申请信息未完善')
    }
    Req.request('invoiceApply', {
        classify_id: data.classify_id,
        amount: data.amount,
        contact_id: data.addressInfo.id,
        invoice_type: data.invoice_type,
    }, {
        method: 'post'
    }, res => {
        util.Toast('申请成功')
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}
Page(VM)
