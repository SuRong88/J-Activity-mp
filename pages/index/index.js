const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const util = require('../../utils/util.js');
const base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {}
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    // util.showModal('您确定移除该服务商吗？', '', true, '取消', '移除', ()=>{},()=>{})
    // setTimeout(()=>{
    //     wx.navigateTo({
    //         url:'/pages/test/test'
    //     })
    // },2000)
    // util.errorToast('错误');
    // setTimeout(() => {
    //     util.successToast('成功')
    // }, 2000)
    // setTimeout(() => {
    //     util.sadToast('好伤心')
    // }, 4000)
}
VM.onLoad = function(query) {
    this.init()
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
