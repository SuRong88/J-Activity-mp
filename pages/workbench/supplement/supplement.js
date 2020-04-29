const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 1通过验收 2补充验收
        type: 2,
        titleArr: ['通过验收', '补充验收材料'],
        labelArr: ['上传验收材料', '补充验收材料']
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
Page(VM)
