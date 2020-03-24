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
     * 返回 Store 实体的版本，用于判断插件版本是否过旧
     * @returns {number}
     */
    static getVersion() {
        return 1;
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
