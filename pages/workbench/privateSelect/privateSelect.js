const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        //职位下标
        index: '',
        // 人数限制
        limit: 0,

        // 列表信息
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false,

        // 选中服务商id
        selectedList: []
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        index: query.index,
        limit: query.limit
    })
    this.getList()
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 获取列表
VM.getList = function() {
    if (this.data.current >= this.data.total_page) {
        return false
    }
    Req.request('getPrivateList', {
        page: this.data.current + 1,
        rownum: this.data.rownum
    }, {
        method: 'get'
    }, (res) => {
        let data = res.data
        let pagination = res.data.pagination
        let list = this.data.list
        data.list.forEach(item => {
            item.selected = false
        })
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
// VM.confirmRemove = function() {

// }
// VM.cancelRemove = function() {

// }
// 选择服务商
VM.selectItem = function(e) {
    let index = util.dataset(e, 'index')
    let tar = 'list[' + index + '].selected'
    let list = this.data.list
    let selectedList = []
    // 校验人数限制
    let nextAble = list[index].selected
    if (!nextAble && this.data.selectedList.length >= this.data.limit) {
        return util.Toast('超过可选人数')
    }
    // 反选
    list[index].selected = !list[index].selected
    console.log(list[index].selected);
    list.forEach(item => {
        if (item.selected) {
            selectedList.push(item.id)
        }
    })
    this.setData({
        [tar]: list[index].selected,
        selectedList: selectedList
    })
}
// 确认
VM.confirmHandle = function() {
    let data = this.data
    // 类型
    if (data.selectedList.length <= 0) {
        return util.Toast('请选择指定服务商')
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let selectedList = data.selectedList;
    let tar = 'jobList[' + data.index + '].userIds';
    prevPage.setData({
        [tar]: selectedList
    });
    //返回上一页
    wx.navigateBack({
        delta: 1
    });
}
Page(VM)
