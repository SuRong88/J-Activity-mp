/* -------------通用返回-------------- */
function returnBack(e, delta = 1) {
    // 返回页数
    var num = getApp().dataset(e, 'delta') * 1;
    num && (delta = num);
    wx.navigateBack({
        delta: delta
    });
    console.log('返回' + delta + '页');
};

/* -------------空函数-------------- */
function emptyHandle(e) {
    return false
};

/* -------------公用跳转-------------- */
var jumpFlag = true
function jump(e) {
    if (!jumpFlag) {
        return false;
    }
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var oldUrl = currentPage.route;
    var newUrl = getApp().dataset(e, 'url');
    var type = getApp().dataset(e, 'type');
    // 1.未登录可跳转页面
    var allowPages = ['/pages/index/index', '/pages/activity/index/index', '/pages/activity/detail/detail',
        '/pages/resource/index/index', '/pages/resource/detail/detail', '/pages/enterprise/index/index',
        '/pages/enterprise/detail/detail'
    ]
    var isLogined = getApp().globalData.isLogined
    var checkIndex = newUrl.indexOf('?')
    var checkUrl = newUrl
    if (checkIndex >= 0) {
        checkUrl = checkUrl.slice(0, checkIndex)
    }
    if (allowPages.indexOf(checkUrl) < 0 && !isLogined) {
        return currentPage.setData({
            showLogin: true
        })
    }
    jumpFlag = false
    // console.log(oldUrl, newUrl, type);
    // console.log(checkIndex, checkUrl);
    // console.log(allowPages.indexOf(checkUrl));
    // 1.未登录可跳转页面 end
    // 2.跳转
    if (`/${oldUrl}` == newUrl) {
        return false
    }
    if (type == 'reLaunch') {
        newUrl && wx.reLaunch({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    } else if (type == 'switchTab') {
        newUrl && wx.switchTab({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    } else if (type == 'redirect') {
        newUrl && wx.redirectTo({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    } else {
        newUrl && wx.navigateTo({
            url: newUrl,
            success: () => {
                jumpFlag = true
            }
        });
    }
}

/* -------------外联跳转(待测)-------------- */
function webJump(e) {
    var url = getApp().dataset(e, 'url');
    if (/^http/.test(url)) {
        wx.navigateTo({
            url: '/pages/web/web?url=' + encodeURIComponent(url)
        });
    }
};

/* -------------初始化base-------------- */
function onLoad(page) {
    page.emptyHandle = emptyHandle;
    page.returnBack = returnBack;
    page.base_jump = jump;
    page.base_webJump = webJump;
    // 判断当前是否iphoneX 
    var sys = getApp().getSystemInfo(),
        model = sys.model.toLowerCase(),
        is_iphone = /iphone/.test(sys.model.toLowerCase()),
        is_iphonex = /iphone\D*x/.test(model),
        system;
    // 判断系统
    system = is_iphone ? 'ios' : 'android';
    page.setData({
        is_iphonex,
        system,
        isHome: getCurrentPages().length <= 1,
        showLogin: false
    });
}

module.exports = {
    onLoad
};
