const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');
const isDev = process.env.NODE_ENV === 'development';
const devProxyPort = process.env.DEV_PROXY_PORT || '10802';

const rootPath = path.resolve(__dirname, '..');
const srcPath = path.resolve(rootPath, 'pages', 'settings');

module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: path.resolve(srcPath, 'index.js'),
    devServer: {
        contentBase: path.join(rootPath, 'dist'),
        port: devProxyPort,
    },
    resolve: {
        extensions: ['*', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'eslint-loader']
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loader: ['vue-style-loader', 'css-loader']
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sassOptions: {
                                fiber: require('fibers'),
                                indentedSyntax: true
                            }
                        },
                    },
                ],
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            'title': '哔哩哔哩增强插件设置',
            'template': path.resolve(srcPath, 'index.tpl'),
        }),
        new VueLoaderPlugin(),
        new VuetifyLoaderPlugin(),
    ]
};
