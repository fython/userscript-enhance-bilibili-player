import { SELECTORS, IDS, TEXT, HIDDEN_KEYWORDS } from './constants';
import { Settings, TimestampStyle } from '../common/constants';
import * as UI from './ui';
import * as Storage from './util/storage';
import * as Clipboard from './util/clipboard';
import EnhancePluginStore from '../common/store';

const LOCALIZED = TEXT[Storage.getLanguage()];
/**
 * @type {UI.EnhanceUI}
 */
let ui = null;
/**
 * @type {EnhancePluginStore}
 */
const store = new EnhancePluginStore();

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
            const fmt = store.getValue(Settings.SCREENSHOT_FORMAT, 'image/png') || 'image/png';
            const quality = (fmt === 'image/png') ? 1 : ((store.getValue(Settings.SCREENSHOT_QUALITY, 100) || 100) / 100);
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

async function enhanceMain() {
    store.installToWindow();
    const player = await UI.lazyElement(SELECTORS.PLAYER);
    const menuActions = [];
    const hiddenActions = [];

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
    menuActions.push({
        id: IDS.MENU_SETTINGS,
        title: LOCALIZED.ACTION_SETTINGS,
        callback: () => {
            GM_openInTab('https://biliplayer.gwo.app', { active: true });
        }
    });
    for (const [key, value] of Object.entries(HIDDEN_KEYWORDS)) {
        if (store.getValue(key, 1) !== 1) {
            hiddenActions.push(value);
        }
    }

    ui = new UI.EnhanceUI(player, { menuActions, hiddenActions });
}

// 增强插件主入口
enhanceMain();
