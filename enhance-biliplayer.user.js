// ==UserScript==
// @name         哔哩哔哩播放器增强
// @namespace    https://github.com/fython/userscript-enhance-bilibili-player
// @version      0.1.5
// @description  为哔哩哔哩播放器加上复制当前播放位置链接、画中画、当前视频截图功能
// @author       Siubeng (fython)
// @license      MIT
// @require      https://code.jquery.com/jquery-3.4.1.slim.min.js
// @supportURL   https://github.com/fython/userscript-enhance-bilibili-player
// @match        *://www.bilibili.com/video/*
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 读取 Cookie 值
     * @param {string} key 
     */
    let getCookie = (key) => {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    };

    // 以哔哩哔哩官方多语言设定为准
    const lang = getCookie('LNG') || 'zh-CN';

    const PLAYER_SELECTOR = '#bilibiliPlayer';
    const MENU_SELECTOR = 'div.bilibili-player-context-menu-container.black.bilibili-player-context-menu-origin';
    const TOAST_CONTAINER_SELECTOR = 'div.bilibili-player-video-toast-bottom';
    const COPY_TS_URL_MENU_ID = 'copy-ts-menu-action-item';
    const PIP_MENU_ID = 'pip-action-item';
    const SCREENSHOT_MENU_ID = 'screenshot-action-item';
    const TOAST_ID = 'enhance-bili-toast'

    // 用户界面文本定义
    const TEXT_RES = (() => {
        if (lang == 'zh-TW') {
            // 繁體中文（台灣地區習慣）
            return {
                'ACTION_COPY_URL_WITH_TIMESTAMP': '拷貝當前時間的視訊鏈接',
                'ACTION_PIP': '彈出子母畫面播放',
                'ACTION_COPY_SCREENSHOT': '拷貝當前時間的視訊擷圖（以視訊實際解析度）',
                'TOAST_COPY_URL_WITH_TIMESTAMP_DONE': (time) => `已拷貝當前位置（${time}）的視訊鏈接至剪貼板。`,
                'TOAST_COPY_URL_FAILED': '拷貝鏈接失敗，您的瀏覽器可能不允許腳本直接修改。',
                'TOAST_PIP_UNSUPPORTED': '您的瀏覽器暫不支援子母畫面播放，可能需要最新的 Chrome。',
                'TOAST_COPY_SCREENSHOT_DONE': '已拷貝當前位置的視訊擷圖至剪貼板。',
                'TOAST_COPY_SCREENSHOT_NOT_READY': '視訊仍在加載狀態，請稍後再嘗試拷貝擷圖。',
            };
        } else {
            // 简体中文（内地地区习惯）
            return {
                'ACTION_COPY_URL_WITH_TIMESTAMP': '复制当前时间的视频链接',
                'ACTION_PIP': '弹出画中画播放',
                'ACTION_COPY_SCREENSHOT': '复制当前时间的视频截图（以视频实际分辨率）',
                'TOAST_COPY_URL_WITH_TIMESTAMP_DONE': (time) => `已复制当前位置（${time}）的视频链接到剪贴板。`,
                'TOAST_COPY_URL_FAILED': '复制链接失败，您的浏览器可能不允许脚本直接修改剪贴板。',
                'TOAST_PIP_UNSUPPORTED': '您的浏览器暂不支持画中画播放，可能需要最新的 Chrome。',
                'TOAST_COPY_SCREENSHOT_DONE': '已复制当前位置的视频截图到剪贴板。',
                'TOAST_COPY_SCREENSHOT_NOT_READY': '视频仍在加载状态，请稍后再尝试复制截图。',
            };
        }
    })();

    /**
     * 复制文本到剪贴板
     * @param {string} text 
     */
    let copyToClipboard = (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return window.clipboardData.setData('Text', text);
        } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            let textarea = document.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand('copy'); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn('Failed to copy to clipboard', ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }

    /**
     * 复制 Canvas 图像到剪贴板，目前仅支持 Chrome 76+ 或其它浏览器的更新版本
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard
     * @param {HTMLCanvasElement} canvas
     * @param {string} [type=image/png] 输出的图像格式
     */
    let copyCanvasToClipboard = null;
    if (navigator.clipboard && navigator.clipboard.write && (typeof ClipboardItem === 'function')) {
        copyCanvasToClipboard = (canvas, type = 'image/png') => {
            canvas.toBlob((blob) => {
                const item = new ClipboardItem({ [type]: blob });
                navigator.clipboard.write([item]);
            }, type);
        };
    }

    // 以 B 站样式显示 Toast
    /**
     * 上一个 Toast 的隐藏回调
     */
    let lastToastCallback = null;
    /**
     * 隐藏 Toast
     */
    let hideToast = () => {
        let container = document.querySelector(TOAST_CONTAINER_SELECTOR);
        let currentToast = document.getElementById(TOAST_ID);
        if (currentToast) {
            container.removeChild(currentToast);
        }
        if (lastToastCallback) {
            clearTimeout(lastToastCallback);
        }
        lastToastCallback = null;
    };
    /**
     * 显示文本为 message 的 Toast
     * @param {string} message 
     */
    let showToast = (message) => {
        let container = document.querySelector(TOAST_CONTAINER_SELECTOR);
        if (container) {
            hideToast();
            let toastItem = $('<div id="' + TOAST_ID + '" class="bilibili-player-video-toast-item" style="margin-top: 4px;"></div>');
            let toastText = $('<div class="bilibili-player-video-toast-item-text"></div>');
            toastText.append($('<span></span>').text(message));
            toastItem.append(toastText);
            container.appendChild(toastItem[0]);
            lastToastCallback = setTimeout(hideToast, 3000);
        } else {
            // Fallback：当 Toast 版本已经改变时，使用普通的 alert
            alert(message);
        }
    };

    /**
     * 以 Lazy 方式对选择的元素进行操作
     * @param {string} selector 
     * @param {Function<Element>} onInject 
     */
    let lazyInject = (selector, onInject) => {
        let callback = setInterval(() => {
            let injectNode = document.querySelector(selector);
            if (injectNode) {
                clearInterval(callback);
                onInject(injectNode);
            }
        }, 100);
    };

    /**
     * 注入播放器菜单
     * @param {Element} menuDiv 
     */
    let injectMenu = (menuDiv) => {
        /**
         * 创建菜单选项
         * @param {string} menuId 
         * @param {string} menuText 
         * @param {Function} onClick 
         */
        let createMenuAction = (menuId, menuText, onClick) => {
            let li = $('<li id="' + menuId + '" class="context-line context-menu-action"></li>');
            let a = $('<a class="context-menu-a js-action" title></a>').text(menuText);
            li.append(a);
            // 应用选项 Hover 样式
            li.mouseenter(() => li.addClass('hover'));
            li.mouseleave(() => li.removeClass('hover'));
            // 选项点击事件
            li.click(onClick);
            return li[0];
        };

        /**
         * 创建复制菜单选项
         */
        let createCopyUrlWithTimestampMenuAction = () => {
            return createMenuAction(COPY_TS_URL_MENU_ID, TEXT_RES['ACTION_COPY_URL_WITH_TIMESTAMP'], () => {
                let video = document.querySelector('video');
                if (video) {
                    let url = new URL(window.location.href);
                    let time = parseInt(video.currentTime);
                    url.searchParams.set('t', time);
                    let showResult = (res) => {
                        if (res) {
                            let h = parseInt(time / 60 / 60);
                            let m = parseInt(time / 60 % 60);
                            let s = parseInt(time % 60);
                            let tsText = '' + (h > 0 ? '' + h + ':' : '') + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
                            showToast(TEXT_RES['TOAST_COPY_URL_WITH_TIMESTAMP_DONE'](tsText));
                        } else {
                            showToast(TEXT_RES['TOAST_COPY_URL_FAILED']);
                        }
                    };
                    let result = copyToClipboard(url.toString());
                    if (result instanceof Promise) {
                        result.then(() => showResult(true), () => showResult(false));
                    } else {
                        showResult(result);
                    }
                }
            });
        };

        /**
         * 创建画中画菜单选项
         */
        let createPipMenuAction = () => {
            return createMenuAction(PIP_MENU_ID, TEXT_RES['ACTION_PIP'], () => {
                let video = document.querySelector('video');
                if (video) {
                    if (video.requestPictureInPicture) {
                        video.disablePictureInPicture = false;
                        video.requestPictureInPicture();
                    } else {
                        showToast(TEXT_RES['TOAST_PIP_UNSUPPORTED']);
                    }
                }
            });
        };

        /**
         * 视频截图菜单选项
         */
        let createCopyScreenshotMenuAction = () => {
            return createMenuAction(SCREENSHOT_MENU_ID, TEXT_RES['ACTION_COPY_SCREENSHOT'], () => {
                let video = document.querySelector('video');
                if (video) {
                    if (video.readyState >= 2) {
                        let canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        let ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        copyCanvasToClipboard(canvas);
                        showToast(TEXT_RES['TOAST_COPY_SCREENSHOT_DONE']);
                    } else {
                        showToast(TEXT_RES['TOAST_COPY_SCREENSHOT_NOT_READY']);
                    }
                }
            });
        };

        /**
         * 监听菜单变化事件
         * @param {Element} menu 
         */
        let onMenuMutated = (menu) => {
            let ul = menu.querySelector('ul');
            if (menu.classList.contains('active')) {
                // 不要注入弹幕菜单
                if (menu.querySelector('.context-menu-danmaku')) {
                    return;
                }

                let copyMenuAction = document.getElementById(COPY_TS_URL_MENU_ID);
                if (!copyMenuAction) {
                    ul.appendChild(createCopyUrlWithTimestampMenuAction());
                }

                let screenshotMenuAction = document.getElementById(SCREENSHOT_MENU_ID);
                // 截图菜单仅在支持 Clipboard.write() API 的浏览器上显示
                if (!screenshotMenuAction && copyCanvasToClipboard) {
                    ul.appendChild(createCopyScreenshotMenuAction());
                }

                // B 站已经提供官方的画中画按钮，即将彻底从代码中移除。
                // let pipMenuAction = document.getElementById(PIP_MENU_ID);
                // if (!pipMenuAction) {
                //     ul.appendChild(createPipMenuAction());
                // }
            } else {
                [...ul.childNodes].forEach(el => ul.removeChild(el));
            }
        };
        let menuObserver = new MutationObserver(() => onMenuMutated(menuDiv));
        menuObserver.observe(menuDiv, { childList: true, attributes: true });
        // 首次注入即菜单首次出现，MutationObserver 并不会触发，需要手动执行一次回调
        onMenuMutated(menuDiv);
    };

    // 注入播放器
    lazyInject(PLAYER_SELECTOR, (player) => {
        let playerObserver = new MutationObserver(() => {
            let menu = player.querySelector(MENU_SELECTOR);
            if (menu) {
                playerObserver.disconnect();
                injectMenu(menu);
            }
        });
        playerObserver.observe(player, { childList: true });
    });
})();