const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        avatarUrl: '',
        nickname: '',
        exp: '', // 工作经历
        address: '',
        addressDetail: '',
        type: [], //所属类型
        certificatUrl: '' //证书
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
            } else {
                this.setData({
                    certificatUrl: res.tempFilePaths[0]
                });
            }
        }
    });
};
Page(VM)
