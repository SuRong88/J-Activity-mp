const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
  data: {
    test: false, //收货地址
    invoiceData: '', //发票抬头信息
    classifityList: [],
    classify_id: '', //开票类目ID
    classify_index:'',
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
  for (var i in invoiceList) {
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
  console.log(invoice_type)
}
// 获取开票设置信息
VM.getinvoiseSetting = function() {
  Req.request('invoiceSetting', null, {
    method: 'get'
  }, res => {
    console.log(res)
    this.setData({
      invoiceData: res.data
    })
  }, err => {
    console.log(err)
  })
}
// 获取开票类目
VM.getinvoiseClassity = function() {
  Req.request('invoiceClassifity', null, {
    method: 'get'
  }, res => {
    console.log(res)
    this.setData({
      classifityList: res.data
    })
  }, err => {
    console.log(err)
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
  console.log(classifityList[index].name)
}
Page(VM)