const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        activityId: "",
        list: []
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
        status: 2 //1为派单列 2为验收列
    }, {
        method: 'get'
    }, res => {
        let list = res.data
        list.forEach(item => {
            item.spread = true
            item.selected = true
            item.selectedLength = item.apply_list.length
            item.apply_list.forEach(subItem => {
                subItem.selected = true
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
// 一级菜单选择
VM.selectItem = function(e) {
    let index = util.dataset(e, 'index')
    let list = this.data.list
    let item = list[index]
    console.log(index);
    // 原“全选”
    if (item.selected) {
        item.selected = false
        item.selectedLength = 0
        item.apply_list.forEach(subItem => {
            subItem.selected = false
        })
    } else {
        item.selected = true
        item.selectedLength = item.apply_list.length
        item.apply_list.forEach(subItem => {
            subItem.selected = true
        })
    }
    this.setData({
        list: list
    })
}
// 二级菜单选择
VM.selectSubItem = function(e) {
    let index = util.dataset(e, 'index1')
    let subIndex = util.dataset(e, 'index2')
    console.log(index, subIndex);
    let list = this.data.list
    let subList = list[index].apply_list
    let item = list[index]
    let subItem = subList[subIndex]
    subItem.selected = !subItem.selected
    let num = 0 //单个职位选中的人数
    subList.forEach(obj => {
        obj.selected && num++
    })
    if (num == 0) {
        item.selected = false
    }
    if (num == subList.length) {
        item.selected = true
    }
    item.selectedLength = num
    this.setData({
        list: list
    })
}
// 提交“一键派单”
VM.dispatchAll = function() {
    let data = this.data
    let list = data.list
    let activityId = data.activityId
    // 请求参数arr
    let paramList = []
    list.forEach(item => {
        let applyIds = []
        let positionId = item.id
        item.apply_list.forEach(subItem => {
            if (subItem.selected) {
                applyIds.push(subItem.apply_id)
            }
        })
        if (applyIds.length > 0) {
            let obj = {
                apply_ids: applyIds,
                position_id: positionId,
                activity_id: activityId,
            }
            paramList.push(obj)
        }
    })
    Req.request('dispatchAll', {
        data: JSON.stringify(paramList)
    }, {
        method: 'put'
    }, res => {
        wx.redirectTo({
            url: '/pages/workbench/publishSuccess/publishSuccess?type=1'
        })
    })
}
Page(VM)
