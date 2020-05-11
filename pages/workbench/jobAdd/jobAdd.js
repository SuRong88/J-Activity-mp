const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 工作地址
        workAddress: '',
        startDate: '',
        endDate: '',
        // 职位人数
        numberArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        jobList: [{
            jobId: '',
            jobName: '',
            content: '',
            spread: true,
            number: 1,
            // startDate: '开始日期',
            // startSelected: false,
            // endDate: '结束日期',
            // endSelected: false,
            special: 0,
            userIds: [],
            salary: ''
        }],
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        workAddress: query.workAddress || '活动地址',
        startDate: query.startDate || '1970-01-01',
        endDate: query.endDate || '1970-01-01'
    })
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 折叠职位内容
VM.spreadItem = function(e) {
    let index = util.dataset(e, 'index')
    let tar = 'jobList[' + index + '].spread'
    this.setData({
        [tar]: !this.data.jobList[index].spread
    })
}
// 添加职位
VM.addJob = function() {
    let job = {
        jobId: '',
        content: '',
        spread: true,
        number: 1,
        // startDate: '开始日期',
        // startSelected: false,
        // endDate: '结束日期',
        // endSelected: false,
        special: 0,
        userIds: [],
        salary: ''
    }
    this.data.jobList.push(job)
    this.setData({
        jobList: this.data.jobList
    })
}
// 删除职位
VM.deleteJob = function(e) {
    let index = util.dataset(e, 'index')
    this.data.jobList.splice(index, 1)
    this.setData({
        jobList: this.data.jobList
    })
}
// 工作内容 预算金额
VM.changeInput = function(e) {
    let index = util.dataset(e, 'index')
    let key = util.dataset(e, 'key')
    if (key == 'content') { //工作内容
        let tar = 'jobList[' + index + '].content'
        this.setData({
            [tar]: e.detail.value
        })
    } else { //预算
        let tar = 'jobList[' + index + '].salary'
        this.setData({
            [tar]: e.detail.value
        })
    }
}
// 人数
VM.numberChange = function(e) {
    let index = util.dataset(e, 'index')
    let tar = 'jobList[' + index + '].number'
    this.setData({
        [tar]: parseInt(e.detail.value) + 1
    })
    // console.log(index, e.detail.value, parseInt(e.detail.value) + 1);
}
// 职位雇佣 0普通 1指定
VM.jobHireType = function(e) {
    let index = util.dataset(e, 'index')
    let value = util.dataset(e, 'value')
    let tar = 'jobList[' + index + '].special'
    this.setData({
        [tar]: value,
    });
}
// 日期
// VM.startDateChange = function(e) {
//     let index = util.dataset(e, 'index')
//     let tar1 = 'jobList[' + index + '].startDate'
//     let tar2 = 'jobList[' + index + '].startSelected'
//     this.setData({
//         [tar1]: e.detail.value,
//         [tar2]: true
//     });
// }
// VM.endDateChange = function(e) {
//     let index = util.dataset(e, 'index')
//     let tar1 = 'jobList[' + index + '].endDate'
//     let tar2 = 'jobList[' + index + '].endSelected'
//     this.setData({
//         endDate: e.detail.value,
//         endSelected: true,
//         [tar1]: e.detail.value,
//         [tar2]: true
//     });
// }
// 发布活动
VM.createActivity = function() {
    let jobList = this.data.jobList
    for (let i = 0; i < jobList.length; i++) {
        let item = jobList[i]
        let valiate = (item.jobId != '' && item.content != '' && item.salary != '')
        // 校验 - 指定
        let valiate2 = true
        if (item.special == 1) {
            valiate2 = item.userIds.length > 0 ? true : false
        }
        if (!(valiate && valiate2)) {
            return util.Toast('第' + (i + 1) + '项职位信息不完整')
        }
    }
    // 传后台的职位列表
    let job_list = []
    for (let i = 0; i < jobList.length; i++) {
        let item = jobList[i]
        let newItem = {
            position_id: item.jobId,
            job_content: item.content,
            start_time: this.data.startDate,
            end_time: this.data.endDate,
            people_num: item.number,
            nature: item.special,
            user_ids: item.userIds,
            salary: item.salary,
        }
        job_list.push(newItem)
    }
    console.log('职位列表', job_list);
    // 创建活动的基本信息
    let activityCreateInfo = app.globalData.activityCreateInfo
    Req.request('createActivity', {
        cover_img: activityCreateInfo.coverId,
        name: activityCreateInfo.name,
        desc: activityCreateInfo.desc,
        address: activityCreateInfo.address,
        address_detail: activityCreateInfo.addressDetail,
        start_time: activityCreateInfo.startDate,
        end_time: activityCreateInfo.endDate,
        job_list: JSON.stringify(job_list)
    }, {
        method: 'post'
    }, (res) => {
        //res.data返回创建活动的id 
        console.log('创建活动id:' + res.data);
        wx.redirectTo({
            url: '/pages/workbench/publishSuccess/publishSuccess?id=' + res.data + '&type=2'
        })
    })


}
Page(VM)
