const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        tagAll: false, //一级分类 选中全部
        tagSubAll: false, //二级分类 选中全部
        // 筛选条件 0类型 1地址
        filterType: 0,
        titleArr: ['选择类型', '选择地址'],
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
    let filterType = query.type == 'type' ? 0 : 1
    this.setData({
        filterType: filterType
    })
    // 获取职位
    if (filterType == 0) {
        this.setData({
            checkTagList: app.globalData.oldTagList
        })
        let pages = getCurrentPages()
        let prevPage = pages[pages.length - 2]
        let {
            tagAll,
            tagSubAll
        } = prevPage.data

        if (tagAll) {
            this.setData({
                tagIndex: 0,
                tagAll: tagAll,
                tagSubAll: tagSubAll,
            })
        } else {
            this.setData({
                tagAll: tagAll,
                tagSubAll: tagSubAll,
            })
        }

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
            console.log(list);
            if (tagSubAll) {
                list.forEach((o, i) => {
                    if (o.id == this.data.checkTagList[0].id) {
                        this.setData({
                            tagIndex: i
                        })
                        this.initTagFilter(i)
                    }
                })
                // for (let i=0;i<list.length;i++){
                //     let o = list[i]
                //     o.id == this.data.checkTagList[0].id
                // }
            }
        })
    } else { //获取地区
        this.setData({
            address: query.address
        })
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
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}

// 删除筛选条件
VM.deleteTagItem = function(e) {
    let index = util.dataset(e, 'index')
    let tar;

    // 1.全部
    if (this.data.tagAll) {
        return this.setData({
            tagAll: false,
            tagIndex: -1,
            checkTagList: []
        })
    }
    if (this.data.tagSubAll) {
        let tar = 'tagSubList[0].selected'
        return this.setData({
            tagSubAll: false,
            tagSubIndex: -1,
            checkTagList: [],
            [tar]: false
        })
    }

    // 2.非全部
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
// 初始化一级分类
VM.initTagFilter = function(index) {
    console.log(index);
    // 获取二级
    Req.request('getTagList', {
        classify_id: this.data.tagList[index].id
    }, {
        method: 'get'
    }, res => {
        let list = res.data
        list.unshift({
            id: 0,
            name: '全部',
            selected: true
        })

        this.setData({
            tagSubIndex: 0,
            tagSubList: list
        })
    })
}
// 一级分类
VM.tagFilter = function(e) {
    let index = util.dataset(e, 'index')
    if (index == this.data.tagIndex) {
        return
    }
    this.setData({
        tagIndex: index,
        tagSubList: []
    })
    if (index == 0) {
        return this.setData({
            tagAll: true,
            tagSubAll: false,
            checkTagList: [{
                id: 'all',
                name: '全部',
                isAll: true
            }]
        })
    } else {
        // this.setData({
        //     tagAll: false
        // })
    }
    // 获取二级
    Req.request('getTagList', {
        classify_id: this.data.tagList[index].id
    }, {
        method: 'get'
    }, res => {
        console.log(res);
        let list = res.data
        let checkTagList = this.data.checkTagList
        list.unshift({
            id: 0,
            name: '全部'
        })
        // wait
        if (this.data.tagAll || this.data.tagSubAll) {
            return this.setData({
                tagSubList: list
            })
        }
        // 
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
    // 选中二级全部
    if (index == 0) {
        let checkedTag = this.data.tagList[this.data.tagIndex]
        let id = checkedTag.id
        let name = checkedTag.name + '-全部'

        let tagSubList = this.data.tagSubList
        tagSubList.forEach(item => {
            item.selected = false
        })
        tagSubList[0].selected = true
        return this.setData({
            tagAll: false,
            tagSubAll: true,
            checkTagList: [{
                id: id,
                name: name,
                isSubAll: true
            }],
            tagSubList: tagSubList
        })
    }
    let tagSubList = this.data.tagSubList
    let checkTagList = this.data.checkTagList
    tagSubList[0].selected = false
    checkTagList.forEach((o, i) => {
        o.isAll && checkTagList.splice(i, 1)
        o.isSubAll && checkTagList.splice(i, 1)
    })
    this.setData({
        tagAll: false,
        tagSubAll: false,
        tagSubList: tagSubList,
    })

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
            address: '不限',
            provinceIndex: index,
            cityList: [],
            areaList: [],
            cityIndex: -1,
            areaIndex: -1
        })
    }
    this.setData({
        address: this.data.provinceList[index].name,
        provinceIndex: index,
        cityList: [],
        areaList: [],
        cityIndex: -1,
        areaIndex: -1
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
            cityIndex: 0,
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
            areaIndex: -1
        })
    }
    this.setData({
        address: this.data.provinceList[this.data.provinceIndex].name + this.data.cityList[index].name,
        cityIndex: index,
        areaList: [],
        areaIndex: -1,
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
            areaIndex: 0,
            areaList: list
        })
    })
}
VM.areaFilter = function(e) {
    let index = util.dataset(e, 'index')
    let data = this.data
    if (index == 0) {
        return this.setData({
            address: data.provinceList[data.provinceIndex].name + data.cityList[data.cityIndex]
                .name,
            areaIndex: 0
        })
    }
    this.setData({
        address: data.provinceList[data.provinceIndex].name + data.cityList[data.cityIndex].name + data.areaList[
            index].name,
        areaIndex: index
    })
}

// 清除
VM.cancelSelect = function() {
    // 类型
    if (this.data.filterType == 0) {
        this.data.tagSubList.forEach(item => {
            item.selected = false
        })
        this.setData({
            tagAll: false,
            tagSubAll: false,
            tagIndex: -1,
            tagSubIndex: -1,
            checkTagList: [],
            tagSubList: []
        })
    } else { //地址
        this.setData({
            provinceIndex: -1,
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
    // 类型
    if (this.data.filterType == 0) {
        if (this.data.checkTagList.length <= 0) {
            return util.Toast('请选择至少一个类型')
        }
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        let address = this.data.address;
        prevPage.setData({
            tagAll: this.data.tagAll,
            tagSubAll: this.data.tagSubAll,
            typeList: this.data.checkTagList
        });
        //返回上一页
        wx.navigateBack({
            delta: 1
        });
    } else { //地址
        // let data = this.data
        let address = this.data.address
        // let addressValiate = data.provinceIndex >= 0 && data.cityIndex >= 0 && data.areaIndex >= 0
        if (address == '') {
            return util.Toast('请选择地址')
        }
        // if (!addressValiate) {
        //     return util.Toast('请选择完整地址')
        // }
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            address: address
        });
        //返回上一页
        wx.navigateBack({
            delta: 1
        });
    }
}
Page(VM)
