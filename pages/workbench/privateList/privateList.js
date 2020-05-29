const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showMask: false,
        removeIndex: '',
        removeId: '',
        // 列表信息
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this)
    this.setData({
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false
    })
    this.getList()
}
VM.onLoad = function(query) {
    base.onLoad(this)
}
VM.onShow = function() {
    console.log('show');
    this.init()
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
// 是否确认移除mask
VM.showMask = function(e) {
    let id = util.dataset(e, 'id')
    let index = util.dataset(e, 'index')
    this.setData({
        showMask: true,
        removeIndex: index,
        removeId: id,
    })
}
VM.confirmRemove = function() {
    let id = this.data.removeId
    let index = this.data.removeIndex
    Req.request('removePrivate', {
        user_id: id
    }, {
        method: 'delete'
    }, res => {
        util.Toast('移除成功')
        let list = this.data.list
        list.splice(index, 1)
        this.setData({
            showMask: false,
            list: list
        })
    })
}
VM.cancelRemove = function() {
    this.setData({
        showMask: false,
        removeIndex: '',
        removeId: '',
    })
}
// 添加服务商
VM.addPrivate = function(){
    let searchServiceInfo = {
        keyword: '',
        checkTagList: [],
        address: ''
    }
    app.globalData.searchServiceInfo = searchServiceInfo
    wx.navigateTo({
        url: '/pages/resource/search/search'
    })
}
Page(VM)
