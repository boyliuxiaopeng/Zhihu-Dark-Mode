// ==UserScript==
// @name         Zhihu.com Dark Mode
// @namespace    https://www.zhihu.com/
// @version      1.0.0
// @description  Force Zhihu to use its built-in dark theme; avoids FOUC and handles SPA navigation.
// @description:zh-CN  强制知乎使用内置深色主题；避免白屏闪烁，兼容单页应用路由变化。
// @description:zh-TW  強制知乎使用內建深色主題；避免白屏閃爍，兼容單頁應用路由變化。
// @author       老蛤，boyliuxiaopeng
// @license      MIT
// @match        *://*.zhihu.com/*
// @exclude      *://link.zhihu.com/*
// @exclude      *://video.zhihu.com/*
// @exclude      *://www.zhihu.com/pub/book*
// @exclude      *://www.zhihu.com/tardis*
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  const DARK = 'dark';
  const getHtml = () => document.documentElement || document.querySelector('html');

  const applyDark = () => {
    const el = getHtml();
    if (!el) return;
    if (el.getAttribute('data-theme') !== DARK) {
      el.setAttribute('data-theme', DARK);
    }
    // Make UA parts (form controls, scrollbars) dark too.
    el.style.colorScheme = DARK;
  };

  // Hint dark to the UA ASAP to minimize white flash.
  const injectStyle = () => {
    const style = document.createElement('style');
    style.setAttribute('data-zhihu-dark', '1');
    style.textContent = `html { color-scheme: dark !important; }`;
    (document.head || document.documentElement).appendChild(style);
  };

  injectStyle();
  applyDark();

  // Keep it dark if the site toggles back.
  let themeObserver;
  const observeTheme = () => {
    const el = getHtml();
    if (!el) return;
    if (themeObserver) themeObserver.disconnect();
    themeObserver = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'attributes' && m.attributeName === 'data-theme') {
          if (el.getAttribute('data-theme') !== DARK) {
            el.setAttribute('data-theme', DARK);
          }
        }
      }
    });
    themeObserver.observe(el, { attributes: true, attributeFilter: ['data-theme'] });
  };

  observeTheme();

  // Handle client-side navigation (SPA).
  const reapplySoon = () => queueMicrotask(() => { applyDark(); observeTheme(); });

  const _pushState = history.pushState;
  history.pushState = function () {
    const ret = _pushState.apply(this, arguments);
    reapplySoon();
    return ret;
  };

  const _replaceState = history.replaceState;
  history.replaceState = function () {
    const ret = _replaceState.apply(this, arguments);
    reapplySoon();
    return ret;
  };

  window.addEventListener('popstate', reapplySoon);

  // Early retries during initial boot (covers late mutations).
  let tries = 0;
  const iv = setInterval(() => {
    applyDark();
    if (++tries > 40 || document.readyState === 'complete') {
      clearInterval(iv);
    }
  }, 100);
})();
