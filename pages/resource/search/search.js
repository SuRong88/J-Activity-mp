const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        showFilter: false,
        // 筛选条件
        filterType: -1,
        // 接单排序 1 2
        sortByOrder: 0,
        // 入驻时间排序 1 2
        sortByTime: 0,

        // 列表信息
        current: 0,
        rownum: 10,
        total: 0,
        total_page: 1,
        list: [],
        isEmpty: false,

        //搜索信息-关键字
        keyword: '',
        // 搜索信息-职位类型
        tagSubAll: false, //二级类型全选
        tagIndex: 0,
        tagSubIndex: 0,
        tagList: [],
        tagSubList: [],
        tagSubList2: [], //不加"全部"的二级类型arr
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
        address: ''
    }
}
VM.init = function() {
    // 设置自定义头部
    util.setHeader(this);
    let searchServiceInfo = app.globalData.searchServiceInfo
    this.setData({
        tabbarType: app.globalData.roleType,
        keyword: searchServiceInfo.keyword,
        checkTagList: searchServiceInfo.checkTagList,
        address: searchServiceInfo.address
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
VM.getList = function() {
    if (this.data.current >= this.data.total_page) {
        return false
    }
    // 岗位类型id 数组
    let checkTagArr = []
    for (let i = 0; i < this.data.checkTagList.length; i++) {
        checkTagArr.push(this.data.checkTagList[i].id)
    }
    if (checkTagArr.length <= 0) {
        checkTagArr = ''
    } else {
        checkTagArr = JSON.stringify(checkTagArr)
    }
    Req.request('getServiceList', {
        is_recommend: 0,
        position_id: checkTagArr,
        address: this.data.address,
        keyword: this.data.keyword,
        page: this.data.current + 1,
        identity: app.globalData.roleType,
        rownum: this.data.rownum
    }, {
        method: 'get'
    }, (res) => {
        let data = res.data
        let pagination = res.data.pagination
        let list = this.data.list
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
    } else { //获取地区
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
    // return console.log(index);
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
// 删除筛选条件-岗位-所有
VM.deleteTagAll = function(e) {
    this.setData({
        checkTagList: []
    })
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
// 处理排序
VM.sortHandle = function() {
    this.setData({
        sortByOrder: this.data.sortByOrder === 1 ? 2 : 1
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
        return false
    }
    // wait
    if (index == 0) {
        return this.setData({
            tagIndex: index,
            tagSubIndex: 0,
            tagSubList: [],
            checkTagList: []
        })
    }
    this.setData({
        tagIndex: index,
        tagSubList: [],
        checkTagList: [],
    })
    // 获取二级
    Req.request('getTagList', {
        classify_id: this.data.tagList[index].id
    }, {
        method: 'get'
    }, res => {
        console.log(res);
        let list = JSON.parse(JSON.stringify(res.data))
        let checkTagList = this.data.checkTagList
        list.unshift({
            id: '',
            name: '全部'
        })
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
            tagSubList2: res.data
        })
    })
}
// 二级分类
VM.tagSubFilter = function(e) {
    let index = util.dataset(e, 'index')
    if (index == 0) {
        return this.setData({
            tagSubAll: true,
            tagSubIndex: 0,
            ['tagSubList[0].selected']: true,
            checkTagList: this.data.tagSubList2
        })
    }
    // 原选-全部
    if (this.data.tagSubAll) {
        this.setData({
            tagSubAll: false,
            checkTagList: [],
            ['tagSubList[0].selected']: false
        })
    } else {
        this.setData({
            tagSubAll: false
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

// 清除筛选条件
VM.cancelSelect = function() {
    // 类型
    if (this.data.filterType == 0) {
        // 清空选中
        this.data.tagSubList.forEach(item => {
            item.selected = false
        })
        this.setData({
            tagIndex: 0,
            tagSubIndex: 0,
            checkTagList: [],
            tagSubList: this.data.tagSubList
        })
    } else { //地址
        this.setData({
            provinceIndex: 0,
            cityIndex: 0,
            areaIndex: 0,
            cityList: [],
            areaList: [],
            address: ''
        })
    }

}
// 确认筛选条件
VM.confirmSelect = function() {
    // 类型
    if (this.data.filterType == 0) {
        this.setData({
            showFilter: false,
            filterType: -1,
        })
    } else { //地址
        // let address = ''
        // if (this.data.provinceIndex > 1) {
        //     address += this.data.provinceList[this.data.provinceIndex]
        // }
        // if (this.data.cityIndex > 1) {
        //     address += this.data.cityList[this.data.cityIndex]
        // }
        // if (this.data.areaIndex > 1) {
        //     address += this.data.areaList[this.data.areaIndex]
        // }
        this.setData({
            showFilter: false,
            filterType: -1,
        })
    }
}
// 按接单数量筛选
VM.sortByOrderHandle = function() {
    let sortType = this.data.sortByOrder === 1 ? 2 : 1
    let list = this.data.list
    list = this.sortOrderArray(list, sortType)
    this.setData({
        sortByTime: 0,
        sortByOrder: sortType,
        list: list
    })
}
// 按入驻时长筛选
VM.sortByTimeHandle = function() {
    let sortType = this.data.sortByTime === 1 ? 2 : 1
    let list = this.data.list
    list = this.sortDateArray(list, sortType)
    this.setData({
        sortByOrder: 0,
        sortByTime: sortType,
        list: list
    })
}
//按接单进行排序
VM.sortOrderArray = function(dataArray, sortType) {
    if (sortType == 1) {
        return dataArray.sort(function(a, b) {
            return b.order_num - a.order_num;
        });
    } else {
        return dataArray.sort(function(a, b) {
            return a.order_num - b.order_num;
        });
    }
}
//按入驻时长进行排序
VM.sortDateArray = function(dataArray, sortType) {
    if (sortType == 1) {
        return dataArray.sort(function(a, b) {
            return b.settle_time - a.settle_time;
        });
    } else {
        return dataArray.sort(function(a, b) {
            return a.settle_time - b.settle_time;
        });
    }
}
// 搜索
VM.confirmSearch = function() {
    // 清空列表数据
    this.setData({
        current: 0,
        total: 0,
        total_page: 1
    })
    // 岗位类型id 数组
    let checkTagArr = []
    for (let i = 0; i < this.data.checkTagList.length; i++) {
        checkTagArr.push(this.data.checkTagList[i].id)
    }
    if (checkTagArr.length <= 0) {
        checkTagArr = ''
    } else {
        checkTagArr = JSON.stringify(checkTagArr)
    }
    Req.request('getServiceList', {
        is_recommend: 0,
        position_id: checkTagArr,
        address: this.data.address,
        keyword: this.data.keyword,
        page: this.data.current + 1,
        identity: app.globalData.roleType,
        rownum: this.data.rownum
    }, {
        method: 'get'
    }, (res) => {
        let list = res.data.list
        let pagination = res.data.pagination
        this.setData({
            list: list,
            current: pagination.current * 1,
            rownum: pagination.rownum * 1,
            total: pagination.total * 1,
            total_page: pagination.total_page * 1,
            isEmpty: pagination.total * 1 <= 0 ? true : false
        })
    })
}
VM.onReachBottom = function() {
    this.getList()
}
Page(VM)
