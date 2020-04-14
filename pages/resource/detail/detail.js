const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 服务商id
        id:'',
        // 1服务商角色 2商家角色
        roleType:1,
        // 是否已添加为私有 0否 1是
        status:0
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    console.log(query.id);
    this.setData({
        id:query.id,
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
VM.onShareAppMessage = function() {
    return {
        title: "分享标题",
        path: '/pages/index/index',
        imageUrl: ''
    };
}
Page(VM)
