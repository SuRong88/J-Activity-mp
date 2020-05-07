const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const util = require('../../utils/util.js');
const base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        loading: true,
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
                loading: false
            })
        }, 3000)
    } else {
       this.setData({
           loading: false
       }) 
    }
    app.globalData.showWelcome = false
    this.setData({
        tabbarType: app.globalData.roleType
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
VM.onShareAppMessage = function() {
    return {
        title: "分享标题",
        path: '/pages/index/index',
        imageUrl: ''
    };
}
Page(VM)
