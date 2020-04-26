const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
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
    this.getList();
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 获取企业列表
VM.getList = function(type) {
    if (this.data.current >= this.data.total_page) {
        return util.Toast('没有更多数据了')
    }
    Req.request('getEnterpriseList', {
        page: this.data.current + 1,
        rownum: this.data.rownum,
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
VM.onReachBottom = function() {
    this.getList()
}
Page(VM)
