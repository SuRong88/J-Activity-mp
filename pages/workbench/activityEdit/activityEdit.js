const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        startDate:'2020-01-02',
        endDate:'2020-04-02'
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
VM.startDateChange = function(e){
   	this.setData({startDate: e.detail.value});
}
VM.endDateChange = function(e){
   	this.setData({endDate: e.detail.value});
}
Page(VM)
