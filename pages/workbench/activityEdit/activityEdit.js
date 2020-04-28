const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        id: '',
        index: 0,
        name: '',
        desc: '',
        startDate: '',
        endDate: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let id = query.id //活动id
    let index = query.index //活动index
    this.setData({
        id: id,
        index: index
    })
    // 获取活动详情
    Req.request('activityDetail', {
        activity_id: id
    }, {
        method: 'get'
    }, (res) => {
        let info = res.data
        this.setData({
            name: info.name,
            desc: info.desc,
            startDate: info.start_time.replace(/\./g, '-'),
            endDate: info.end_time.replace(/\./g, '-')
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
VM.changeInput = function(e) {
    let key = util.dataset(e, 'key')
    if (key == 'name') {
        this.setData({
            name: e.detail.value.trim()
        });
    } else {
        this.setData({
            desc: e.detail.value.trim()
        });
    }
}
VM.startDateChange = function(e) {
    this.setData({
        startDate: e.detail.value
    });
}
VM.endDateChange = function(e) {
    this.setData({
        endDate: e.detail.value
    });
}
VM.submitEdit = function() {
    let data = this.data
    if (formcheck.check_null(data.name)) {
        return util.Toast('请输入活动名称')
    }
    if (formcheck.check_null(data.desc)) {
        return util.Toast('请输入活动描述')
    }
    Req.request('editActivity', {
        activity_id: data.id,
        name: data.name,
        desc: data.desc,
        start_time: data.startDate,
        end_time: data.endDate,
    }, {
        method: 'post'
    }, (res) => {
        util.Toast('修改成功')
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        let name = 'list[' + data.index + '].name'
        let desc = 'list[' + data.index + '].desc'
        let start_time = 'list[' + data.index + '].start_time'
        let end_time = 'list[' + data.index + '].end_time'
        prevPage.setData({
            [name]: data.name,
            [desc]: data.desc,
            [start_time]: data.startDate,
            [end_time]: data.endDate,
        })
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}
Page(VM)
