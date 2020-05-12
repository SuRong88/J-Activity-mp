const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const util = require('../../utils/util.js');
const base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        isAuthed: true,
        showWelcome: true,
        marginNum: 32,
        swiperIndex01: 0,
        swiperIndex02: 0,
        swiperIndex04: 0,
        bannerList: [],
        platformUrl: '',
        recommendActivity: [],
        recommendEnterprise: [],
        recommendUser: [],
        service: '',
        cooperate: ''
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    // 展示欢迎
    if (app.globalData.showWelcome) {
        setTimeout(() => {
            this.setData({
                showWelcome: false
            })
        }, 3000)
    } else {
        this.setData({
            showWelcome: false
        })
    }
    app.globalData.showWelcome = false
    this.setData({
        tabbarType: app.globalData.roleType,
        isAuthed: app.globalData.isAuthed
    })
    Req.request('getIndexData', null, {
        method: 'get'
    }, (res) => {
        let data = res.data
        // return console.log(data);
        this.setData({
            bannerList: data.banner_list,
            platformUrl: data.platform_resource_pic,
            recommendActivity: data.recommend_activity,
            recommendEnterprise: data.recommend_enterprise,
            recommendUser: data.recommend_user,
            service: data.service,
            cooperate: data.cooperate
        })
    })
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
// 轮播
VM.changeSwiper01 = function(e) {
    var {
        current
    } = e.detail;
    this.setData({
        swiperIndex01: current
    });
};
VM.changeSwiper02 = function(e) {
    var {
        current
    } = e.detail;
    this.setData({
        swiperIndex02: current
    });
};
VM.changeSwiper04 = function(e) {
    var {
        current
    } = e.detail;
    this.setData({
        swiperIndex04: current
    });
};
//确定实名认证
VM.confirmAuth = function() {
    wx.navigateTo({
        url: '/pages/authentication/index/index'
    })
}
//取消实名认证
VM.cancelAuth = function() {
    // isAuthed为‘伪实名’，只是为了首次加载提示实名认证，之后不再显示该弹窗
    app.globalData.isAuthed = true
    this.setData({
        isAuthed: true
    })
}
VM.onShareAppMessage = function() {
    return {
        title: "“J活动”优质活动职位等你来接单！",
        path: '/pages/index/index',
        imageUrl: '/images/index/banner01.png'
    };
}
Page(VM)
