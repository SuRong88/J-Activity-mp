const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 企业logo图片id
        logoId: '',
        coverId: '',
        compInfo: null
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    let compInfo = app.globalData.companyInfo
    compInfo.isdefaultlogo = true
    this.setData({
        compInfo: compInfo
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 上传图片
VM.chooseImg = function(e) {
    let type = util.dataset(e, 'type')
    let that = this;
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success(res) {
            const tempFilePaths = res.tempFilePaths[0]
            if (type == 'logo') {
                that.setData({
                    ['compInfo.logo']: tempFilePaths,
                    ['compInfo.isdefaultlogo']: false,
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
                            logoId: id
                        })
                    },
                    fail: err2 => {
                        util.Toast('上传失败')
                    }
                })
            } else {
                that.setData({
                    ['compInfo.cover_img']: tempFilePaths
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
        }
    })
}
// 修改公司名
VM.changecomp = function(e) {
    this.setData({
        ['compInfo.name']: e.detail.value,
    })
}
// 修改电话
VM.changePhone = function(e) {
    this.setData({
        ['compInfo.contact_phone']: e.detail.value,
    })
}
// 修改简介
VM.changeintro = function(e) {
    this.setData({
        ['compInfo.profiles']: e.detail.value,
    })
}
// 提交
VM.formSubmit = function(e) {
    let data = this.data.compInfo;
    let logoId = this.data.logoId
    let coverId = this.data.coverId
    if (!formcheck.check_telphone(data.contact_phone)) {
        util.Toast('电话号码格式有误')
    } else if (formcheck.check_null(data.profiles)) {
        util.Toast('请输入描述')
    } else if (data.profiles.length > 20) {
        util.Toast('描述不能多于20个字')
    } else {
        Req.request('completeEnterpriseInfo', {
            logo: logoId,
            contact_phone: data.contact_phone,
            profiles: data.profiles,
            cover_img: coverId
        }, {
            method: 'put'
        }, res => {
            util.Toast('保存成功')
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            prevPage.init()
            setTimeout(() => {
                wx.navigateBack({
                    delta: 1
                })
            }, 2000)
        })
    }
}
Page(VM)
