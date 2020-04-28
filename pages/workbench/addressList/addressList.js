const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        type: '', //select为选择地址
        showMask: false,
        list: [],
        // 删除地址的id
        deleteId: '',
        waiting: false
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.getList()
}
VM.onLoad = function(query) {
    // this.init()
    base.onLoad(this)
    if (query.type && query.type == 'select') {
        this.setData({
            type: 'select'
        })
    }
}
VM.onShow = function(query) {
    this.init(query)
}
// 选择
VM.selectAddress = function(e) {
    if (this.data.waiting) {
        return false
    }
    let index = util.dataset(e, 'index')
    let list = this.data.list
    // 可删除？
    list.forEach(item => {
        item.selected = false
    })
    // end
    list[index].selected = true
    this.setData({
        list: list,
        waiting: true
    })
    let addressInfo = list[index]
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let address = this.data.address;
    prevPage.setData({
        addressInfo: addressInfo
    });
    setTimeout(() => {
        wx.navigateBack({
            delta: 1
        })
    }, 1000)
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
VM.confirmDelete = function(e) {
    let index = util.dataset(e, 'index')
    let id = this.data.deleteId // 删除地址的id
    console.log(id);
    Req.request('deleteAddress', {
        id: id
    }, {
        method: 'DELETE'
    }, (res) => {
        util.Toast('删除成功')
        let list = this.data.list
        list.splice(index, 1)
        this.setData({
            list: list,
            showMask: false,
            deleteId: ''
        })
    })
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
// 地址列表没有分页
// VM.onReachBottom = function() {
//     this.getList()
// }
Page(VM)
