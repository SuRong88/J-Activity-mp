const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
    data: {
        type: 1, // 0编辑还是1添加操作
        titleArr: ['编辑地址', '添加地址'],
        name: '',
        phone: '',
        address: '',
        addressDetail: '',
        provinceId: '',
        cityId: '',
        areaId: ''
    }
}
VM.init = function(query) {
    // 设置自定义头部
    util.setHeader(this);
    console.log(query)
    let type = query.type || 1
    this.setData({
        type: type
    })
    if (type == 0) {
        let addressId = query.id
        Req.request('getAddressDetail', {
            id: addressId
        }, {
            method: 'get'
        }, res => {
            let inf = res.data
            this.setData({
                name: inf.name,
                phone: inf.phone,
                address: inf.province_name + inf.city_name + inf.district_name,
                addressDetail: inf.address,
                provinceId: inf.province,
                cityId: inf.city,
                areaId: inf.district
            })
        })
    }
}
VM.onLoad = function(query) {
    this.init(query)
    base.onLoad(this)
}
// 输入
VM.changeInput = function(e) {
    let key = util.dataset(e, 'key')
    if (key == 'name') {
        this.setData({
            name: e.detail.value.trim()
        });
    } else if (key == 'phone') {
        this.setData({
            phone: e.detail.value.trim()
        });
    } else {
        this.setData({
            addressDetail: e.detail.value.trim()
        });
    }
}
VM.addAddress = function(e) {
    let data = this.data
    if (formcheck.check_null(data.name)) {
        return util.Toast('请填写收件人')
    }
    if (formcheck.check_null(data.phone)) {
        return util.Toast('请填写联系电话')
    }
    if (formcheck.check_null(data.address)) {
        return util.Toast('请选择收件地区')
    }
    if (formcheck.check_null(data.addressDetail)) {
        return util.Toast('请填写详细地址')
    }
    Req.request('addAddress', {
        name: data.name,
        phone: data.phone,
        address: data.addressDetail,
        province: data.provinceId,
        city: data.cityId,
        district: data.areaId
    }, {
        method: data.type == 1 ? 'post' : 'put'
    }, res => {
        util.Toast('保存成功')
        setTimeout(() => {
            wx.navigateBack({
                delta: 1
            })
        }, 1500)
    })
}
Page(VM)
