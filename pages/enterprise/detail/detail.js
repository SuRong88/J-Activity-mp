const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showQrcode: false,
        // 企业id
        id: '',
        // 企业信息
        enterprise: '',
        // 活动列表
        activityList: []
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let id = query.id
    Req.request('getEnterpriseDetail', {
        enterprise_id: id
    }, {
        method: 'get'
    }, (res) => {
        let data = res.data
        this.setData({
            id: id,
            enterprise: data.enterprise,
            activityList: data.activity_list
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
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
        path: '/pages/enterprise/detail/detail?id=' + this.data.id,
        imageUrl: '/images/index/banner01.png'
    };
}
Page(VM)
