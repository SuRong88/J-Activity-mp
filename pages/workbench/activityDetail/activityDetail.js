const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        activityId: '',
        // 活动详情
        info: null,
        // 关闭职位
        showMask: false, //关闭职位mask
        closeId: '', //关闭职位id
        closeIndex: '', //关闭职位index
        statusArr: ['招募中', '待验收', '已完结', '已关闭'],
        showShare: false, //分享mask
        showPoster: false, //海报mask
        posterUrl: '', //职位海报url
        jobIndex: '' //分享职位index
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        activityId: query.id
    })
    // 获取活动详情
    Req.request('activityDetail', {
        activity_id: query.id
    }, {
        method: 'get'
    }, (res) => {
        this.setData({
            info: res.data
        })
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
VM.showJobContent = function() {
    this.setData({
        test: !this.data.test
    })
}
// 获取活动列表
VM.getList = function() {
    if (this.data.current >= this.data.total_page) {
        return util.Toast('没有更多数据了')
    }
    Req.request('activityList', {
        page: this.data.current + 1,
        rownum: this.data.rownum,
        status: this.data.status
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

// 关闭职位
VM.showCloseJob = function(e) {
    let closeId = util.dataset(e, 'id')
    let closeIndex = util.dataset(e, 'index')
    this.setData({
        showMask: true,
        closeId: closeId,
        closeIndex: closeIndex
    })
}

// 确认关闭
VM.confirmClose = function(e) {
    let activityId = this.data.info.id
    // 职位id
    let closeId = this.data.closeId
    let closeIndex = this.data.closeIndex
    Req.request('closeJob', {
        activity_id: activityId,
        position_id: closeId
    }, {
        method: 'post'
    }, (res) => {
        util.Toast('关闭成功')
        let tar = 'info.position_list[' + closeIndex + '].status'
        this.setData({
            [tar]: 4,
            showMask: false,
            closeId: '',
            closeIndex: ''
        })
    })
}
// 取消关闭
VM.cancelClose = function() {
    this.setData({
        showMask: false,
        closeId: '',
        closeIndex: ''
    })
}
// 折叠职位列表的工作内容
VM.showJobContent = function(e) {
    let index = util.dataset(e, 'index')
    let tar = 'info.position_list[' + index + '].spread'
    this.setData({
        [tar]: !this.data.info.position_list[index].spread
    })
}
// 展示分享mask
VM.showShareMask = function(e) {
    let jobIndex = util.dataset(e, 'index')
    this.setData({
        showShare: true,
        jobIndex: jobIndex
    })
}

// 生成海报mask
VM.createPoster = function() {
    console.log('生成海报');
    let activityId = this.data.activityId
    let jobIndex = this.data.jobIndex
    let positionId = this.data.info.position_list[jobIndex].position_id
    if (!activityId) {
        return util.Toast('缺少必要参数')
    }
    Req.request('createPoster', {
        type: 2,
        activity_id: activityId,
        position_id: positionId
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
