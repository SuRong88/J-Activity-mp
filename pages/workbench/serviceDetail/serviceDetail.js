const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        index: '', //职位详情 当前服务商下标
        positionId: '', //职位id
        activityId: '', //活动id
        info: null, //服务商信息
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let index = query.index
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let info = prevPage.data.jobInfo.apply_list[index]
    let positionId = prevPage.data.id //职位id
    let activityId = prevPage.data.activityId //活动id
    this.setData({
        index: index,
        info: info,
        positionId: positionId,
        activityId: activityId
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 拒绝
VM.refuseHandle = function() {
    let applyId = this.data.info.apply_id
    Req.request('refuseApply', {
        apply_id: applyId
    }, {
        method: 'put'
    }, (res) => {
        util.Toast('已成功拒绝')
        this.data.info.is_approve = 2
        this.setData({
            info: this.data.info
        })
        // 更新上一页的数据，设置为“已选定”
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        let tar = 'jobInfo.apply_list[' + this.data.index + '].is_approve'
        prevPage.setData({
            [tar]: 2
        })
    })
}
// 派单
VM.sendHandle = function() {
    let positionId = this.data.positionId
    let activityId = this.data.activityId
    let applyId = this.data.info.apply_id
    let applyIds = []
    applyIds.push(applyId)
    Req.request('dispatch', {
        apply_ids: JSON.stringify(applyIds),
        activity_id: activityId,
        position_id: positionId
    }, {
        method: 'put'
    }, (res) => {
        util.Toast('已成功派单')
        this.data.info.is_approve = 1
        this.setData({
            info: this.data.info
        })
        // 更新上一页的数据，设置为“已选定”
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        let tar = 'jobInfo.apply_list[' + this.data.index + '].is_approve'
        prevPage.setData({
            [tar]: 1
        })
    })
}
Page(VM)
