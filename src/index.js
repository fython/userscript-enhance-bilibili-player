import { SELECTORS, IDS, TEXT, HIDDEN_KEYWORDS, LIVE_URL_PATTERN, USEFUL_VIDEO_URL_PARAMS } from './constants';
import { Settings, TimestampStyle } from '../common/constants';
import * as UI from './ui';
import * as Storage from './util/storage';
import * as Clipboard from './util/clipboard';
import {RecorderController} from './util/recorder';
import EnhancePluginStore from '../common/store';

const LOCALIZED = TEXT[Storage.getLanguage()];
let lastPlayerElement = null;
/**
 * @type {EnhanceUIBase|LiveEnhanceUIBase}
 */
let ui = null;
/**
 * @type {EnhancePluginStore}
 */
const store = new EnhancePluginStore();
/**
 * @type {RecorderController}
 */
let recorderController = null;

class MainEnhanceUI extends UI.EnhanceUIBase {
    constructor(player, options) {
        super(player, options);
    }

    async copyUrlWithTimestamp() {
        let video = $('video');
        if (video.length) {
            video = video[0];
            const url = new URL(window.location.href);
            // 清理 Hash
            url.hash = '';
            // 根据用户设定清理剩余的参数
            if (store.cleanUrl) {
                const leftParams = [...url.searchParams].filter(([key]) => USEFUL_VIDEO_URL_PARAMS.indexOf(key) !== -1);
                if (leftParams.length) {
                    url.search = '?' + leftParams.map(([k, v]) => `${k}=${v}`)
                        .reduce((prev, next) => `${prev}&${next}`);
                } else {
                    url.search = '';
                }
            }
            // 设定当前时间参数
            const time = parseInt(video.currentTime);
            const h = parseInt(time / 60 / 60);
            const m = parseInt(time / 60 % 60);
            const s = parseInt(time % 60);
            if (store.timestampStyle === TimestampStyle.HMS) {
                let tsArg = '';
                if (h > 0) tsArg += h + 'h';
                if (m > 0) tsArg += m + 'm';
                tsArg += s + 's';
                url.searchParams.set('t', tsArg);
            } else {
                url.searchParams.set('t', time);
            }

            // 复制 URL 到剪贴板
            if (await Clipboard.copyText(url.toString())) {
                const tsText = '' + (h > 0 ? '' + h + ':' : '') + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
                ui.showToast(LOCALIZED.TOAST_COPY_URL_WITH_TIMESTAMP_DONE(tsText));
            } else {
                ui.showToast(LOCALIZED.TOAST_COPY_URL_FAILED);
            }
        }
    }

    async copyScreenshot() {
        let video = $('video');
        if (video.length) {
            video = video[0];
            if (video.readyState >= 2) {
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const fmt = store.screenshotFormat;
                const quality = (fmt === 'image/png') ? 1 : (store.screenshotQuality / 100);
                try {
                    await Clipboard.copyCanvasImage(canvas, fmt, quality);
                    ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_DONE);
                } catch (ex) {
                    window.console.error(ex);
                    ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_FAILED);
                }
                canvas = null;
            } else {
                ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_NOT_READY);
            }
        }
    }

    async startRecord() {
        let mimeType = store.recordMimeType;
        if (mimeType === 'default') {
            mimeType = undefined;
        }
        window.console.log('Start record in mimeType=' + mimeType);
        try {
            recorderController = RecorderController.captureVideoElement($('video')[0], mimeType);
            recorderController.onrecordstop = () => window.console.log('record stop');
            recorderController.onrecorderror = (event) => window.console.error(event);
            ui.showToast(LOCALIZED.TOAST_RECORD_STARTED);
        } catch (e) {
            window.console.error(e);
            ui.showToast(LOCALIZED.TOAST_RECORD_START_FAILED);
        }
    }

    async stopRecord() {
        if (recorderController && recorderController.isRecording) {
            await recorderController.stopSync();
            const videoTitle = $(SELECTORS.VIDEO_TITLE).attr('title');
            try {
                recorderController.save(`${videoTitle}_${bvid}_录制片段`);
            } catch (e) {
                window.console.log(e);
            }
        }
    }

    async destroy() {
        await this.stopRecord();
    }

    onInflateMenuActions() {
        const menuActions = [];
        if (store.getValue(Settings.MENU_SHOW_COPY_TS_URL, 1) === 1) {
            menuActions.push({
                id: IDS.MENU_COPY_TS_URL,
                title: LOCALIZED.ACTION_COPY_URL_WITH_TIMESTAMP,
                callback: this.copyUrlWithTimestamp
            });
        }
        if (store.getValue(Settings.MENU_SHOW_COPY_SCREENSHOT, 1) === 1) {
            menuActions.push({
                id: IDS.MENU_SCREENSHOT,
                title: LOCALIZED.ACTION_COPY_SCREENSHOT,
                callback: this.copyScreenshot
            });
        }
        if (store.getValue(Settings.MENU_SHOW_RECORD, 1) === 1) {
            if (recorderController == null || !recorderController.isRecording) {
                menuActions.push({
                    id: IDS.MENU_RECORD,
                    title: LOCALIZED.ACTION_RECORD_START,
                    callback: this.startRecord
                });
            } else {
                menuActions.push({
                    id: IDS.MENU_RECORD,
                    title: LOCALIZED.ACTION_RECORD_STOP,
                    callback: this.stopRecord
                });
            }
        }
        menuActions.push({
            id: IDS.MENU_SETTINGS,
            title: LOCALIZED.ACTION_SETTINGS,
            callback: () => {
                GM_openInTab('https://biliplayer.gwo.app', { active: true });
            }
        });
        return menuActions;
    }

    onInflateHiddenActions() {
        const hiddenActions = [];
        for (const [key, value] of Object.entries(HIDDEN_KEYWORDS)) {
            if (store.getValue(key, 1) !== 1) {
                hiddenActions.push(value);
            }
        }
        return hiddenActions;
    }
}

class LiveEnhanceUI extends UI.LiveEnhanceUIBase {
    constructor(player) {
        super(player, undefined);
    }

    async copyScreenshot() {
        let video = $('video');
        if (video.length) {
            video = video[0];
            if (video.readyState >= 2) {
                let canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const fmt = store.screenshotFormat;
                const quality = (fmt === 'image/png') ? 1 : (store.screenshotQuality / 100);
                try {
                    await Clipboard.copyCanvasImage(canvas, fmt, quality);
                    ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_DONE);
                } catch (ex) {
                    window.console.error(ex);
                    ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_FAILED);
                }
                canvas = null;
            } else {
                ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_NOT_READY);
            }
        }
    }

    async enterPiP() {
        let video = $('video');
        if (video.length) {
            video = video[0];
            video.requestPictureInPicture();
        }
    }

    onInflateMenuActions() {
        const menuActions = [];
        if (store.getValue(Settings.MENU_SHOW_COPY_SCREENSHOT, 1) === 1) {
            menuActions.push({
                id: IDS.MENU_SCREENSHOT,
                title: LOCALIZED.ACTION_COPY_SCREENSHOT,
                callback: this.copyScreenshot
            });
        }
        if (store.getValue(Settings.LIVE_MENU_SHOW_PIP, 1) === 1) {
            menuActions.push({
                id: IDS.MENU_PIP,
                title: LOCALIZED.ACTION_PIP,
                callback: this.enterPiP
            });
        }
        return menuActions;
    }

    onInflateHiddenActions() {
        return [];
    }

    destroy() {

    }
}

async function enhanceMain() {
    const bindPlayer = async () => {
        const player = await UI.lazyElement(SELECTORS.PLAYER);
        if (lastPlayerElement === player) {
            console.log('isSameElement');
            return;
        }
        if (ui !== null) {
            await ui.destroy();
        }
        lastPlayerElement = player;
        ui = new MainEnhanceUI(player);
    };

    // 自动下一分P播放器只改变 InnerContainer 中的元素，不会触发 PlayerWrapper 的 MutationObserver 回调
    const bindPlayerWrapper = async () => {
        const playerInnerContainer = await UI.lazyElement(SELECTORS.PLAYER_INNER_CONTAINER);

        const mutationObserver = new MutationObserver(bindPlayer);
        mutationObserver.observe(playerInnerContainer[0], { childList: true });

        // 首次尝试绑定
        await bindPlayer();
    };

    const playerWrapper = await UI.lazyElement([SELECTORS.PLAYER_WRAPPER, SELECTORS.PLAYER_MODULE]);

    const mutationObserver = new MutationObserver(bindPlayerWrapper);
    mutationObserver.observe(playerWrapper[0], { childList: true });

    // 首次尝试绑定
    await bindPlayer();
}

async function enhanceLive() {
    const player = await UI.lazyElement(SELECTORS.LIVE_PLAYER);
    if (ui !== null) {
        await ui.destroy();
    }
    ui = new LiveEnhanceUI(player);
}

// 增强插件主入口
store.installToWindow();
if (LIVE_URL_PATTERN.test(window.location.href)) {
    console.log('enhance live');
    enhanceLive();
} else {
    console.log('enhance main');
    enhanceMain();
}
Window.prototype.RecordController = RecorderController;
