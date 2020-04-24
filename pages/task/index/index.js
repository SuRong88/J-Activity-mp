const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 任务状态
        type: 0,
        statusArr: ['待工作', '待验收', '已完结', '未选中', '已关闭'],
        classArr: ['wait', 'wait', 'close', 'unselect', 'close'],
        // pagination
        current: 0,
        rownum: 4,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let type = query.type || 0
    this.setData({
        type: type
    })
    this.getList(type);
}
// 更新页面数据
VM.onShow = function() {
    this.setData({
        current: 0,
        rownum: 4,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false
    })
    wx.nextTick(() => {
        this.getList(this.data.type)
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 获取订单
VM.getList = function(type) {
    if (this.data.current >= this.data.total_page) {
        return util.Toast('没有更多数据了')
    }
    Req.request('getTaskList', {
        page: this.data.current + 1,
        rownum: this.data.rownum,
        status: type
    }, {
        method: 'get'
    }, (res) => {
        let data = res.data
        let pagination = res.data.pagination
        let list = this.data.list
        this.setData({
            list: list.concat(data.list),
            current: pagination.current * 1,
            rownum: pagination.rownum * 1,
            total: pagination.total * 1,
            total_page: pagination.total_page * 1,
            isEmpty: pagination.total * 1 <= 0 ? true : false
        })
    })
}
// 切换状态
VM.changeStatus = function(e) {
    let type = util.dataset(e, 'type')
    if (type == this.data.type) {
        return false;
    }
    this.setData({
        // 任务状态
        type: type,
        // pagination
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false
    })
    wx.nextTick(() => {
        this.getList(this.data.type)
    })
}
// 确认任务
VM.confirmTask = function(e) {
    let index = util.dataset(e, 'index')
    let id = util.dataset(e, 'id')
    let tar = 'list[' + index + '].status'
    Req.request('changeJobStatus', {
        apply_id: id,
        status: 2
    }, {
        method: 'put'
    }, (res) => {
        util.Toast('确认成功')
        this.setData({
            [tar]: 2
        })
    })
}
// 结算验收
// VM.finishTask = function(e) {
//     let id = util.dataset(e, 'id')
//     Req.request('getTaskList', {
//         user_id: app.globalData.myInfo.id,
//         apply_id: ,
//         status:
//     }, {
//         method: 'get'
//     }, (res) => {

//     })
// }
VM.onReachBottom = function() {
    this.getList(this.data.type)
}
Page(VM)
