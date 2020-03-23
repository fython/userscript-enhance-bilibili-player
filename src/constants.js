import zh_CN from './lang/zh-CN';
import zh_TW from './lang/zh-TW';

const SELECTORS = {
    PLAYER: '#bilibiliPlayer',
    MENU: 'div.bilibili-player-context-menu-container.black.bilibili-player-context-menu-origin',
    TOAST_CONTAINER: 'div.bilibili-player-video-toast-bottom',
};

const IDS = {
    MENU_COPY_TS_URL: 'copy-ts-menu-action-item',
    MENU_PIP: 'pip-action-item',
    MENU_SCREENSHOT: 'screenshot-action-item',
    TOAST: 'enhance-bili-toast',
};

const TEXT = {
    'zh-CN': zh_CN,
    'zh-TW': zh_TW,
};

export {
    SELECTORS,
    IDS,
    TEXT,
};