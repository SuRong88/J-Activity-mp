const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showBox: false,
        iconArr: [{
            name: "充值",
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/recharge/recharge'
        }, {
            name: '发布活动',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/activityCreate/activityCreate'
        }, {
            name: '派单',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/dispatchAll/dispatchAll'
        }, {
            name: '验收结算',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/recharge/recharge'
        }, {
            name: '财务管理',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/finance/finance'
        }, {
            name: '活动管理',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/activityManage/activityManage'
        }, {
            name: '开票管理',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/invoiceManage/invoiceManage'
        }, {
            name: '私有服务商',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/privateList/privateList'
        }],
        compData: '', //企业信息
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
}

VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
    this.getcompData()
}
VM.changeStatus = function() {
    this.setData({
        showBox: true
    })
}
VM.cancelHandle = function() {
    this.setData({
        showBox: false
    })
}
VM.confirmHandle = function() {
    this.setData({
        showBox: false
    })
}

VM.getcompData = function() {
    Req.request('completeEnterpriseInfo', null, {
        method: 'get'
    }, res => {
        console.log(res)
        this.setData({
            compData: res.data
        })
    })
}
Page(VM)
