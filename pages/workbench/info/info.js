const app = getApp();
const formcheck = require('../../../utils/formcheck.js');
const util = require('../../../utils/util.js');
const base = require('../../../utils/base.js');
const Req = require('../../../utils/request.js');
const VM = {
  data: {
    compInfo: {
      logo: '../../../images/workbench/img.png',
      compname: '',
      phone: '',
      intro: '',
      isdefaultlogo: true, //默认logo
    }
  }
}
VM.init = function(query) {
  // 设置自定义头部
  util.setHeader(this);
}
VM.onLoad = function(query) {
  this.init(query)
  base.onLoad(this)
}
VM.onShareAppMessage = function() {
  return {
    title: "分享标题",
    path: '/pages/index/index',
    imageUrl: ''
  };
}

// 上传图片
VM.choseImg = function() {
  let that = this;
  wx.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success(res) {
      console.log(res)
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths[0]
      that.setData({
        ['compInfo.logo']: tempFilePaths,
        ['compInfo.isdefaultlogo']: false,
      })
    }
  })
}
// 修改公司名
VM.changecomp = function(e) {
  this.setData({
    ['compInfo.compname']: e.detail.value,
  })
}
// 修改电话
VM.changePhone = function (e) {
  this.setData({
    ['compInfo.phone']: e.detail.value,
  })
}
// 修改简介
VM.changeintro = function (e) {
  this.setData({
    ['compInfo.intro']: e.detail.value,
  })
}
// 提交
VM.formSubmit = function(e) {
  var data = this.data.compInfo;
  if (data.isdefaultlogo) {
    util.errorToast('请上传Logo')
  } else if (formcheck.check_null(data.compname)){
    util.errorToast('请输入企业名称')
  } else if (!formcheck.check_phone(data.phone)){
    util.errorToast('请输入正确的手机')
  } else if (formcheck.check_null(data.intro)){
    util.errorToast('请输入描述')
  } else if (data.intro.length > 20){
    util.errorToast('描述不能多于20个字')
  }else {
    Req.request('completeEnterpriseInfo', {
      logo: data.logo,
      name: data.compname,
      contact_phone: data.phone,
      profiles: data.intro
    }, {
      method: 'post'
    }, res => {
      console.log(res)
      util.Toast('保存成功')
      setTimeout(()=>{
          wx.navigateBack({})     //返回上一级      
      },1000)
    }, err => {
      console.log(err)
    })
  }


}
Page(VM)