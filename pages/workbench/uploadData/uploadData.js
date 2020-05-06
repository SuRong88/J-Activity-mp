const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        imgId: '',
        imgUrl: '',
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
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    let list = prevPage.data.list
    // 校验上一页的输入金额
    let checkAmount = true
    for (let i = 0; i < list.length; i++) {
        if (!checkAmount) {
            break
        }
        for (let j = 0; j < list[i].apply_list.length; j++) {
            if (formcheck.check_null(list[i].apply_list[j].amount)) {
                checkAmount = false
                break
            }
        }
    }
    prevPage.setData({
        imgId: this.data.imgId,
        disabled: !checkAmount
    })
    wx.navigateBack({
        delta: 1
    })
}

Page(VM)
