/**
 * @enum {string}
 */
export const Settings = {
    MENU_SHOW_RATIO: 'menu_show_ratio',
    MENU_SHOW_PLAYBACK_SPEED: 'menu_show_playback_speed',
    MENU_SHOW_LIGHT_OFF: 'menu_show_light_off',
    MENU_SHOW_MIRROR: 'menu_show_mirror',
    MENU_SHOW_KEYMAP: 'menu_show_keymap',
    MENU_SHOW_CHANGELOG: 'menu_show_changelog',
    MENU_SHOW_COLOR_AND_SFX: 'menu_show_color_and_sfx',
    MENU_SHOW_VIDEO_INFO: 'menu_show_video_info',
    MENU_SHOW_COPY_TS_URL: 'menu_show_copy_ts_url',
    MENU_SHOW_COPY_SCREENSHOT: 'menu_show_copy_screenshot',
    MENU_SHOW_RECORD: 'menu_show_record',
    TS_URL_STYLE: 'timestamp_url_style',
    SCREENSHOT_FORMAT: 'screenshot_format',
    SCREENSHOT_QUALITY: 'screenshot_quality',
    RECORD_MIME_TYPE: 'record_mime_type',
};

/**
 * @enum {number}
 */
export const TimestampStyle = {
    HMS: 0,
    ONLY_SEC: 1,
};

/**
 * @enum {string}
 */
export const MimeTypes = {
    MP4: 'video/mp4',
    MP3: 'audio/mpeg',
    WEBM: 'video/webm',
    MKV: 'video/x-matroska',
    OGG: 'audio/ogg',
    WEBM_AUDIO: 'audio/webm',
};
