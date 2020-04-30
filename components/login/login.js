Component({

    properties: {
        // 组件附加的类名
        cln: {
            type: String
        },
        title: {
            type: String,
            value: '提示'
        },
        // 标题 默认显示
        showTitle: {
            type: Boolean,
            value: true
        },
        // 内容区 默认隐藏
        showContent: {
            type: Boolean,
            value: false
        },
        confirmText: {
            type: String,
            value: '确定'
        },
        cancelText: {
            type: String,
            value: '取消'
        },
        showCancel: {
            type: Boolean,
            value: true
        },
    },

    data: {
        // 组件内部数据
    },

    methods: {
        // 弹窗确定事件
        confirmHandle: function() {
            let pages = getCurrentPages()
            let currentPage = pages[pages.length - 1]
            // currentPage.setData({
            //     showLogin: false
            // })
            wx.navigateTo({
                url: '/pages/login/login'
            })
        },
        // 弹窗取消事件
        cancelHandle: function() {
            let pages = getCurrentPages()
            let currentPage = pages[pages.length - 1]
            currentPage.setData({
                showLogin: false
            })
        },
        emptyHandle: function() {
            return false;
        }
    }
})
