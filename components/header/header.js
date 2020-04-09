const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const base = require('../../utils/base.js');
const util = require('../../utils/util.js');
Component({
    externalClasses:[''],
    /**
     * 组件的属性列表
     */
    properties: {
        // 标题
        title: {
            type: String,
            value: ''
        },
        // 是否显示“个人中心”按钮
        isMe: {
            type: Boolean,
            value: false
        },
        // 是否显示“首页”按钮
        showHome: {
            type: Boolean,
            value: false
        },
        // 是否为第一页
        isHome: {
            type: Boolean,
            value: false
        },
        // 是否显示返回按钮
        showBack: {
            type: Boolean,
            value: false
        },
        // 是否自定义返回事件
        custom: {
            type: Boolean,
            value:false
        },
        // 引用该组件传入的头部样式
        cln:{
            type:String,
            value:''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        padHeight: 0,
        headBarHeight: 0,
    },
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    lifetimes: {
        attached: function() {
            util.setHeader(this);
        },
        moved: function() {},
        detached: function() {},
    },

    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function() {}, // 此处attached的声明会被lifetimes字段中的声明覆盖
    ready: function() {},

    // 组件所在页面的生命周期函数
    pageLifetimes: {
        show: function() {},
        hide: function() {},
        resize: function() {},
    },
    /**
     * 组件的方法列表
     */
    methods: {
        customTrigger() {
            if (this.data.custom) {
                this.triggerEvent('back', {}, {})
            }
        }
    }
})
