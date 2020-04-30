const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        activityId: '', //创建活动-id
        titleIndex: 2,
        titleArr: ['验收成功', '派单成功', '发布成功'],
        tipArr: ['验收成功！', '派单成功！', '发布成功！'],
        showShare: false, //分享mask
        showPoster: false, //海报mask
        posterUrl: '' //海报url
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        activityId: query.id,
        titleIndex: query.type //0验收成功 1派单成功 2发布成功
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 展示分享mask
VM.showShareMask = function() {
    this.setData({
        showShare: true
    })
}

// 生成海报mask
VM.createPoster = function() {
    console.log('生成海报');
    let activityId = this.data.activityId
    let posterUrl = this.data.posterUrl
    if (!activityId) {
        return util.Toast('缺少必要参数')
    }
    if (posterUrl) {
        return this.setData({
            showShare: false,
            showPoster: true
        })
    }
    Req.request('createPoster', {
        type: 1,
        activity_id: activityId
        // position_id:''
    }, {
        method: 'post'
    }, res => {
        this.setData({
            posterUrl: res.data.url
        })
    }, err => {
        util.Toast('生成海报失败')
    })
}
// 展示海报mask
VM.showPosterMask = function() {
    this.setData({
        showShare: false,
        showPoster: true
    })
}
VM.closeMask = function() {
    this.setData({
        showShare: false,
        showPoster: false
    })
}
// 预览海报（实现长按扫码功能）
VM.previewImage = function(e) {
    let current = e.target.dataset.src;
    wx.previewImage({
        current: current,
        urls: [current]
    })
}
// 保存海报至相册
VM.savePoster = function() {
    let posterUrl = this.data.posterUrl
    wx.downloadFile({
        url: posterUrl,
        success: res => {
            // util.showLoading()
            // 保存图片到系统相册  
            wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: res => {
                    util.Toast('保存成功')
                    setTimeout(() => {
                        this.setData({
                            showShare: false,
                            showPoster: false
                        })
                    }, 1500)
                },
                fail: err => {
                    util.Toast('保存失败')
                }
            })
        },
        fail: err => {
            util.Toast('保存失败')
        }
    })
}
// 分享
VM.onShareAppMessage = function() {
    return {
        title: "J活动",
        path: '/pages/activity/detail/detail?id=' + this.data.activityId,
        imageUrl: '/images/index/banner01.png'
    };
}
Page(VM)
