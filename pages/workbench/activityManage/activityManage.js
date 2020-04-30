const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        status: 1,
        statusArr: ['招募中', '待验收', '已完结', '已关闭'],
        // classArr: ['wait', 'wait', 'close', 'unselect', 'close'],
        // pagination
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false,

        // 关闭活动
        showMask: false, //关闭活动mask
        closeId: '', //关闭活动id
        closeIndex: '' //关闭活动index
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        status: query.status || 1
    })
    this.getList()
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 切换状态
VM.switchStatus = function(e) {
    let status = util.dataset(e, 'status')
    if (status == this.data.status) {
        return false;
    }
    this.setData({
        // 活动状态
        status: status,
        // pagination
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false
    })
    this.getList()
}
// 获取活动列表
VM.getList = function() {
    if (this.data.current >= this.data.total_page) {
        return util.Toast('没有更多数据了')
    }
    Req.request('activityList', {
        page: this.data.current + 1,
        rownum: this.data.rownum,
        status: this.data.status
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

// 关闭活动
VM.closeActivity = function(e) {
    let closeId = util.dataset(e, 'id')
    let closeIndex = util.dataset(e, 'index')
    this.setData({
        showMask: true,
        closeId: closeId,
        closeIndex: closeIndex
    })
}

// 确认关闭
VM.confirmClose = function(e) {
    let closeId = this.data.closeId
    let closeIndex = this.data.closeIndex
    Req.request('closeActivity', {
        activity_id: closeId
    }, {
        method: 'post'
    }, (res) => {
        util.Toast('关闭成功')
        let list = this.data.list
        list[closeIndex].status = 4
        this.setData({
            list: list,
            showMask: false,
            closeId: '',
            closeIndex: ''
        })
    })
}
// 取消关闭
VM.cancelClose = function() {
    this.setData({
        showMask: false,
        closeId: ''
    })
}
VM.onReachBottom = function() {
    this.getList()
}
Page(VM)
