const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        coverId: '',
        coverImg: '',
        name: '',
        desc: '',
        address: '', //地区
        addressDetail: '', //详细地址
        startDate: '开始日期',
        endDate: '结束日期',
        startSelected: false,
        endSelected: false
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
VM.changeInput = function(e) {
    let key = util.dataset(e, 'key')
    if (key === 'name') {
        this.setData({
            name: e.detail.value
        })
    } else if (key === 'desc') {
        this.setData({
            desc: e.detail.value
        })
    } else {
        this.setData({
            addressDetail: e.detail.value
        })
    }
}
VM.startDateChange = function(e) {
    this.setData({
        startDate: e.detail.value,
        startSelected: true
    });
}
VM.endDateChange = function(e) {
    this.setData({
        endDate: e.detail.value,
        endSelected: true
    });
}
// 上传图片
VM.chooseImg = function() {
    let that = this;
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success(res) {
            const tempFilePaths = res.tempFilePaths[0]
            that.setData({
                coverImg: tempFilePaths,
            })
            wx.uploadFile({
                url: Req.OPTIONS.uploadImage.url,
                filePath: tempFilePaths,
                name: 'file',
                formData: {},
                success: res2 => {
                    let inf = JSON.parse(res2.data)
                    let id = inf.data.id
                    that.setData({
                        coverId: id
                    })
                },
                fail: err2 => {
                    util.Toast('上传失败')
                }
            })
        }
    })
}
// 添加职位（检验信息完整）
VM.addJob = function() {
    let data = this.data
    if (formcheck.check_null(data.name)) {
        return util.Toast('请填写活动名称')
    }
    if (formcheck.check_null(data.coverId)) {
        return util.Toast('请上传活动图片')
    }
    if (!data.startSelected) {
        return util.Toast('请选择活动开始时间')
    }
    if (!data.endSelected) {
        return util.Toast('请选择活动结束时间')
    }
    if (formcheck.check_null(data.address)) {
        return util.Toast('请选择活动地区')
    }
    app.globalData.activityCreateInfo = data
    wx.navigateTo({
        url: '/pages/workbench/jobAdd/jobAdd?workAddress=' + data.address + data.addressDetail +
            '&startDate=' + data.startDate + '&endDate' + data.endDate
    })
}
Page(VM)
