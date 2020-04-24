const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        id: '',
        // 1待工作 2待验收 3已完结 4未选中 5已关闭
        type: 1,
        typeArr: ['待工作', '待验收', '已完结', '未选中', '已关闭'],
        // 任务/职位详情
        detail: null
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        id: query.id,
        type: query.type
    })
    Req.request('getTaskDetail', {
        apply_id: query.id
    }, {
        method: 'get'
    }, (res) => {
        this.setData({
            detail: res.data
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 确认任务
VM.confirmTask = function(e) {
    Req.request('changeJobStatus', {
        apply_id: this.data.id,
        status: 2
    }, {
        method: 'put'
    }, (res) => {
        util.Toast('确认成功')
        this.setData({
            type: 2
        })
    })
}
Page(VM)
