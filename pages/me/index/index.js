const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showQrcode: false,
        showLogout: false
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
// 弹窗
VM.showMask = function(e) {
    let key = util.dataset(e, 'key')
    if (key == 'qrcode') {
        this.setData({
            showQrcode: true
        })
    } else {
        this.setData({
            showLogout: true
        })
    }
}
VM.closeQrcode = function() {
    this.setData({
        showQrcode: false
    })
}
VM.confirmLogout = function() {

}
VM.cancelLogout = function() {
    this.setData({
        showLogout: false
    })
}
// 预览联系客服二维码
// 提示 ：经测试，当预览的是本地的图片时，图片不能加载，只有来自于网上或者是通过手机相册选择、拍照获取的图片才可以成功显示，并且只能扫描小程序码
VM.previewImage = function(e) {
    let current = e.target.dataset.src; //这里获取到的是一张本地的图片
    wx.previewImage({
        current: current, //需要预览的图片链接列表
        urls: [current] //当前显示图片的链接
    })
}
Page(VM)
