// ==UserScript==
// @name                 Zhihu.com Dark Mode
// @namespace            https://www.zhihu.com/
// @version              0.8
// @description          Enable Zhihu.com Dark Mode
// @description:zh-CN    开启知乎黑暗模式
// @description:zh-TW    開啟知乎黑暗模式
// @description          原作者(https://greasyfork.org/zh-CN/scripts/404391-zhihu-com-dark-mode)
// @author               老蛤，boyliuxiaopeng
// @match                *://*.zhihu.com/*
// @license              GEN
// @grant                none
// ==/UserScript==

(function() {
    'use strict';

    const ignoreList = [
        'link.zhihu.com',
        'video.zhihu.com',
        'www.zhihu.com/pub/book',
        'www.zhihu.com/tardis',
    ];

    const checkURL = (url) => {
        for (const u of ignoreList) {
            if (url.indexOf(u) !== -1) {
                return false;
            }
        }
        return true;
    };

    if (checkURL(location.href)) {
        const htmlElement = document.querySelector('html');
        // 如果当前主题不是深色，就直接把它设置为深色
        if (htmlElement && htmlElement.getAttribute('data-theme') !== 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
        }
    }
})();
