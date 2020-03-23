增强哔哩哔哩播放器
======

[![GitHub](https://img.shields.io/github/license/fython/userscript-enhance-bilibili-player)](https://github.com/fython/userscript-enhance-bilibili-player/blob/master/LICENSE)

## 介绍

这是一个用于增强哔哩哔哩网页播放器使用体验的 Tampermonkey 插件。

目前可提供 “复制当前播放位置的视频链接”、“（以视频实际分辨率、不带弹幕）复制当前播放位置的视频截图” 功能。

在播放器点击鼠标右键打开菜单，即可复制当前播放位置的视频链接发给你的朋友，对方打开这个链接时会直接跳转到指定位置，和 YouTube 的使用体验相同。

![](./.github/screenshot.png)

## 安装

在使用之前请先确保你已经在浏览器安装了 [Tampermonkey/油猴](https://www.tampermonkey.net/?ext=dhdg&locale=zh)，如果你无法通过官方的 Chrome Store 渠道获取，请使用国内的搜索引擎搜索油猴的离线安装版。

然后在 [【GreasyFork: 397885-哔哩哔哩播放器增强】](https://greasyfork.org/zh-CN/scripts/397885-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA) 进行安装。

## 开发 & 编译

目前实验性地使用了 webpack + [webpack-userscript](https://github.com/momocow/webpack-userscript) 来构建脚本源码，为未来更多的扩展提供便利，也提升了代码可读性。

在获取源码到本地后，你需要保证开发环境已安装 Node.js 和 NPM。

然后在项目目录执行 `npm install` 安装编译所需要的依赖。

执行 `npm run dev` 进行持续的开发编译，在已安装 Tampermonkey 插件的浏览器中打开 `http://127.0.0.1:10801/enhance-biliplayer.user.js` 即可安装当前编译的插件程序，每次热更新后都需要重新打开这个地址更新插件。

执行 `npm run build` 对脚本进行打包输出，编译结果将存放在项目目录的 `dist` 中。

## License

```
MIT License

Copyright (c) 2020 Siubeng Fung (fython)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```