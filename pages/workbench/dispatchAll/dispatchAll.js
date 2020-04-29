const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        activityId: ""
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let activityId = query.id
    this.setData({
        activityId: activityId
    })
    Req.request('getAllList', {
        activity_id: activityId,
        status: 1 //1为派单列 2为验收列
    }, {
        method: 'get'
    }, res => {
        console.log(res);
        // let list = this.data.list
        // list.splice(index, 1)
        // this.setData({
        //     showMask: false,
        //     list: list
        // })
    })

}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
Page(VM)
