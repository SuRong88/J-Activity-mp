const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        // pagination
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false,

        // 筛选条件框
        showFilter: false,
        // 筛选条件
        filterType: -1,
        // 排序 1 2
        sortType01: 0,

        //搜索信息-关键字
        keyword: '',
        // 搜索信息-职位类型
        tagAll: false, //一级全选
        tagSubAll: false, //二级全选
        tagIndex: -1,
        tagList: [],
        tagSubList: [],
        // 搜索信息-已选类型
        checkTagList: [],
        // 搜索信息-省市区
        provinceIndex: 0,
        cityIndex: 0,
        areaIndex: 0,
        provinceList: [],
        cityList: [],
        areaList: [],
        // 搜索信息-已选地址
        address: '',
        // 搜索信息-活动状态( 不限0  招募1  结束2 )
        statusIndex: 0,
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    this.setData({
        // tabbarType等同于用户角色 1服务商 2商家
        tabbarType: app.globalData.roleType
    })
    this.getList();
}
VM.onLoad = function(query) {
    this.init()
    base.onLoad(this)
}
// 搜索
VM.changeInput = function(e) {
    this.setData({
        keyword: e.detail.value.trim()
    });
}
// 清除搜索
VM.clearKeyword = function(e) {
    console.log('清空');
    this.setData({
        keyword: ''
    });
}
// 获取列表
VM.getList = function(type) {
    if (this.data.current >= this.data.total_page) {
        return util.Toast('没有更多数据了')
    }
    Req.request('getActivityList', {
        position_id: '',
        position_type: 1,
        status: 99,
        address: '',
        keyword: '',
        page: this.data.current + 1,
        rownum: this.data.rownum
    }, {
        method: 'get'
    }, (res) => {
        let data = res.data
        let pagination = res.data.pagination
        let list = this.data.list
        // let sortType01 = this.data.sortType01
        // list = this.sortDataArray(list, sortType01)
        this.setData({
            list: list.concat(data.list),
            current: pagination.current * 1,
            rownum: pagination.rownum * 1,
            total: pagination.total * 1,
            total_page: pagination.total_page * 1,
            isEmpty: pagination.total * 1 <= 0 ? true : false
        })
    })
}
// 筛选条件
VM.filterHandle = function(e) {
    let type = util.dataset(e, 'type') * 1
    if (type == this.data.filterType) {
        return this.setData({
            showFilter: false,
            filterType: -1
        })
    }
    this.setData({
        showFilter: true,
        filterType: type,
    })
    // 获取职位
    if (type == 0) {
        Req.request('getTag', null, {
            method: 'get'
        }, res => {
            let list = res.data
            list.unshift({
                id: '',
                name: '全部'
            })
            this.setData({
                tagList: list
            })
        })
    } else if (type == 1) { //获取地区
        Req.request('getArea', null, {
            method: 'get'
        }, res => {
            let list = res.data.plist
            list.unshift({
                id: 0,
                name: '不限'
            })
            this.setData({
                provinceList: list
            })
        })
    }
}
// 删除筛选条件-岗位-item
VM.deleteTagItem = function(e) {
    let index = util.dataset(e, 'index')
    let tar;
    let data = this.data
    let tagSubList = data.tagSubList
    let checkTagList = data.checkTagList
    // delete一级全部
    if (data.tagAll) {
        console.log('删除一级全部');
        return this.setData({
            tagAll: false,
            tagIndex: -1,
            tagSubList: [],
            checkTagList: []
        })
    }
    // delete二级全部
    if (data.tagSubAll) {
        let tar = 'tagSubList[0].selected'
        console.log('删除二级全部');
        return this.setData({
            [tar]: false,
            tagSubAll: false,
            checkTagList: []
        })
    }

    for (let i = 0; i < tagSubList.length; i++) {
        if (tagSubList[i].id == checkTagList[index].id) {
            tar = 'tagSubList[' + i + '].selected'
            break;
        }
    }
    checkTagList.splice(index, 1)
    if (tar) {
        this.setData({
            [tar]: false,
            checkTagList: checkTagList
        })
    } else {
        this.setData({
            checkTagList: checkTagList
        })
    }
}
// 删除筛选条件-地址
VM.deleteAddressFilter = function() {
    this.setData({
        provinceIndex: 0,
        cityIndex: 0,
        areaIndex: 0,
        cityList: [],
        areaList: [],
        address: ''
    })
}
// 删除筛选条件-状态
VM.deleteStatusFilter = function(e) {
    this.setData({
        statusIndex: 0
    })
}
// 添加为私有服务商
VM.addPrivate = function(e) {
    let id = util.dataset(e, 'id')
    let index = util.dataset(e, 'index')
    Req.request('addPrivate', {
        user_id: id
    }, {
        method: 'post'
    }, res => {
        util.Toast('添加成功')
        let tar = 'list[' + index + '].private_user'
        this.setData({
            [tar]: 1
        })
    })
}
// 移除私有服务商
VM.removePrivate = function(e) {
    let id = util.dataset(e, 'id')
    let index = util.dataset(e, 'index')
    Req.request('addPrivate', {
        user_id: id
    }, {
        method: 'delete'
    }, res => {
        util.Toast('移除成功')
        let tar = 'list[' + index + '].private_user'
        this.setData({
            [tar]: 0
        })
    })
}
// 关闭筛选框
VM.hideFilter = function() {
    this.setData({
        showFilter: false,
        filterType: -1
    })
}
// 一级分类
VM.tagFilter = function(e) {
    let index = util.dataset(e, 'index')
    if (this.data.tagIndex == index) {
        return
    }
    // wait
    if (index == 0) {
        return this.setData({
            tagAll: true,
            tagSubAll: false,
            tagIndex: index,
            tagSubList: [],
            checkTagList: [{
                id: 0,
                name: '全部',
                isAll: true
            }]
        })
    }
    this.setData({
        tagIndex: index,
        tagSubList: [],
        // checkTagList: [],
    })
    // 获取二级
    Req.request('getTagList', {
        classify_id: this.data.tagList[index].id
    }, {
        method: 'get'
    }, res => {
        let list = res.data
        let checkTagList = this.data.checkTagList
        let tagList = this.data.tagList
        let tagIndex = this.data.tagIndex
        list.unshift({
            id: tagList[tagIndex].id,
            name: '全部'
        })
        // 选择一级全部
        if (this.data.tagAll) {
            return this.setData({
                tagSubList: list
            })
        }
        // 选择二级全部
        if (this.data.tagSubAll) {
            if (checkTagList[0].id == tagList[tagIndex].id) {
                list[0].selected = true
            }
            return this.setData({
                tagSubList: list
            })
        }
        for (let i = 0; i < list.length; i++) {
            list[i].selected = false
            for (let j = 0, l = checkTagList.length; j < l; j++) {
                if (list[i].id == checkTagList[j].id) {
                    list[i].selected = true
                }
            }
        }
        this.setData({
            tagSubList: list,
        })
    })
}
// 二级分类
VM.tagSubFilter = function(e) {
    let index = util.dataset(e, 'index')
    if (index == 0) {
        let data = this.data
        let tagSubList = data.tagSubList
        // 已选择二级全部
        if (tagSubList[0].selected) {
            tagSubList[0].selected = false
            return this.setData({
                tagSubAll: false,
                tagSubList: tagSubList,
                checkTagList: []
            })
        }
        // 未选择二级全部
        tagSubList.forEach(item => {
            item.selected = false
        })
        let id = data.tagList[data.tagIndex].id
        let name = data.tagList[data.tagIndex].name
        let checkTagList = [{
            id: id,
            name: `${name}-全部`,
            isSubAll: true
        }]
        let tar = 'tagSubList[0].selected'
        return this.setData({
            tagAll: false,
            tagSubAll: true,
            tagSubList: tagSubList,
            checkTagList: checkTagList,
            [tar]: true
        })
    }
    // 原选-一级全部
    if (this.data.tagAll) {
        this.setData({
            tagAll: false,
            checkTagList: []
        })
    }
    // 原选-二级全部
    if (this.data.tagSubAll) {
        this.setData({
            tagSubAll: false,
            checkTagList: [],
            ['tagSubList[0].selected']: false
        })
    }
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
        if (this.data.checkTagList.length >= 3) {
            return util.Toast('最多只能选择三个标签')
        }
        this.data.checkTagList.push(this.data.tagSubList[index])
        let tar = 'tagSubList[' + index + '].selected'
        this.setData({
            [tar]: true,
            checkTagList: this.data.checkTagList
        })
    }

}
// 地址选择
VM.provinceFilter = function(e) {
    let index = util.dataset(e, 'index')
    if (this.data.provinceIndex == index) {
        return false
    }
    if (index == 0) {
        return this.setData({
            address: '',
            provinceIndex: index,
            cityList: [],
            areaList: [],
            cityIndex: 0,
            areaIndex: 0
        })
    }
    this.setData({
        address: this.data.provinceList[index].name,
        provinceIndex: index,
        cityList: [],
        areaList: [],
        cityIndex: 0,
        areaIndex: 0
    })
    let province = this.data.provinceList[index].id
    Req.request('getArea', {
        province: province
    }, {
        method: 'get'
    }, res => {
        let list = res.data.clist
        list.unshift({
            id: 0,
            name: '不限'
        })
        this.setData({
            cityList: list
        })
    })
}
VM.cityFilter = function(e) {
    let index = util.dataset(e, 'index')
    if (this.data.cityIndex == index) {
        return false
    }
    if (index == 0) {
        return this.setData({
            address: this.data.provinceList[this.data.provinceIndex].name,
            areaList: [],
            cityIndex: 0,
            areaIndex: 0
        })
    }
    this.setData({
        address: this.data.provinceList[this.data.provinceIndex].name + this.data.cityList[index].name,
        cityIndex: index,
        areaList: [],
        areaIndex: 0,
    })
    let province = this.data.provinceList[this.data.provinceIndex].id
    let city = this.data.cityList[index].id
    Req.request('getArea', {
        province: province,
        city: city
    }, {
        method: 'get'
    }, res => {
        let list = res.data.alist
        list.unshift({
            id: 0,
            name: '不限'
        })
        this.setData({
            areaList: list
        })
    })
}
VM.areaFilter = function(e) {
    let index = util.dataset(e, 'index')
    let data = this.data
    if (index == 0) {
        return this.setData({
            address: this.data.provinceList[this.data.provinceIndex].name + data.cityList[data.cityIndex]
                .name,
            areaIndex: 0
        })
    }
    this.setData({
        address: data.provinceList[data.provinceIndex].name + data.cityList[data.cityIndex].name +
            data.areaList[
                index].name,
        areaIndex: index
    })
}
// 状态筛选
VM.statusFilter = function(e) {
    let index = util.dataset(e, 'index')
    this.setData({
        statusIndex: index
    })
}
// 清除筛选条件
VM.cancelSelect = function() {
    // 类型
    let type = this.data.filterType
    if (type == 0) {
        // 清空选中
        let tagSubList = this.data.tagSubList
        tagSubList.forEach(item => {
            item.selected = false
        })
        this.setData({
            // tagIndex: -1,
            tagAll: false,
            tagSubAll: false,
            checkTagList: [],
            tagSubList: tagSubList
        })
    } else if (type == 1) { //地址
        this.setData({
            provinceIndex: 0,
            cityIndex: 0,
            areaIndex: 0,
            cityList: [],
            areaList: [],
            address: ''
        })
    } else {
        this.setData({
            statusIndex: 0
        })
    }

}
// 确认筛选条件
VM.confirmSelect = function() {
    // 类型
    let type = this.data.filterType
    if (type == 0) {
        this.setData({
            showFilter: false,
            filterType: -1,
        })
    } else if (type == 1) {
        this.setData({
            showFilter: false,
            filterType: -1,
        })
    } else {
        this.setData({
            showFilter: false,
            filterType: -1,
        })
    }
}
// 按活动开始时间排序
VM.sortByDate = function() {
    let sortType01 = this.data.sortType01 === 1 ? 2 : 1
    let list = this.data.list
    list = this.sortDataArray(list, sortType01)
    this.setData({
        sortType01: sortType01,
        list: list
    })
}
//对数组根据日期进行排序
VM.sortDataArray = function(dataArray, sortType01) {
    if (sortType01 == 1) {
        return dataArray.sort(function(a, b) {
            return Date.parse(b.start_time.replace(/\./g, "/")) - Date.parse(a.start_time.replace(/\./g,
                "/"));
        });
    } else {
        return dataArray.sort(function(a, b) {
            return Date.parse(a.start_time.replace(/\./g, "/")) - Date.parse(b.start_time.replace(/\./g,
                "/"));
        });
    }
}
// 搜索
VM.confirmSearch = function() {
    let status = this.data.statusIndex
    if (status == 0) {
        status = 99
    } else if (status == 1) {
        status = 1
    } else {
        status = 3
    }
    let searchActivityInfo = {
        keyword: this.data.keyword,
        checkTagList: this.data.checkTagList,
        address: this.data.address,
        status: status
    }
    console.log(searchActivityInfo);
    app.globalData.searchActivityInfo = searchActivityInfo
    wx.navigateTo({
        url: '/pages/activity/search/search'
    })
}
VM.onReachBottom = function() {
    this.getList()
}
Page(VM)
