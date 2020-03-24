import { SELECTORS, IDS, TEXT } from './constants';
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
        url.searchParams.set('t', time);
        if (await Clipboard.copyText(url.toString())) {
            const h = parseInt(time / 60 / 60);
            const m = parseInt(time / 60 % 60);
            const s = parseInt(time % 60);
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
            await Clipboard.copyCanvasImage(canvas);
            canvas = null;
            ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_DONE);
        } else {
            ui.showToast(LOCALIZED.TOAST_COPY_SCREENSHOT_NOT_READY);
        }
    }
}

async function enhanceMain() {
    store.installToWindow();
    const player = await UI.lazyElement(SELECTORS.PLAYER);
    const menuActions = [
        {
            id: IDS.MENU_COPY_TS_URL,
            title: LOCALIZED.ACTION_COPY_URL_WITH_TIMESTAMP,
            callback: copyUrlWithTimestamp
        },
        {
            id: IDS.MENU_SCREENSHOT,
            title: LOCALIZED.ACTION_COPY_SCREENSHOT,
            callback: copyScreenshot
        }
    ];
    ui = new UI.EnhanceUI(player, { menuActions });
}

// 增强插件主入口
enhanceMain();
