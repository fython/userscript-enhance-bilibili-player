import zh_CN from './lang/zh-CN';
import zh_TW from './lang/zh-TW';
import { Settings } from '../common/constants';

const SELECTORS = {
    PLAYER: '#bilibiliPlayer',
    PLAYER_INNER_CONTAINER: '#playerWrap > div > .player',
    PLAYER_WRAPPER: '#playerWrap div',
    PLAYER_MODULE: '#player_module div',
    MENU: 'div.bilibili-player-context-menu-container.black.bilibili-player-context-menu-origin',
    TOAST_CONTAINER: 'div.bilibili-player-video-toast-bottom',
    VIDEO_TITLE: 'h1.video-title',
    DANMAKU_CONTEXT_MENU: '.context-menu-danmaku',
    LIVE_PLAYER: '.bilibili-live-player',
    LIVE_MENU: 'div.bilibili-live-player-context-menu-container',
};

const IDS = {
    MENU_COPY_TS_URL: 'copy-ts-menu-action-item',
    MENU_PIP: 'pip-action-item',
    MENU_SCREENSHOT: 'screenshot-action-item',
    MENU_RECORD: 'record-action-item',
    MENU_SETTINGS: 'settings-action-item',
    TOAST: 'enhance-bili-toast',
};

const TEXT = {
    'zh-CN': zh_CN,
    'zh-TW': zh_TW,
};

const HIDDEN_KEYWORDS = {
    [Settings.MENU_SHOW_RATIO]: '画面比例',
    [Settings.MENU_SHOW_PLAYBACK_SPEED]: '播放速度',
    [Settings.MENU_SHOW_LIGHT_OFF]: '关灯',
    [Settings.MENU_SHOW_MIRROR]: '镜像',
    [Settings.MENU_SHOW_KEYMAP]: '快捷键说明',
    [Settings.MENU_SHOW_CHANGELOG]: '更新历史',
    [Settings.MENU_SHOW_COLOR_AND_SFX]: '视频色彩调整',
    [Settings.MENU_SHOW_VIDEO_INFO]: '视频统计信息',
};

const LIVE_URL_PATTERN = /http(s)?:\/\/live\.bilibili\.com\/.+/;

const USEFUL_VIDEO_URL_PARAMS = [
    'p'
];

export {
    SELECTORS,
    IDS,
    TEXT,
    HIDDEN_KEYWORDS,
    LIVE_URL_PATTERN,
    USEFUL_VIDEO_URL_PARAMS,
};
