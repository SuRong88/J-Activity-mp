const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        applyId: '', //活动报名id
        userId: '', //服务商id
        // 1通过验收 2补充验收
        type: 1,
        titleArr: ['通过验收', '补充验收材料'],
        labelArr: ['上传验收材料', '补充验收材料'],

        imgId: '',
        imgUrl: '',
        amount: '',
        info: null //验收信息（用户信息以及用户验收材料）
    }
}

VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        type: query.type || 1,
        applyId: query.applyId,
        userId: query.userId
    })
    Req.request('getAcceptanceInfo', {
        apply_id: query.applyId,
        user_id: query.userId
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

// 输入
VM.changeInput = function(e) {
    this.setData({
        amount: e.detail.value.trim()
    });
}

//选择图片
VM.chooseImg = function(e) {
    wx.chooseImage({
        count: 1,
        success: res => {
            this.setData({
                imgUrl: res.tempFilePaths[0]
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
                        imgId: id
                    })
                },
                fail: err2 => {
                    util.Toast('上传失败')
                }
            })
        }
    });
};

VM.submitHandle = function() {
    let data = this.data
    if (!data.imgId) {
        return util.Toast('未上传验收图片')
    }
    if (data.amount == '') {
        return util.Toast('未设定金额')
    }
    wx.navigateTo({
        url:'/pages/workbench/confirmAcceptance/confirmAcceptance'
    })
}

Page(VM)
