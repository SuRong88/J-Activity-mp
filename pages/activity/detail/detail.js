const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
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
    Req.request('getActivityDetail', {
        activity_id: id
    }, {
        method: 'get'
    }, (res) => {
        this.setData({
            id: id,
            detail: res.data
        })
    })
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
    Req.request('getActivityJobList', {
        activity_id: this.data.id
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
Page(VM)
