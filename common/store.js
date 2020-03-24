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
     * 安装实例到窗口对象（仅插件调用）
     */
    installToWindow() {
        Window.prototype.EnhancePluginStore_instance = this;
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
