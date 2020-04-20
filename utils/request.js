const util = require('./util.js')
const app = getApp();
const HOST = 'https://xcxdemo2.mrxdtech.com/api';
let Request = null;
// 接口
const OPTIONS = {
    /* 
     **1.用户模块
     */
    // 登录
    login: {
        url: `${HOST}/login`,
    },
    //获取用户信息
    getUserInfo: {
        url: `${HOST}/user`
    },
    // 添加用户偏好
    addPreference: {
        url: `${HOST}/user/prefer`
    },
    // 用户投诉
    addComplaint: {
        url: `${HOST}/complain`
    },
    // 获取投诉记录
    getComplaintList: {
        url: `${HOST}/complain`
    },
    // 提交送餐邀约
    submitInvition: {
        url: `${HOST}/invite`
    },
    // 获取配送订单记录
    getOrderList: {
        url: `${HOST}/order`
    },
    // 退款提现
    refund: {
        url: `${HOST}/refund`
    },
    // 获取代金券
    getVoucherList: {
        url: `${HOST}/voucher`
    },
    // 获取微信手机号
    getPhoneNum: {
        url: `${HOST}/user/phone`
    },
    //获取申请状态
    getApplyState: {
        url: `${HOST}//workRegist`
    },
    /*
     **2.支付模块
     */
    // 充值时间戳 加密等信息
    chargeInfo: {
        url: `${HOST}/pay`
    },
    // 账户充值金额arr
    chargeType: {
        url: `${HOST}/pay/config`
    },
    // 余额流水
    accountBill: {
        url: `${HOST}/pay`
    },
    /*
     **3.定制计划模块
     */
    // 首页展示计划
    indexPlanning: {
        url: `${HOST}/plan/face`
    },
    // get获取 post提交 put修改定制计划
    planning: {
        url: `${HOST}/plan`
    },
    // 获取饭菜分量,例如--大份12元
    getWeightList: {
        url: `${HOST}/weight`
    },
    /*
     **4.取消送餐模块
     */
    // get获取取消送餐的日期 post提交取消送餐的日期
    cancelDelivery: {
        url: `${HOST}/plan/cancel`
    },
    /*
     **5.打包员模块
     */
    // 注册打包员
    applyPacker: {
        url: `${HOST}/packer/apply`
    },
    // 餐盒扫码
    scanPacker: {
        url: `${HOST}/packer/order`
    },
    // 提交打包
    submitPacker: {
        url: `${HOST}/packer/box`
    },
    /*
     **6.配送员模块
     */
    // 注册配送员
    applyDeliver: {
        url: `${HOST}/runner/apply`
    },
    // 提交配送
    submitDeliver: {
        url: `${HOST}/runner/box`
    }
}
// 状态码处理
function codeCheck(data, success, fail) {
    let code = parseInt(data.code)
    switch (code) {
        case 0: //成功
            success && success(data);
            break;
        case 50003: //token过期
            util.showModal('提示', '登录信息已过期,请重新登录', false, '', '确定', () => {
                getApp().checkAuthorize(() => {
                    getApp().userLogin((res) => {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    })
                }, () => {
                    wx.reLaunch({
                        url: '/pages/introduce/introduce'
                    })
                })
            })
            break;
        default:
            if (fail) {
                fail(data)
            } else {
                // util.Toast(data.msg);
                util.showModal('提示', data.msg, false, '', '确定')
            }
            break;
    }
}
// 请求方法
/**
 ** key：接口名
 ** data: 参数
 ** option: 配置
 ** success: 成功的回调函数
 ** fail：失败的回调函数
 ** todo: 自定义接口调用成功的状态码判断方法(delete)
 **/
function request(key, data, option, success, fail) {
    util.showLoading();
    let url = OPTIONS[key].url;
    let method = (option && option.method) || 'GET';
    let dataType = (option && option.dataType) || 'json';
    let responseType = (option && option.responseType) || 'text';
    wx.request({
        url: url,
        data: data,
        method: method,
        dataType: dataType,
        responseType: responseType,
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-Token': wx.getStorageSync('token')
        },
        success: function(res) {
            wx.hideLoading();
            codeCheck(res.data, success, fail);
        },
        fail: function(err) {
            console.log(err);
            wx.hideLoading();
            // util.errorToast('系统出错');
        }
    })
}
Request = {
    OPTIONS,
    request
}
module.exports = Request;
