const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showQrcode: false,
        tabIndex: 0,
        // 活动id
        id: '',
        // 活动详情
        detail: null,
        jobList: []
    }
}

VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let id = query.id
    let type = query.type || ''
    Req.request('getActivityDetail', {
        activity_id: id
    }, {
        method: 'get'
    }, (res) => {
        this.setData({
            detail: res.data
        })
    })
    if (type == 'sign') {
        this.setData({
            id: id,
            tabIndex: 1
        })
        if (this.data.jobList.length > 0) {
            return false
        }
        this.getJobList()
    } else {
        this.setData({
            id: id
        })
    }
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}

// tab
VM.switchTab = function(e) {
    let index = util.dataset(e, 'index') * 1
    this.setData({
        tabIndex: index
    })
    if (this.data.jobList.length > 0) {
        return false
    }
    // 获取活动职位列表
    index === 1 && this.getJobList()
}

// 获取活动职位列表
VM.getJobList = function() {
    let identity = ''
    if (app.globalData.isLogined) {
        identity = app.globalData.roleType
    }
    Req.request('getActivityJobList', {
        activity_id: this.data.id,
        identity: identity
    }, {
        method: 'get'
    }, (res) => {
        let jobList = res.data
        jobList.forEach(item => {
            item.spread = false
        })
        this.setData({
            jobList: jobList
        })
    })
}
// 折叠工作内容
VM.flodContent = function(e) {
    let index = util.dataset(e, 'index')
    let tar = 'jobList[' + index + '].spread'
    this.setData({
        [tar]: !this.data.jobList[index].spread
    })
}
// 取消报名
VM.cancelSign = function(e) {
    let index = util.dataset(e, 'index')
    // 职位id
    let id = util.dataset(e, 'id')
    let tar = 'jobList[' + index + '].is_apply'
    Req.request('signUpActivity', {
        activity_id: this.data.id,
        position_id: id
    }, {
        method: 'post'
    }, (res) => {
        util.Toast('取消已提交，待审核')
        this.setData({
            [tar]: 0
        })
    })

}
//确认报名 confirmSign
VM.confirmSign = function(e) {
    // 报名触发登录
    if (!app.globalData.isLogined) {
        return this.setData({
            showLogin: true
        })
    }
    let index = util.dataset(e, 'index')
    // 职位id
    let id = util.dataset(e, 'id')
    let tar = 'jobList[' + index + '].is_apply'
    Req.request('signUpActivity', {
        activity_id: this.data.id,
        position_id: id
    }, {
        method: 'post'
    }, (res) => {
        util.Toast('报名已提交，待审核')
        this.setData({
            [tar]: 1
        })
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
Page(VM)
