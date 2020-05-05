import { SELECTORS, IDS, TEXT, HIDDEN_KEYWORDS } from './constants';
import { Settings, TimestampStyle } from '../common/constants';
import * as UI from './ui';
import * as Storage from './util/storage';
import * as Clipboard from './util/clipboard';
import {RecorderController} from './util/recorder';
import EnhancePluginStore from '../common/store';

const LOCALIZED = TEXT[Storage.getLanguage()];
let lastPlayerElement = null;
/**
 * @type {EnhanceUI}
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

async function copyUrlWithTimestamp() {
    let video = $('video');
    if (video.length) {
        video = video[0];
        const url = new URL(window.location.href);
        const time = parseInt(video.currentTime);
        const h = parseInt(time / 60 / 60);
        const m = parseInt(time / 60 % 60);
        const s = parseInt(time % 60);
        if (store.timestampStyle === TimestampStyle.HMS) {
            url.searchParams.set('t', '' + h + 'h' + m + 'm' + s + 's');
        } else {
            url.searchParams.set('t', time);
        }

        if (await Clipboard.copyText(url.toString())) {
            const tsText = '' + (h > 0 ? '' + h + ':' : '') + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
            ui.showToast(LOCALIZED.TOAST_COPY_URL_WITH_TIMESTAMP_DONE(tsText));
        } else {
            ui.showToast(LOCALIZED.TOAST_COPY_URL_FAILED);
        }
    }
}

async function copyScreenshot() {
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

async function startRecord() {
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

async function stopRecord() {
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

class EnhanceUI extends UI.EnhanceUIBase {
    constructor(player, options) {
        super(player, options);
    }

    async destroy() {
        await stopRecord();
    }

    onInflateMenuActions() {
        const menuActions = [];
        if (store.getValue(Settings.MENU_SHOW_COPY_TS_URL, 1) === 1) {
            menuActions.push({
                id: IDS.MENU_COPY_TS_URL,
                title: LOCALIZED.ACTION_COPY_URL_WITH_TIMESTAMP,
                callback: copyUrlWithTimestamp
            });
        }
        if (store.getValue(Settings.MENU_SHOW_COPY_SCREENSHOT, 1) === 1) {
            menuActions.push({
                id: IDS.MENU_SCREENSHOT,
                title: LOCALIZED.ACTION_COPY_SCREENSHOT,
                callback: copyScreenshot
            });
        }
        if (store.getValue(Settings.MENU_SHOW_RECORD, 1) === 1) {
            if (recorderController == null || !recorderController.isRecording) {
                menuActions.push({
                    id: IDS.MENU_RECORD,
                    title: LOCALIZED.ACTION_RECORD_START,
                    callback: startRecord
                });
            } else {
                menuActions.push({
                    id: IDS.MENU_RECORD,
                    title: LOCALIZED.ACTION_RECORD_STOP,
                    callback: stopRecord
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

async function enhanceMain() {
    store.installToWindow();
    const playerWrapper = await UI.lazyElement([SELECTORS.PLAYER_WRAPPER, SELECTORS.PLAYER_MODULE]);
    const mutationObserver = new MutationObserver(bindPlayer);
    mutationObserver.observe(playerWrapper[0], { childList: true });
    await bindPlayer();
}

async function bindPlayer() {
    console.log('bindPlayer');
    const player = await UI.lazyElement(SELECTORS.PLAYER);
    if (lastPlayerElement === player) {
        console.log('isSameElement');
        return;
    }
    if (ui !== null) {
        await ui.destroy();
    }
    lastPlayerElement = player;
    ui = new EnhanceUI(player);
}

// 增强插件主入口
enhanceMain();
Window.prototype.RecordController = RecorderController;
