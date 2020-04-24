const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showQrcode: false,
        showLogout: false,
        userInfo: null,
        avatarUrl: ''
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        tabbarType: app.globalData.roleType
    })
    // 要在app.js里面请求获取用户信息 
    Req.request('getMyInfo', null, {
        method: 'get'
    }, res => {
        this.setData({
            userInfo: res.data,
            // 微信头像
            avatarUrl: app.globalData.userInfo ? app.globalData.userInfo.avatarUrl : ''
        })
    })
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
VM.onShow = function() {
    // “完善信息”修改信息之后 更新页面数据
    this.init()
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
    let current = e.target.dataset.src;
    wx.previewImage({
        current: current,
        urls: [current]
    })
}
Page(VM)
