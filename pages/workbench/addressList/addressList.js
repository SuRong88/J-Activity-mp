const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showMask: false,
        test: true,
        list: [],
        // 删除地址的id
        deleteId: ''
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    this.getList()
}
VM.onLoad = function(query) {
    // this.init()
    base.onLoad(this)
}
VM.onShow = function(query) {
    this.init()
}
// 选择
VM.selectAddress = function(e) {
    let index = util.dataset(e, 'index')
    let list = this.data.list
    list.forEach(item => {
        item.selected = false
    })
    list[index].selected = true
    this.setData({
        list: list
    })
}
// 删除
VM.deleteAddress = function(e) {
    let id = util.dataset(e, 'id')
    this.setData({
        showMask: true,
        deleteId: id
    })
}
// 编辑
VM.editAddress = function() {

}
// 确认删除
VM.confirmDelete = function() {
    // 删除地址的id
    let id = this.data.deleteId
    console.log(id);
    //todo 需要删除地址的接口

}
// 取消删除
VM.cancelDelete = function() {
    this.setData({
        showMask: false,
        deleteId: ''
    })
}
VM.base_jump = function(e) {
    console.log(11)
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
        url: url,
    })
}

// 获取列表
VM.getList = function(type) {
    Req.request('getAddressList', null, {
        method: 'get'
    }, (res) => {
        let list = res.data
        list.forEach(item => {
            item.selected = false
        })
        this.setData({
            list: list
        })
    })
}
// VM.
VM.onReachBottom = function() {
    this.getList()
}
Page(VM)
