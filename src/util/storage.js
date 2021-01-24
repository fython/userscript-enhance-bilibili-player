/**
 * 读取 Cookie 键值
 * @param {string} key Cookie 键
 * @returns {string | undefined}
 */
export function getCookie(key) {
    const keyValue = document.cookie.match(`(^|;) ?${key}=([^;]*)(;|$)`);
    return keyValue ? keyValue[2] : null;
}

/**
 * 获取界面语言
 * @returns {('zh-CN'|'zh-TW')}
 */
export function getLanguage() {
    return getCookie('LNG') || 'zh-CN';
}