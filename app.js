const Req = require('./utils/request.js')
const util = require('./utils/util.js')
App({
    onLaunch: function(options) {
        this.checkNetwork()
        this.showLogs()
        this.checkVersion()
    },
    globalData: {
        isConnected: true,
        userInfo: null,
        roleType: 1 //用户角色 1-服务商、2-商家
    },
    // 展示本地存储能力
    showLogs: function() {
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    // 检查版本更新
    checkVersion: function() {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function(res) {
            // 请求完新版本信息的回调
            if (res.hasUpdate) {
                util.showLoading('更新中，请稍等')
                updateManager.onUpdateReady(function() {
                    wx.hideLoading()
                    util.showModal('更新提示', '新版本已下载，点击确定重启应用', false, '', '确定', function() {
                        updateManager.applyUpdate()
                    })
                })
                updateManager.onUpdateFailed(function() {
                    wx.hideLoading()
                    util.showModal('提示', '新版本下载失败，请检查网络重启应用', false, '', '确定')
                })
            }
        })
    },
    // 用户授权登录
    userLogin: function(cb_success) {
        wx.login({
            success: res1 => {
                wx.getUserInfo({
                    success: res2 => {
                        let userInfo = res2.userInfo
                        this.globalData.userInfo = userInfo
                        // todo
                    }
                })
            },
            fail: err => {
                wx.showModal({
                    title: '提示',
                    content: '登录失败,请重试',
                    showCancel: false,
                    confirmColor: '#FC7F03',
                })
            }
        })
    },
    // 判断有没有授权用户信息
    checkAuthorize: function(cb_success, cb_fail) {
        // 保留
        // if (!wx.getStorageSync('token')) {
        //     console.log('token缺失')
        //     return cb_fail()
        // }
        wx.getSetting({
            success: res => {
                // 检查授权
                if (res.authSetting['scope.userInfo']) {
                    console.log('已授权')
                    cb_success && cb_success()
                } else {
                    console.log('未授权')
                    cb_fail && cb_fail()
                }
            },
        })
    },
    // 检查并监听网络状态(待测)
    checkNetwork: function(cb_success) {
        // 检查网络
        wx.getNetworkType({
            success: (res) => {
                const networkType = res.networkType
                console.log('%c当前网络状态---' + networkType, 'color:#FC7F03;')
                if (networkType == 'none') {
                    this.globalData.isConnected = false
                    wx.showModal({
                        title: '提示',
                        content: '请检查网络设置',
                        showCancel: false,
                        cancelColor: '#000000',
                        confirmColor: '#FC7F03'
                    })
                } else {
                    cb_success && cb_success()
                }
            }
        })
        // 监听网络
        wx.onNetworkStatusChange((res) => {
            if (!res.isConnected) {
                this.globalData.isConnected = false
                wx.showModal({
                    title: '提示',
                    content: '请检查网络设置',
                    showCancel: false,
                    cancelColor: '#000000',
                    confirmColor: '#FC7F03'
                })
            } else {
                this.globalData.isConnected = true
                wx.hideToast()
            }
        })
    },
    // 获取系统信息
    getSystemInfo: function() {
        if (!this.globalData.sys) {
            this.globalData.sys = wx.getSystemInfoSync()
        }
        return this.globalData.sys
    },
    // 小程序支付
    wxpay: function(inf, cb_success, cb_fail) {
        console.log('***支付数据***', inf)
        wx.requestPayment({
            timeStamp: inf.timeStamp,
            nonceStr: inf.nonceStr,
            package: inf['package'],
            signType: 'MD5',
            paySign: inf.paySign,
            success: (res) => {
                console.log(res)
                if (res.errMsg == "requestPayment:ok") {
                    typeof cb_success === 'function' && cb_success(res)
                }
            },
            fail: (err) => {
                console.log(err)
                if (!/cancel/.test(err.errMsg)) {
                    return (typeof cb_fail === 'function' && cb_fail(err))
                } else {
                    util.Toast('取消支付')
                }
            }
        })
    },
    // 获取data数据
    dataset: function(e, key) {
        return e.currentTarget.dataset[key]
    }
})
