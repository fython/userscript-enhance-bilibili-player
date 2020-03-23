export default {
    ACTION_COPY_URL_WITH_TIMESTAMP: '复制当前时间的视频链接',
    ACTION_PIP: '弹出画中画播放',
    ACTION_COPY_SCREENSHOT: '复制当前时间的视频截图（视频实际分辨率/无弹幕）',
    TOAST_COPY_URL_WITH_TIMESTAMP_DONE: (time) => `已复制当前位置（${time}）的视频链接到剪贴板。`,
    TOAST_COPY_URL_FAILED: '复制链接失败，您的浏览器可能不允许脚本直接修改剪贴板。',
    TOAST_PIP_UNSUPPORTED: '您的浏览器暂不支持画中画播放，可能需要最新的 Chrome。',
    TOAST_COPY_SCREENSHOT_DONE: '已复制当前位置的视频截图到剪贴板。',
    TOAST_COPY_SCREENSHOT_NOT_READY: '视频仍在加载状态，请稍后再尝试复制截图。',
}