// pages/workbench/notify/notify.js
const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        imgArr: [],
        amount: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
//监听金额
VM.changeamount = function(e) {
    this.setData({
        amount: e.detail.value,
    })
}
//监听图片上传
VM.uploadImg = function() {
    let imgArr = this.data.imgArr
    if (imgArr.length >= 3) {
        return util.Toast('最多只能选择三张图片')
    }
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: res => {
            // 单个
            const tempFilePaths = res.tempFilePaths[0]
            wx.uploadFile({
                url: Req.OPTIONS.uploadImage.url,
                filePath: tempFilePaths,
                name: 'file',
                formData: {},
                success: res2 => {
                    let inf = JSON.parse(res2.data)
                    let obj = {
                        imgSrc: tempFilePaths,
                        imgId: inf.data.id
                    }
                    imgArr.push(obj)
                    this.setData({
                        imgArr: imgArr
                    })
                },
                fail: err2 => {
                    util.Toast('上传失败')
                }
            })
        }
    })
}

// 删除上传图片
VM.deleteImg = function(e) {
    let index = util.dataset(e, 'index')
    let imgArr = this.data.imgArr
    imgArr.splice(index, 1)
    this.setData({
        imgArr: imgArr
    })
}
VM.sumbit = function() {
    let data = this.data
    if (formcheck.check_null(data.amount)) {
        return util.Toast('未填写充值金额')
    }
    if (data.imgArr.length <= 0) {
        return util.Toast('未上传转账凭证')
    }
    if (data.amount <= 0) {
        return util.Toast('充值金额输入有误')
    }
    let imgArr = data.imgArr
    let imgIds = []
    imgArr.forEach(obj => {
        obj.imgId && imgIds.push(obj.imgId)
    })
    Req.request('recharge', {
        amount: data.amount.trim(),
        evidence_img: JSON.stringify(imgIds)
    }, {
        method: 'post'
    }, res => {
        util.Toast('成功提交，充值中…')
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}

Page(VM)
