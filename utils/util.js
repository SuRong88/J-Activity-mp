function formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 将&nbsp;转换为可识别
function space(str) {
    var str = str.replace(/&amp;nbsp;/g, '')
    return str
}

// 简易提示框
function Toast(msg = '提示', duration = 1500) {
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: duration,
        // mask: true
    })
}

// 错误提示
function errorToast(msg = '错误', duration = 1500) {
    wx.showToast({
        title: msg,
        icon: 'none',
        image: '/images/icons/warn.png',
        duration: duration
    })
}

// 成功提示
function successToast(msg = '成功', duration = 1500) {
    wx.showToast({
        title: msg,
        // icon: 'success',
        image: '/images/icons/success.png',
        duration: duration
    })
}

// “悲伤”提示
function sadToast(msg = '伤心', duration = 1500) {
    wx.showToast({
        title: msg,
        icon: 'none',
        image: '/images/icons/sad.png',
        duration: duration
    })
}

// 展示加载
function showLoading(title = '加载中', mask = true) {
    wx.showLoading({
        title: title,
        mask: true
    })
}
// 关闭加载
function hideLoading(success, fail, complete) {
    wx.hideLoading()
}

// 模态弹窗
function showModal(title, content, showCancel, cancelText, confirmText, cb_confirm, cb_cancel) {
    // 防止显示多个showModal
    let globalData = getApp().globalData
    if (globalData.showModaled) {
        return false
    }
    globalData.showModaled = true
    // 防止显示多个showModal end
    wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        confirmText: confirmText,
        cancelColor: '#000000',
        confirmColor: '#FC7F03',
        success: function(res) {
            if (res.confirm) {
                globalData.showModaled = false
                cb_confirm && cb_confirm()
            } else if (res.cancel) {
                globalData.showModaled = false
                cb_cancel && cb_cancel()
            }
        }
    })
}

// 设置自定义头部高度
function setHeader(that) {
    wx.getSystemInfo({
        success: res => {
            that.setData({
                headBarHeight: res.statusBarHeight / (res.windowWidth / 750),
                padHeight: res.statusBarHeight / (res.windowWidth / 750) + 88
            })
            // console.log(res.statusBarHeight / (res.windowWidth / 750))
        }
    })
}

// 获取 e.currentTarget.dataset 某个key值
function dataset(e, key) {
    return e.currentTarget.dataset[key]
}

// 验证码倒计时
function setDowntime(that, downtime = 60) {
    that.setData({
        phone_code_text: downtime + "s",
        phone_code_class: "waiting",
        phone_code_flag: true
    });
    let timer = setInterval(function() {
        if (downtime > 1) {
            that.setData({
                phone_code_text: --downtime + "s"
            })
        } else {
            clearInterval(timer);
            that.setData({
                phone_code_text: "重新发送",
                phone_code_class: "",
                phone_code_flag: false
            });
        }
    }, 1000)
}

module.exports = {
    formatTime,
    space,
    Toast,
    errorToast,
    successToast,
    sadToast,
    showLoading,
    hideLoading,
    showModal,
    setHeader,
    dataset,
    setDowntime
}
