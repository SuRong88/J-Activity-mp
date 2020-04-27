const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // 职位下标
        index: '',

        // 筛选条件 0类型 1地址
        filterType: 0,
        titleArr: ['选择职位', '选择地址'],
        // 职位类型
        tagIndex: -1,
        tagSubIndex: -1,
        tagList: [],
        tagSubList: [],
        // 已选类型
        checkTagList: [],
        // 省市区
        provinceIndex: -1,
        cityIndex: -1,
        areaIndex: -1,
        provinceList: [],
        cityList: [],
        areaList: [],
        // 已选地址
        address: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    // 选择岗位
    let filterType = 0
    this.setData({
        filterType: filterType,
        index: query.index || 0
    })
    // 获取职位
    if (filterType == 0) {
        this.setData({
            checkTagList: app.globalData.oldTagList
        })
        Req.request('getTag', null, {
            method: 'get'
        }, res => {
            console.log(res);
            this.setData({
                tagList: res.data
            })
        })
    } else { //获取地区
        this.setData({
            address: query.address
        })
        Req.request('getArea', null, {
            method: 'get'
        }, res => {
            this.setData({
                provinceList: res.data.plist
            })
        })
    }

}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}

// 删除筛选条件
VM.deleteTagItem = function(e) {
    let index = util.dataset(e, 'index')
    let tar;
    for (let i = 0; i < this.data.tagSubList.length; i++) {
        if (this.data.tagSubList[i].id == this.data.checkTagList[index].id) {
            tar = 'tagSubList[' + i + '].selected'
            break;
        }
    }
    this.data.checkTagList.splice(index, 1)
    if (tar) {
        this.setData({
            [tar]: false,
            checkTagList: this.data.checkTagList
        })
    } else {
        this.setData({
            checkTagList: this.data.checkTagList
        })
    }
}
// 一级分类
VM.tagFilter = function(e) {
    let index = util.dataset(e, 'index')
    this.setData({
        tagIndex: index,
        tagSubList: []
    })
    // 获取二级
    Req.request('getTagList', {
        classify_id: this.data.tagList[index].id
    }, {
        method: 'get'
    }, res => {
        console.log(res);
        let list = res.data
        let checkTagList = this.data.checkTagList
        for (let i = 0; i < list.length; i++) {
            list[i].selected = false
            for (let j = 0, l = checkTagList.length; j < l; j++) {
                if (list[i].id == checkTagList[j].id) {
                    list[i].selected = true
                }
            }
        }
        this.setData({
            tagSubList: list
        })
    })
}
// 二级分类
VM.tagSubFilter = function(e) {
    let index = util.dataset(e, 'index')
    // 原本已选择
    if (this.data.tagSubList[index].selected) {
        for (let i = 0; i < this.data.checkTagList.length; i++) {
            if (this.data.checkTagList[i].id == this.data.tagSubList[index].id) {
                this.data.checkTagList.splice(i, 1)
                break;
            }
        }
        let tar = 'tagSubList[' + index + '].selected'
        this.setData({
            [tar]: false,
            checkTagList: this.data.checkTagList
        })
    } else {
        let tagSubList = this.data.tagSubList
        let checkTagList = this.data.checkTagList
        for (let i = 0; i < tagSubList.length; i++) {
            tagSubList[i].selected = false
        }
        checkTagList = []
        tagSubList[index].selected = true
        checkTagList.push(tagSubList[index])
        this.setData({
            tagSubList: tagSubList,
            checkTagList: checkTagList
        })
    }
}

// 清除
VM.cancelSelect = function() {
    // 类型
    if (this.data.filterType == 0) {
        this.data.tagSubList.forEach(item => {
            item.selected = false
        })
        this.setData({
            tagIndex: -1,
            tagSubIndex: -1,
            checkTagList: [],
            tagSubList: this.data.tagSubList
        })
    } else { //地址
        this.setData({
            cityIndex: -1,
            areaIndex: -1,
            cityList: [],
            areaList: [],
            address: ''
        })
    }

}
// 确认
VM.confirmSelect = function() {
    let data = this.data
    // 类型
    if (data.checkTagList.length <= 0) {
        return util.Toast('请选择职位')
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let jobId = data.checkTagList[0].id;
    let jobName = data.checkTagList[0].name;
    let tar1 = 'jobList[' + data.index + '].jobId';
    let tar2 = 'jobList[' + data.index + '].jobName';
    prevPage.setData({
        [tar1]: jobId,
        [tar2]: jobName
    });
    //返回上一页
    wx.navigateBack({
        delta: 1
    });
}
Page(VM)
