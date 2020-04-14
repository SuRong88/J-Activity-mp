const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showFilter: false,
        // 筛选条件
        filterType: -1,
        // 接单排序 1 2
        sortByOrder: 1,
        // 入驻时间排序 1 2
        sortByTime: 1
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
// 筛选条件
VM.filterHandle = function(e) {
    let type = util.dataset(e, 'type') * 1
    if (type == this.data.filterType) {
        return this.setData({
            showFilter: false,
            filterType: -1
        })
    }
    this.setData({
        showFilter: true,
        filterType: type,
    })
}
// 删除筛选条件
VM.deleteFilter = function() {

}
// 处理排序
VM.sortHandle = function() {
    this.setData({
        sortByOrder: this.data.sortByOrder === 1 ? 2 : 1
    })
}
Page(VM)
