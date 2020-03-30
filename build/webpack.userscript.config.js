const path = require('path');
const webpack = require('webpack');
const WebpackUserscript = require('webpack-userscript');
const isDev = process.env.NODE_ENV === 'development';
const devProxyPort = process.env.DEV_PROXY_PORT || '10801';

const rootPath = path.resolve(__dirname, '..');

module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: path.resolve(rootPath, 'src', 'index.js'),
    output: {
        path: path.resolve(rootPath, 'dist'),
        filename: 'enhance-biliplayer.user.js'
    },
    devServer: {
        contentBase: path.join(rootPath, 'dist'),
        port: devProxyPort,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'eslint-loader']
            },
        ],
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            'jquery': 'jquery/dist/jquery.slim.js',
        }
    },
    plugins: [
        new WebpackUserscript({
            headers: {
                name: '哔哩哔哩播放器增强',
                author: 'Siubeng (fython)',
                homepage: 'https://github.com/fython/userscript-enhance-bilibili-player',
                version: isDev ? `[version]-build.[buildNo]` : `[version]`,
                match: [
                    '*://www.bilibili.com/video/*',
                    '*://www.bilibili.com/bangumi/play/ep*',
                    '*://biliplayer.gwo.app/*',
                    ...(isDev ? ['*://localhost*'] : [])
                ],
                grant: [
                    'GM_setValue',
                    'GM_getValue',
                    'GM_addValueChangeListener',
                    'GM_openInTab'
                ],
            },
            pretty: false,
            proxyScript: {
                baseUrl: `http://127.0.0.1:${devProxyPort}`,
                filename: '[basename].proxy.user.js',
                enable: () => process.env.LOCAL_DEV === '1'
            },
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
        }),
    ]
};
