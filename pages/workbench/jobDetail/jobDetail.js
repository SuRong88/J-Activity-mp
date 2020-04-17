const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 招募中1 待验收2 已完结3 已关闭4
        status: 1,
        statusArr: ['招募中', '待验收', '已完结', '已关闭'],


        showMask: true
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
VM.cancelHandle = function() {
    this.setData({
        showMask: false
    })
}
VM.confirmHandle = function() {
    console.log('确认派单');
    this.setData({
        showMask: false
    })
}
Page(VM)
