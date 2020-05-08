module.exports = {
    name: '哔哩哔哩播放器增强',
    author: 'Siubeng (fython)',
    homepage: 'https://github.com/fython/userscript-enhance-bilibili-player',
    version: '[version]',
    license: 'MIT',
    match: [
        '*://www.bilibili.com/video/*',
        '*://www.bilibili.com/bangumi/play/ep*',
        '*://www.bilibili.com/bangumi/play/ss*',
        '*://bangumi.bilibili.com/anime/*',
        '*://bangumi.bilibili.com/movie/*',
        '*://www.bilibili.com/bangumi/media/md*',
        '*://www.bilibili.com/bangumi/play/*',
        '*://www.bilibili.com/blackboard/html5player.html*',
        '*://www.bilibili.com/medialist/play/ml*',
        '*://live.bilibili.com/*',
        '*://link.acg.tv/forum.php*',
        '*://biliplayer.gwo.app/*',
    ],
    grant: [
        'GM_setValue',
        'GM_getValue',
        'GM_addValueChangeListener',
        'GM_openInTab'
    ],
};
