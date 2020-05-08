const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        avatarUrl: '',
        avatarId: '',
        nickname: '',
        exp: '', // 工作经历
        address: '',
        addressDetail: '',
        typeList: [], //所属类型
        certificatUrl: '', //证书
        certificatId: ''
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    Req.request('getMyCompleteInfo', null, {
        method: 'get'
    }, res => {
        let data = res.data
        this.setData({
            avatarUrl: data.logo || '',
            nickname: data.nickname || '',
            exp: data.work_experience || '',
            address: data.address || '',
            addressDetail: data.address_detail || '',
            typeList: data.position_list || '',
            certificatUrl: data.work_img || ''
        })
    })
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}

// 昵称 地址 工作经历
VM.changeNickname = function(e) {
    this.setData({
        nickname: e.detail.value.trim()
    });
}
VM.changeAddressDetail = function(e) {
    this.setData({
        addressDetail: e.detail.value.trim()
    });
}
VM.changeExp = function(e) {
    this.setData({
        exp: e.detail.value.trim()
    });
}

//选择图片
VM.chooseImg = function(e) {
    // index 0头像 1证书 
    let index = util.dataset(e, 'index')
    wx.chooseImage({
        count: 1,
        success: res => {
            if (index == 0) {
                this.setData({
                    avatarUrl: res.tempFilePaths[0]
                });
                wx.uploadFile({
                    url: Req.OPTIONS.uploadImage.url,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    formData: {},
                    success: res2 => {
                        let inf = JSON.parse(res2.data)
                        let id = inf.data.id
                        this.setData({
                            avatarId: id
                        })
                    },
                    fail: err2 => {
                        util.Toast('上传失败')
                    }
                })
            } else {
                this.setData({
                    certificatUrl: res.tempFilePaths[0]
                });
                wx.uploadFile({
                    url: Req.OPTIONS.uploadImage.url,
                    filePath: res.tempFilePaths[0],
                    name: 'file',
                    formData: {},
                    success: res2 => {
                        let inf = JSON.parse(res2.data)
                        let id = inf.data.id
                        this.setData({
                            certificatId: id
                        })
                    },
                    fail: err2 => {
                        util.Toast('上传失败')
                    }
                })
            }
        }
    });
};
// 选择类型
VM.selectType = function() {
    app.globalData.oldTagList = this.data.typeList
    wx.navigateTo({
        url: "/pages/me/select/select?type=type"
    })
}
// 删除类型
VM.removeTypeItem = function(e) {
    let index = util.dataset(e, 'index')
    this.data.typeList.splice(index, 1)
    let typeList = this.data.typeList
    this.setData({
        typeList: typeList
    })
}

VM.submitHandle = function() {
    let data = this.data
    if (formcheck.check_null(data.address)) {
        return util.Toast('请选择地区')
    }
    let typeList = []
    for (let i = 0; i < data.typeList.length; i++) {
        typeList.push(data.typeList[i].id)
    }
    Req.request('saveMyCompleteInfo', {
        logo: data.avatarId,
        nickname: data.nickname,
        work_img: data.certificatId,
        work_experience: data.exp,
        position_list: JSON.stringify(typeList),
        address: data.address,
        address_detail: data.addressDetail
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
        }, 1500)
    })
}
Page(VM)
