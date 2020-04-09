const app = getApp();
const formcheck = require('../../utils/formcheck.js');
const base = require('../../utils/base.js');
const util = require('../../utils/util.js');
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 标题
        tabbarIndex: {
            type: Number,
            value: 0
        },
        // 引用该组件传入的tabbar样式
        cln: {
            type: String,
            value: ""
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 1.服务商 2.商家
        tabbarType: 1,
        tabbarList: [],
        tabbarListArr: [
            [{
                    "pagePath": "/pages/index/index",
                    "text": "首页",
                    "iconPath": "/images/tabbar/icon01.png",
                    "selectedIconPath": "/images/tabbar/icon01_sel.png"
                },
                {
                    "pagePath": "/pages/activity/index/index",
                    "text": "接活动",
                    "iconPath": "/images/tabbar/icon02.png",
                    "selectedIconPath": "/images/tabbar/icon02_sel.png"
                },
                {
                    "pagePath": "/pages/resource/index/index",
                    "text": "资源库",
                    "iconPath": "/images/tabbar/icon03.png",
                    "selectedIconPath": "/images/tabbar/icon03_sel.png"
                },
                {
                    "pagePath": "/pages/me/index/index",
                    "text": "我的",
                    "iconPath": "/images/tabbar/icon04.png",
                    "selectedIconPath": "/images/tabbar/icon04_sel.png"
                }
            ],
            [{
                    "pagePath": "/pages/index/index",
                    "text": "首页",
                    "iconPath": "/images/tabbar/icon01.png",
                    "selectedIconPath": "/images/tabbar/icon01_sel.png"
                },
                {
                    "pagePath": "/pages/activity/index/index",
                    "text": "接活动",
                    "iconPath": "/images/tabbar/icon02.png",
                    "selectedIconPath": "/images/tabbar/icon02_sel.png"
                },
                {
                    "pagePath": "/pages/resource/index/index",
                    "text": "资源库",
                    "iconPath": "/images/tabbar/icon03.png",
                    "selectedIconPath": "/images/tabbar/icon03_sel.png"
                },
                {
                    "pagePath": "/pages/workbench/index/index",
                    "text": "工作台",
                    "iconPath": "/images/tabbar/icon05.png",
                    "selectedIconPath": "/images/tabbar/icon05_sel.png"
                }
            ]
        ]
    },
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    lifetimes: {
        created: function() {
            // let type = app.globalData.roleType
            // this.setData({
            //    tabbarType: this.data.tabbarListArr[type]
            // })
            // console.log('tabbar类型'+this.data.tabbarType);
            // let type = app.globalData.roleType 
            // // this.data.tabbarList = this.data.tabbarListArr[type-1]
            // this.setData({
            //    tabbarList: this.data.tabbarListArr[type-1]
            // })
            // console.log(this.data.tabbarList);
        },
        attached: function() {
            // 不箭头函数 this指向该组件实例?
            base.onLoad(this);
            let type = app.globalData.roleType
            this.setData({
                tabbarList: this.data.tabbarListArr[type - 1],
                tabbarType: type
            })
            console.log('tabbar类型' + this.data.tabbarType);
            console.log('tabbar数组' + this.data.tabbarList);
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
    methods: {}
})
