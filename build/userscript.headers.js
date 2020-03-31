module.exports = {
    name: '哔哩哔哩播放器增强',
    author: 'Siubeng (fython)',
    homepage: 'https://github.com/fython/userscript-enhance-bilibili-player',
    version: '[version]',
    match: [
        '*://www.bilibili.com/video/*',
        '*://www.bilibili.com/bangumi/play/ep*',
        '*://www.bilibili.com/medialist/play/ml*',
        '*://biliplayer.gwo.app/*',
    ],
    grant: [
        'GM_setValue',
        'GM_getValue',
        'GM_addValueChangeListener',
        'GM_openInTab'
    ],
};
