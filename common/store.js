import { Settings, TimestampStyle } from './constants';

class EnhancePluginStore {
    /**
     * 获取能够调用 GM API 的实例（仅设置页面调用）
     * @returns {Promise<EnhancePluginStore>}
     */
    static getInstance() {
        return new Promise((resolve) => {
            const callback = setInterval(() => {
                if (typeof EnhancePluginStore_instance === 'object') {
                    clearInterval(callback);
                    resolve(EnhancePluginStore_instance);
                }
            }, 200);
        });
    }

    /**
     * 返回 Store 类当前版本
     * @returns {number}
     */
    static get version() {
        return 2;
    }

    /**
     * 返回 Store 实体的版本，用于判断插件版本是否过旧
     * @returns {number}
     */
    get version() {
        return EnhancePluginStore.version;
    }

    /**
     * 安装实例到窗口对象（仅插件调用）
     */
    installToWindow() {
        Window.prototype.EnhancePluginStore_instance = this;
    }

    /**
     * @returns {(TimestampStyle.HMS|TimestampStyle.ONLY_SEC)}
     */
    get timestampStyle() {
        return this.getValue(Settings.TS_URL_STYLE, TimestampStyle.HMS) || TimestampStyle.HMS;
    }

    /**
     * @param {(TimestampStyle.HMS|TimestampStyle.ONLY_SEC)} value
     */
    set timestampStyle(value) {
        this.setValue(Settings.TS_URL_STYLE, value);
    }

    /**
     * @returns {number}
     */
    get screenshotQuality() {
        return this.getValue(Settings.SCREENSHOT_QUALITY, 100);
    }

    /**
     * @param {number} value
     */
    set screenshotQuality(value) {
        if (value < 50 || value > 100) {
            value = 100;
        }
        this.setValue(Settings.SCREENSHOT_QUALITY, value);
    }

    /**
     * @returns {('image/png'|'image/jpeg'|'image/webp')}
     */
    get screenshotFormat() {
        return this.getValue(Settings.SCREENSHOT_FORMAT, 'image/png');
    }

    /**
     * @param {('image/png'|'image/jpeg'|'image/webp')} value
     */
    set screenshotFormat(value) {
        this.setValue(Settings.SCREENSHOT_FORMAT, value);
    }

    get recordMimeType() {
        return this.getValue(Settings.RECORD_MIME_TYPE, 'default');
    }

    set recordMimeType(value) {
        this.setValue(Settings.RECORD_MIME_TYPE, value);
    }

    setValue(key, value) {
        GM_setValue(key, value);
    }

    getValue(key, defaultValue) {
        return GM_getValue(key, defaultValue);
    }

    addValueChangeListener(name, func) {
        GM_addValueChangeListener(name, func);
    }
}

export default EnhancePluginStore;
