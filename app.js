const Req = require('./utils/request.js')
const util = require('./utils/util.js')
App({
    onLaunch: function(options) {
        this.checkNetwork()
        this.showLogs()
        this.checkVersion()
        this.userLogin()
    },
    globalData: {
        showWelcome: false, //首页欢迎
        showModaled: false, // 防止显示多个showModal
        isConnected: true, //网络是否连接
        isLogined: false, //当前是否登录状态
        isAuthed: true, //登录用户是否已实名
        userInfo: null, //微信用户信息
        companyInfo: null, //企业信息
        // myInfo: null, //服务器用户信息
        roleType: 1, //用户角色 1-服务商、2-商家
        oldTagList: [], //完善信息的类型数组
        newTagList: [],
        searchServiceInfo: null, //搜索服务商信息
        searchActivityInfo: null, //搜索服务商信息
        activityCreateInfo: null, //创建活动信息
        authInfo: null //实名认证信息
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
        // 已登录
        if (wx.getStorageSync('token')) {
            this.globalData.isLogined = true
            this.getWexinInfo()
            this.getIdentity()
        }
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
    },
    // 获取图形码
    getCaptcha: function(type = 'login') {
        let currentDate = new Date().getTime()
        if (type == 'login') { //登录
            return Req.OPTIONS.getCaptcha.url + '?t=' + currentDate
        } else if (type == 'acceptance') { //验收
            return Req.OPTIONS.getCaptcha2.url + '?t=' + currentDate
        } else { //修改银行卡
            return Req.OPTIONS.getCaptcha3.url + '?t=' + currentDate
        }
    },
    // 获取服务器用户信息(未启用)
    getUserInfo: function() {
        Req.request('getMyInfo', null, {
            method: 'get'
        }, res => {
            this.globalData.myInfo = res.data
            console.log(this.globalData.myInfo);
        })
    },
    // 获取微信用户信息
    getWexinInfo: function() {
        // 获取微信用户信息
        this.checkAuthorize(() => {
            wx.getUserInfo({
                success: res => {
                    this.globalData.userInfo = res.userInfo
                    // 上传用户微信头像
                    Req.request('saveWxAvatar', {
                        head_img: res.userInfo.avatarUrl,
                        nickname: res.userInfo.nickName
                    }, {
                        method: 'put'
                    }, res => {
                        console.log('微信头像上传成功');
                    })
                }
            })
        }, () => {
            wx.showModal({
                title: '提示',
                content: '请授权使用该小程序',
                confirmColor: '#FC7F03',
                showCancel: false,
                success: res => {
                    // 确认
                    if (res.confirm) {
                        wx.openSetting({
                            success: dataAu => {
                                // 开启授权
                                if (dataAu.authSetting["scope.userInfo"] ==
                                    true) {
                                    util.Toast('授权成功')
                                    wx.getUserInfo({
                                        success: res => {
                                            this.globalData.userInfo =
                                                res.userInfo
                                            // 更新当前页面信息
                                            let pages =
                                                getCurrentPages()
                                            let currentPage =
                                                pages[pages.length -
                                                    1]
                                            currentPage.init()
                                        }
                                    })
                                } else {
                                    util.Toast('取消授权')
                                }
                            }
                        })
                    } else if (res.cancel) {
                        util.Toast('取消授权')
                        // wx.navigateTo({
                        //     url: '/pages/index/index'
                        // })
                    }
                }
            })
        })
    },
    // 获取服务器用户角色
    getIdentity: function() {
        Req.request('getIdentity', null, {
            method: 'get'
        }, res => {
            let isAuthed = res.data.auth == 1 ? true : false
            this.globalData.roleType = res.data.identity
            this.globalData.isAuthed = isAuthed
            console.log('用户实名状态' + res.data.auth);
            console.log('用户角色类型' + res.data.identity);
            // 更新当前页面栈的tabbar类型
            let pages = getCurrentPages()
            for (let i = 0; i < pages.length; i++) {
                pages[i].setData({
                    tabbarType: res.data.identity,
                    isAuthed: isAuthed
                })
                // 可删除
                // pages[i].init()
                // 可删除end
            }
        })
    }
})
