const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showQrcode: false,
        // 服务商id
        id: '',
        // 是否已添加为私有   -1不显示 0否 1是
        status: -1,
        index: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    console.log(query.id);
    this.setData({
        id: query.id,
        status: query.status,
        index: query.index
    })
    Req.request('getServiceDetail', {
        user_id: query.id
    }, {
        method: 'get'
    }, res => {
        this.setData({
            detail: res.data,
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 添加为私有服务商
VM.addPrivate = function(e) {
    Req.request('addPrivate', {
        user_id: this.data.id
    }, {
        method: 'post'
    }, res => {
        util.Toast('添加成功')
        this.setData({
            status: 1
        })
    })
    // 更新上一页数据
    let tar = 'list[' + this.data.index + '].private_user'
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
        [tar]: 1
    })
}
// 移除私有服务商
VM.removePrivate = function(e) {
    Req.request('addPrivate', {
        user_id: this.data.id
    }, {
        method: 'delete'
    }, res => {
        util.Toast('移除成功')
        this.setData({
            status: 0
        })
    })
    // 更新上一页数据
    let tar = 'list[' + this.data.index + '].private_user'
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
        [tar]: 0
    })
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
VM.previewImage = function(e) {
    let current = e.target.dataset.src;
    wx.previewImage({
        current: current,
        urls: [current]
    })
}
VM.onShareAppMessage = function() {
    return {
        title: "“J活动”优质活动职位等你来接单！",
        path: '/pages/resource/detail/detail?id=' + this.data.id,
        imageUrl: '/images/index/banner01.png'
    };
}
Page(VM)
