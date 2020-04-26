const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 企业id
        id: '',
        // 企业信息
        enterprise: '',
        // 活动列表
        activityList: []
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let id = query.id
    Req.request('getEnterpriseDetail', {
        enterprise_id: id
    }, {
        method: 'get'
    }, (res) => {
        let data = res.data
        this.setData({
            id: id,
            enterprise: data.enterprise,
            activityList: data.activity_list
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
Page(VM)
