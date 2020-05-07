// pages/workbench/notify/notify.js
const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        classArr: ['', 'green', 'orange', 'gray'],
        // 筛选条件下标
        filterIndex: -1,
        // status: 0,
        statusIndex: 0,
        statusRange: [{
                name: '不限',
                sel: true
            },
            {
                name: '充值成功',
                sel: false
            },
            {
                name: '充值中',
                sel: false
            }, {
                name: '充值失败',
                sel: false
            }
        ],
        priceIndex: 0,
        priceRange: [{
                name: '不限',
                sel: true
            }, {
                name: '0-1000',
                sel: false
            },
            {
                name: '1001-2000',
                sel: false
            },
            {
                name: '2001-3000',
                sel: false
            }, {
                name: '3001-4000',
                sel: false
            },
            {
                name: '4001-5000',
                sel: false
            },
            {
                name: '5000以上',
                sel: false
            }
        ],
        startDate: '开始日期',
        endDate: '结束日期',
        startSelected: false,
        endSelected: false,

        // pagination
        current: 0,
        rownum: 10,
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
// 获取列表
VM.getList = function() {
    let data = this.data
    if (data.current >= data.total_page) {
        return util.Toast('没有更多数据了')
    }
    let startDate = ''
    let endDate = ''
    let amountSection = ''
    if (data.startSelected && data.endSelected) {
        startDate = data.startDate
        endDate = data.endDate
    }
    if (data.priceIndex > 0) {
        amountSection = data.priceRange[data.priceIndex].name
    }
    Req.request('getRechargeList', {
        page: data.current + 1,
        rownum: data.rownum,
        status: data.statusIndex,
        start_time: startDate,
        end_time: endDate,
        amount_section: amountSection
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

VM.pickerSelect = function(e) {
    let key = util.dataset(e, 'key')
    if (key == 'status') {
        this.setData({
            filterIndex: 0
        })
    } else if (key == 'price') {
        this.setData({
            filterIndex: 1
        })
    }
}

VM.pickerCancel = function() {
    this.setData({
        filterIndex: -1
    })
}

// 状态改变
VM.statusChange = function(e) {
    console.log(233);
    let index = e.detail.value;
    if (index == this.data.statusIndex) {
        return false
    }
    this.setData({
        filterIndex: -1,
        statusIndex: index,
        // pagination
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false,
    })
    this.getList()
}

// 金额改变
VM.priceChange = function(e) {
    let index = e.detail.value;
    if (index == this.data.priceIndex) {
        return false
    }
    this.setData({
        filterIndex: -1,
        priceIndex: index,
        // pagination
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false
    })
    this.getList()
}

// 
VM.startDateChange = function(e) {
    this.setData({
        startDate: e.detail.value,
        startSelected: true
    });
    // 起始日期都选中 改变触发列表刷新
    let data = this.data
    if (data.startSelected && data.endSelected) {
        this.setData({
            // pagination
            current: 0,
            rownum: 10,
            total: 0,
            total_page: 1,
            list: [],
            isEmpty: false
        })
        this.getList()
    }
}
VM.endDateChange = function(e) {
    this.setData({
        endDate: e.detail.value,
        endSelected: true
    });
    let data = this.data
    if (data.startSelected && data.endSelected) {
        this.setData({
            // pagination
            current: 0,
            rownum: 10,
            total: 0,
            total_page: 1,
            list: [],
            isEmpty: false
        })
        this.getList()
    }
}
VM.onReachBottom = function() {
    this.getList()
}
Page(VM)
