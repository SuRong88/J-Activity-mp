const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        loading: true,
        isAuth: 0
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
    Req.request('getAuthStatus', null, {
        method: 'get'
    }, (res) => {
        // a已实名
        if (res.data.is_auth == 1) {
            this.setData({
                loading: false,
                isAuth: 1
            })
        } else { //b未实名
            this.setData({
                isAuth: 0
            })
            wx.redirectTo({
                url: "/pages/authentication/complete/complete"
            })
        }
    })
}
Page(VM)
