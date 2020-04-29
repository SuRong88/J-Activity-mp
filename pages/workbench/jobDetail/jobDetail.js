const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        id: '', //职位id
        activityId: '', //活动id
        status: 1, //职位状态 招募中1 待验收2 已完结3 已关闭4
        statusArr: ['招募中', '待验收', '已完结', '已关闭'],
        jobInfo: null,
        showMask: false,

        // 招募中
        personStatusArr: ['待选定', '已选定', '已拒绝'],
        checkedArr: [],
        checkedLength: 0, //选中人数
        checkedMaxLength: 0 //可选人数
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    console.log(query);
    this.setData({
        id: query.id,
        activityId: query.activity_id,
        status: query.status || 1,
    })
    Req.request('jobDetail', {
        activity_id: query.activity_id,
        position_id: query.id
    }, {
        method: 'get'
    }, (res) => {
        let jobInfo = res.data
        let checkedMaxLength = 0 //可选的服务商
        jobInfo.apply_list.forEach(item => {
            item.selected = false
            if (item.is_approve == 0) {
                checkedMaxLength += 1
            }
        })
        this.setData({
            jobInfo: jobInfo,
            checkedMaxLength: checkedMaxLength
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}

// 选择服务商
VM.selectPerson = function(e) {
    let index = util.dataset(e, 'index')
    let item = this.data.jobInfo.apply_list[index]
    if (item.is_approve == 0) {
        item.selected = !item.selected
        this.setData({
            jobInfo: this.data.jobInfo
        })
    } else {
        util.Toast('不可操作')
    }
}

// 确认
VM.confirmSend = function() {
    let checkedArr = []
    let applyList = this.data.jobInfo.apply_list
    applyList.forEach(item => {
        item.selected && checkedArr.push(item)
    })
    this.setData({
        showMask: true,
        checkedArr: checkedArr
    })
}

VM.cancelHandle = function() {
    this.setData({
        showMask: false
    })
}

// 确认派单
VM.confirmHandle = function() {
    console.log('确认派单');
    let applyIds = []
    let positionId = this.data.id
    let activityId = this.data.activityId
    let applyList = this.data.jobInfo.apply_list
    applyList.forEach(item => {
        item.selected && applyIds.push(item.apply_id)
    })
    if (applyIds.length <= 0) {
        return util.Toast('未勾选服务商')
    }
    Req.request('dispatch', {
        apply_ids: JSON.stringify(applyIds),
        activity_id: activityId,
        position_id: positionId
    }, {
        method: 'put'
    }, (res) => {
        util.Toast('派单成功')
        this.onLoad(query)
        this.setData({
            showMask: false
        })
    }, (err) => {
        this.setData({
            showMask: false
        })
        util.showModal('提示', err.msg, false, '', '确定')
    })
}

Page(VM)
