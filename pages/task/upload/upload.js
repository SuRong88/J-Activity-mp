const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 活动id
        id: '',
        // 2待验收 3已完结
        type: 2,
        imgId: '',
        imgUrl: '',
        desc: '',
        // 上传成功 等待中
        waiting: false
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        id: query.id,
        type: query.type,
        // 是否由“全部”进入
        fromAll: (query.from && query.from == 'all')
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
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
// 验收说明
VM.changeDesc = function(e) {
    this.setData({
        desc: e.detail.value.trim()
    });
}
// 提交(区分上传还是补充)
VM.submitHandle = function() {
    if (this.data.waiting) {
        return false;
    }
    if (formcheck.check_null(this.data.imgId)) {
        return util.Toast('未上传验收图片')
    }
    Req.request('uploadAcceptance', {
        apply_id: this.data.id,
        acceptance_img: this.data.imgId,
        remark: this.data.desc,
        identity: app.globalData.roleType
    }, {
        method: 'put'
    }, res => {
        util.Toast('已成功申请')
        this.setData({
            waiting: true
        })
        // 跳转到“我的任务”列表页（待修改type 依然保持原来的type）
        setTimeout(() => {
            if (this.data.fromAll) {
                wx.redirectTo({
                    url: '/pages/task/index/index?type=0'
                });
            } else {
                wx.redirectTo({
                    url: '/pages/task/index/index?type=' + this.data.type
                });
            }
        }, 1500)
    })
}
Page(VM)
