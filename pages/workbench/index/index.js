const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showLogout: false,
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
            link: '/pages/workbench/activityManage/activityManage'
        }, {
            name: '验收结算',
            iconUrl: '/images/workbench/money.png',
            link: '/pages/workbench/activityManage/activityManage?status=2'
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
    this.setData({
        tabbarType: app.globalData.roleType
    })
    this.getcompData()
}

VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
VM.changeStatus = function() {
    this.setData({
        showLogout: true
    })
}
VM.cancelLogout = function() {
    this.setData({
        showLogout: false
    })
}
VM.confirmLogout = function() {
    this.setData({
        showLogout: false
    })
    app.globalData = {
        isConnected: true,
        isLogined: false,
        userInfo: null, //微信用户信息
        companyInfo: null, //企业信息
        // myInfo: null, //服务器用户信息
        roleType: 1, //用户角色 1-服务商、2-商家
        oldTagList: [], //完善信息的类型数组
        newTagList: [],
        searchServiceInfo: null, //搜索服务商信息
        searchActivityInfo: null, //搜索服务商信息
        activityCreateInfo: null //创建活动信息
    }
    wx.clearStorage()
    app.onLaunch()
    wx.reLaunch({
        url: '/pages/index/index'
    })
    console.log(app.globalData);
}

VM.getcompData = function() {
    Req.request('completeEnterpriseInfo', null, {
        method: 'get'
    }, res => {
        this.setData({
            compData: res.data
        })
        app.globalData.companyInfo = res.data
    })
}
Page(VM)
