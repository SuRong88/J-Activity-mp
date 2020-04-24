const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const util = require('../../utils/util.js');
const base = require('../../utils/base.js');
const Req = require('../../utils/request.js');
const VM = {
    data: {
        marginNum:32,
        swiperIndex01:0,
        swiperIndex02:0,
        swiperIndex04:0,
        bannerList:[
            {
                imgUrl:('../../images/index/banner01.png')
            },
            {
                imgUrl:('../../images/index/banner01.png')
            },
            {
                imgUrl:('../../images/index/banner01.png')
            }
        ]
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        tabbarType: app.globalData.roleType
    })
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
// 轮播
VM.changeSwiper01 = function (e) {
	var { current } = e.detail;
	this.setData({
		swiperIndex01: current
	});
};
VM.changeSwiper02 = function (e) {
	var { current } = e.detail;
	this.setData({
		swiperIndex02: current
	});
};
VM.changeSwiper04 = function (e) {
	var { current } = e.detail;
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
