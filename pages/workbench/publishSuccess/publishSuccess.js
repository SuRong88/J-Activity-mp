const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        titleIndex: 0,
        titleArr: ['验收成功', '派单成功', '发布成功'],
        tipArr: ['验收成功！', '派单成功！', '发布成功！'],
        showShare: false, //分享
        showPoster: false //海报
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
// 展示分享mask
VM.showShareMask = function() {
    this.setData({
        showShare: true
    })
}
// 生成海报mask
VM.showPosterMask = function() {
    this.setData({
        showShare: false,
        showPoster: true
    })
}
VM.closeMask = function() {
    this.setData({
        showShare: false,
        showPoster: false
    })
}
// 保存海报至相册
VM.savePoster = function() {}
Page(VM)
