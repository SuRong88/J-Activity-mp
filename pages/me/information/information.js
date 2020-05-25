const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        avatarUrl: '',
        logoUrl: '',
        logoId: '',
        nickname: '',
        exp: '', // 工作经历
        address: '',
        addressDetail: '',
        typeList: [], //所属类型
        //证书arr
        certificatArr: [],
        // certificatUrl: '', //证书
        // certificatId: ''
        tagAll: false,
        tagSubAll: false
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    let globalData = app.globalData
    this.setData({
        // 微信头像
        avatarUrl: globalData.userInfo ? globalData.userInfo.avatarUrl : '',
    })
    Req.request('getMyCompleteInfo', null, {
        method: 'get'
    }, res => {
        let data = res.data
        let tagAll = false
        let tagSubAll = false
        if (data.position_type == 1) {
            // 一级全部
            if (data.position_list[0].id == 0) {
                tagAll = true
                data.position_list[0].isAll = true
            } else { //二级全部
                tagSubAll = true
                data.position_list[0].isSubAll = true
            }
        }
        this.setData({
            logoUrl: data.logo || '',
            nickname: data.nickname || '',
            exp: data.work_experience || '',
            address: data.address || '',
            addressDetail: data.address_detail || '',
            typeList: data.position_list || [],
            certificatArr: data.work_img || [],
            tagAll: tagAll,
            tagSubAll: tagSubAll,
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

//上传logo
VM.uploadLogo = function(e) {
    wx.chooseImage({
        count: 1,
        success: res => {
            this.setData({
                logoUrl: res.tempFilePaths[0]
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
                        logoId: id
                    })
                },
                fail: err2 => {
                    util.Toast('上传失败')
                }
            })
        }
    });
};
// 上传工作照
VM.uploadWorkImg = function() {
    let certificatArr = this.data.certificatArr
    if (certificatArr.length >= 3) {
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
                        id: inf.data.id,
                        url: tempFilePaths
                    }
                    certificatArr.push(obj)
                    this.setData({
                        certificatArr: certificatArr
                    })
                },
                fail: err2 => {
                    util.Toast('上传失败')
                }
            })
        }
    })
}
// 删除上传工作照图片
VM.deleteWorkImg = function(e) {
    let index = util.dataset(e, 'index')
    let certificatArr = this.data.certificatArr
    certificatArr.splice(index, 1)
    this.setData({
        certificatArr: certificatArr
    })
}
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
    let typeList = this.data.typeList
    typeList.splice(index, 1)
    // 删除的 一级全部、二级全部肯定是tagAll、tagSubAll为fasle
    this.setData({
        tagAll: false,
        tagSubAll: false,
        typeList: typeList
    })
}

VM.submitHandle = function() {
    let data = this.data
    if (formcheck.check_null(data.address)) {
        return util.Toast('请选择地区')
    }
    // 所属类型
    if (data.typeList.length <= 0) {
        return util.Toast('请选择所属类型')
    }
    let typeList = []
    for (let i = 0; i < data.typeList.length; i++) {
        if (data.typeList[i].isAll) {
            this.setData({
                tagAll: true
            })
            typeList.push(0)
            break
        }
        if (data.typeList[i].isSubAll) {
            this.setData({
                tagSubAll: true
            })
            typeList.push(data.typeList[i].id)
            break
        }
        typeList.push(data.typeList[i].id)
    }

    // 工作照
    let certificatArr = data.certificatArr
    let certificatIds = []
    certificatArr.forEach(obj => {
        obj.id && certificatIds.push(obj.id)
    })
    Req.request('saveMyCompleteInfo', {
        logo: data.logoId,
        nickname: data.nickname,
        work_img: JSON.stringify(certificatIds),
        work_experience: data.exp,
        position_list: JSON.stringify(typeList),
        position_type: data.tagAll || data.tagSubAll ? 1 : 0,
        address: data.address,
        address_detail: data.addressDetail
    }, {
        method: 'put'
    }, res => {
        util.Toast('保存成功')
        setTimeout(() => {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            prevPage.init()
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}
Page(VM)
