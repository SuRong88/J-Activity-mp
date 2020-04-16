const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showMask: false
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
VM.selectAddress = function() {}
VM.deleteAddress = function() {
    this.setData({
        showMask: true
    })
}
VM.editAddress = function() {

}
VM.confirmDelete = function() {

}
VM.cancelDelete = function() {
    this.setData({
        showMask: false
    })
}
Page(VM)
