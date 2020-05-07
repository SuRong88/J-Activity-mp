const util = require('./util.js')
const app = getApp();
const HOST = 'https://xcxdemo2.mrxdtech.com/api';
let Request = null;
// 接口
const OPTIONS = {
    /*
     **工作台
     */
    // 获取企业信息
    getEnterpriseInfo: {
        url: `${HOST}/enterprise/completeInfo`
    },
    // 完善企业信息
    completeEnterpriseInfo: {
        url: `${HOST}/enterprise/completeInfo`
    },
    // 获取职位列表
    getJobList: {
        url: `${HOST}/activity/add`
    },
    // 创建活动
    createActivity: {
        url: `${HOST}/activity/add`
    },
    // 充值
    recharge: {
        url: `${HOST}/enterprise/recharge`
    },
    // 获取充值记录
    getRechargeList: {
        url: `${HOST}/enterprise/rechargeLog`
    },
    // 添加地址
    addAddress: {
        url: `${HOST}/user/contact`
    },
    // 编辑地址
    editAddress: {
        url: `${HOST}/user/contact`
    },
    // 获取地址详情
    getAddressDetail: {
        url: `${HOST}/user/contact`
    },
    // 获取地址列表
    getAddressList: {
        url: `${HOST}/user/contact`
    },
    // 添加地址
    addAddress: {
        url: `${HOST}/user/contact`
    },
    // 删除地址
    deleteAddress: {
        url: `${HOST}/user/contact`
    },
    // 获取开票类目
    invoiceClassifity: {
        url: `${HOST}/invoice/classifyList`
    },
    // 获取开票设置信息
    invoiceSetting: {
        url: `${HOST}/invoice/setting`
    },
    // 申请开票
    invoiceApply: {
        url: `${HOST}/invoice/apply`
    },
    // 开票记录
    invoiceList: {
        url: `${HOST}/invoice/list`
    },
    // 开票记录
    invoiceList: {
        url: `${HOST}/invoice/list`
    },
    // 添加职位（已有活动-添加职位）
    addJobAgain: {
        url: `${HOST}/activity/addPosition`
    },
    //关闭活动
    closeActivity: {
        url: `${HOST}/activity/close`
    },
    //关闭职位
    closeJob: {
        url: `${HOST}/activity/closeJob`
    },
    //活动列表
    activityList: {
        url: `${HOST}/enterprise/activityList`
    },
    //一键验收
    passAcceptanceAll: {
        url: `${HOST}/enterprise/acceptanceAll`
    },
    //修改活动
    editActivity: {
        url: `${HOST}/activity/update`
    },
    //活动详情
    activityDetail: {
        url: `${HOST}/enterprise/activityDetail`
    },
    //职位详情
    jobDetail: {
        url: `${HOST}/enterprise/jobDetail`
    },
    //活动派单
    dispatch: {
        url: `${HOST}/enterprise/allowApply`
    },
    //一键派单
    dispatchAll: {
        url: `${HOST}/enterprise/allowApplyPlu`
    },
    //获取验收时候的基本信息（服务商的信息）
    getAcceptanceInfo: {
        url: `${HOST}/enterprise/acceptanceInfo`
    },
    //通过验收
    passAcceptance: {
        url: `${HOST}/enterprise/acceptance`
    },
    //驳回验收
    refuseAcceptance: {
        url: `${HOST}/enterprise/rejectAcceptance`
    },
    //拒绝报名
    refuseApply: {
        url: `${HOST}/enterprise/refuseApply`
    },
    //消息列表
    getMsgList: {
        url: `${HOST}/enterprise/message`
    },
    //账户明细
    getAccountList: {
        url: `${HOST}/enterprise/accountLog`
    },
    // 获取一键验收、一键派单的列表
    getAllList: {
        url: `${HOST}/activity/getApplyList`
    },
    /*
     **服务商
     */
    // 搜索服务商列表
    getServiceList: {
        url: `${HOST}/user/userList`
    },
    // 服务商详情
    getServiceDetail: {
        url: `${HOST}/user/detail`
    },
    // 添加私有服务商
    addPrivate: {
        url: `${HOST}/enterprise/privateUser`
    },
    // 删除私有服务商
    removePrivate: {
        url: `${HOST}/enterprise/privateUser`
    },
    // 私有服务商列表
    getPrivateList: {
        url: `${HOST}/enterprise/userList`
    },
    /*
     **我的
     */
    // 获取个人信息
    getMyInfo: {
        url: `${HOST}/user/info`
    },
    //获取完善页面信息
    getMyCompleteInfo: {
        url: `${HOST}/user/completeInfo`
    },
    //保存信息
    saveMyCompleteInfo: {
        url: `${HOST}/user/completeInfo`
    },
    //我的任务
    getTaskList: {
        url: `${HOST}/activity/myActivity`
    },
    //任务详情
    getTaskDetail: {
        url: `${HOST}/user/jobDetail`
    },
    //上传验收材料
    uploadAcceptance: {
        url: `${HOST}/activity/acceptance`
    },
    //改变工作状态
    changeJobStatus: {
        url: `${HOST}/activity/changeApplyStatus`
    },
    //修改银行卡
    editBankCard: {
        url: `${HOST}/user/changeBankNum`
    },
    //提交反馈
    submitFeedback: {
        url: `${HOST}/user/feedback`
    },
    /*
     **岗位标签
     */
    // 岗位一级
    getTag: {
        url: `${HOST}/position/classifyList`
    },
    // 岗位二级
    getTagList: {
        url: `${HOST}/position/positionList`
    },
    /* 
     **登录页
     */
    // 获取图形码---登录
    getCaptcha: {
        url: `${HOST}/captcha/login`
    },
    // 获取图形码---验收
    getCaptcha2: {
        url: `${HOST}/captcha/acceptance`
    },
    // 获取图形码---修改银行卡
    getCaptcha3: {
        url: `${HOST}/captcha/change`
    },
    // 发送验证码
    sendCode: {
        url: `${HOST}/user/send`
    },
    // 验证登录
    login: {
        url: `${HOST}/user/login`
    },
    /* 
     **通用
     */
    // 获取地区
    getArea: {
        url: `${HOST}/common/area`
    },
    // 上传图片
    uploadImage: {
        url: `${HOST}/upload/lrzupload`
    },
    // 上传图片
    getIdentity: {
        url: `${HOST}/user/getIdentity`
    },
    // 获取首页数据
    getIndexData: {
        url: `${HOST}/index/indexData`
    },
    /*
     **企业
     */
    // 获取企业列表
    getEnterpriseList: {
        url: `${HOST}/enterprise/list`
    },
    // 获取企业详情
    getEnterpriseDetail: {
        url: `${HOST}/enterprise/detail`
    },
    /*
     **活动
     */
    // 获取活动列表
    getActivityList: {
        url: `${HOST}/activity/list`
    },
    // 获取活动详情
    getActivityDetail: {
        url: `${HOST}/activity/detail`
    },
    // 获取活动职位列表
    getActivityJobList: {
        url: `${HOST}/activity/activityJobDetail`
    },
    // 活动报名
    signUpActivity: {
        url: `${HOST}/user/activityApply`
    },
    /*
     **分享海报
     */
    // 海报生成
    createPoster: {
        url: `${HOST}/activity/poster`
    },
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
                console.log('重新登录');
                wx.redirectTo({
                    url: '/pages/login/login'
                })
            })
            break;
        default:
            if (fail) {
                fail(data)
            } else {
                // util.Toast(data.msg);
                util.showModal('提示', data.msg || '系统出错', false, '', '确定')
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
            // wx.hideLoading({
            //     complete: (complete) => {
            //         if (complete.errMsg == 'hideLoading:ok') {
            //             codeCheck(res.data, success, fail);
            //         }
            //     }
            // });
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
