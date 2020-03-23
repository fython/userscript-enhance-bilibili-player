export default {
    ACTION_COPY_URL_WITH_TIMESTAMP: '拷貝當前時間的視訊鏈接',
    ACTION_PIP: '彈出子母畫面播放',
    ACTION_COPY_SCREENSHOT: '拷貝當前時間的視訊擷圖（視訊實際解析度/無彈幕）',
    TOAST_COPY_URL_WITH_TIMESTAMP_DONE: (time) => `已拷貝當前位置（${time}）的視訊鏈接至剪貼板。`,
    TOAST_COPY_URL_FAILED: '拷貝鏈接失敗，您的瀏覽器可能不允許腳本直接修改。',
    TOAST_PIP_UNSUPPORTED: '您的瀏覽器暫不支援子母畫面播放，可能需要最新的 Chrome。',
    TOAST_COPY_SCREENSHOT_DONE: '已拷貝當前位置的視訊擷圖至剪貼板。',
    TOAST_COPY_SCREENSHOT_NOT_READY: '視訊仍在加載狀態，請稍後再嘗試拷貝擷圖。',
};