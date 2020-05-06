const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        disabled: true, //校验
        imgId: '', //验收材料imgId
        activityId: '',
        list: [] //验收数组
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
        // activity_id: activityId,
        // test
        activity_id: 13,
        // test end
        status: 1 //1为派单列 2为验收列
    }, {
        method: 'get'
    }, res => {
        let list = res.data
        list.forEach(item => {
            item.spread = true
            item.apply_list.forEach(subItem => {
                subItem.amount = ''
            })
        })
        this.setData({
            list: list
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 折叠
VM.spreadHandle = function(e) {
    let index = util.dataset(e, 'index')
    let list = this.data.list
    list[index].spread = !list[index].spread
    this.setData({
        list: list
    })

}
// 输入金额
VM.changeinput = function(e) {
    // todo
    let amount = e.detail.value
    let index1 = util.dataset(e, 'index1')
    let index2 = util.dataset(e, 'index2')
    let list = this.data.list
    list[index1].apply_list[index2].amount = amount
    let checkAmount = true
    let checkUpload = this.data.imgId !== '' ? true : false
    for (let i = 0; i < list.length; i++) {
        if (!checkAmount) {
            break
        }
        for (let j = 0; j < list[i].apply_list.length; j++) {
            if (formcheck.check_null(list[i].apply_list[j].amount)) {
                checkAmount = false
                break
            }
        }
    }
    let disabled = !(checkAmount && checkUpload)
    this.setData({
        list: list,
        disabled: disabled
    })
}
// 一键验收
VM.submitHandle = function() {
    if (this.data.disabled) {
        return false
    }
    wx.navigateTo({
        url: '/pages/workbench/confirmAllAcceptance/confirmAllAcceptance'
    })
}
Page(VM)
