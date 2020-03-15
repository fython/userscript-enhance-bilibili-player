// ==UserScript==
// @name         哔哩哔哩播放器增强
// @namespace    https://github.com/fython/userscript-enhance-bilibili-player
// @version      0.1.2
// @description  为哔哩哔哩播放器加上复制当前播放位置链接的菜单选项，增强使用体验
// @author       Siubeng (fython)
// @license      MIT
// @supportURL   https://github.com/fython/userscript-enhance-bilibili-player
// @match        *://www.bilibili.com/video/av*
// ==/UserScript==

(function() {
    'use strict';

    const PLAYER_SELECTOR = '#bilibiliPlayer';
    const MENU_SELECTOR = 'div.bilibili-player-context-menu-container.black.bilibili-player-context-menu-origin';
    const TOAST_CONTAINER_SELECTOR = 'div.bilibili-player-video-toast-bottom';
    const COPY_MENU_ID = 'copy-menu-action-item';
    const TOAST_ID = 'enhance-bili-toast'

    // 复制文本到剪贴板
    let copyToClipboard = (text) => {
        if (window.clipboardData && window.clipboardData.setData) {
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

    // 以 B 站样式显示 Toast
    let lastToastCallback = null;
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
    let showToast = (message) => {
        let container = document.querySelector(TOAST_CONTAINER_SELECTOR);
        if (container) {
            hideToast();
            let toastItem = document.createElement('div');
            toastItem.id = TOAST_ID;
            toastItem.className = 'bilibili-player-video-toast-item';
            toastItem.onclick = hideToast;
            let toastText = document.createElement('div');
            toastText.className = 'bilibili-player-video-toast-item-text';
            let toastTextSpan = document.createElement('span');
            toastTextSpan.innerText = message;
            toastText.appendChild(toastTextSpan);
            toastItem.appendChild(toastText);
            container.appendChild(toastItem);
            lastToastCallback = setTimeout(hideToast, 3000);
        } else {
            // Fallback：当 Toast 版本已经改变时，使用普通的 alert
            alert(message);
        }
    };

    // 以 Lazy 方式对选择的元素进行操作
    let lazyInject = (selector, onInject) => {
        let callback = setInterval(() => {
            let injectNode = document.querySelector(selector);
            if (injectNode) {
                clearInterval(callback);
                onInject(injectNode);
            }
        }, 100);
    };

    // 注入播放器菜单
    let injectMenu = (menuDiv) => {
        // 创建复制菜单选项
        let createCopyMenuAction = () => {
            let copyLi = document.createElement('li');
            copyLi.id = COPY_MENU_ID;
            copyLi.className = 'context-line context-menu-action';
            let copyA = document.createElement('a');
            copyA.className = 'context-menu-a js-action';
            copyA.setAttribute('title', null);
            copyA.appendChild(document.createTextNode('复制当前时间的视频链接'));
            copyLi.appendChild(copyA);
            // 应用选项 Hover 样式
            copyLi.addEventListener('mouseenter', () => {
                copyLi.classList.add('hover');
            });
            copyLi.addEventListener('mouseleave', () => {
                copyLi.classList.remove('hover');
            });
            // 选项点击事件
            copyLi.onclick = () => {
                let video = document.querySelector('video');
                if (video) {
                    let url = new URL(window.location.href);
                    let time = parseInt(video.currentTime);
                    url.searchParams.set('t', time);
                    if (copyToClipboard(url.toString())) {
                        let h = parseInt(time / 60 / 60);
                        let m = parseInt(time / 60 % 60);
                        let s = parseInt(time % 60);
                        showToast('已复制当前位置（' + (h > 0 ? '' + h + ':' : '') + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s) + '）的视频链接到剪贴板。');
                    } else {
                        showToast('复制链接失败，您的浏览器可能不允许脚本直接修改剪贴板。');
                    }
                }
            };
            return copyLi;
        };

        // 监听菜单变化事件
        let onMenuMutated = (menu) => {
            let ul = menu.querySelector('ul');
            if (menu.classList.contains('active')) {
                let copyMenuAction = document.getElementById(COPY_MENU_ID);
                if (!copyMenuAction) {
                    ul.appendChild(createCopyMenuAction());
                }
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