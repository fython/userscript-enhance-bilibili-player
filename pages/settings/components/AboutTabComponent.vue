<template>
  <v-card class="px-4" flat>
    <h1 class="mt-4">关于</h1>
    <p class="mt-4">
      哔哩哔哩增强插件可以为你提供更好的网页端视频播放体验，在使用本设置之前你需要先安装最新的
      <a href="https://greasyfork.org/zh-CN/scripts/397885">插件本体</a>。
    </p>
    <p>
      如果插件在你的浏览器上不工作，可能的原因如下：
    </p>
    <div>
      <ul>
        <li>浏览器版本过旧，未被插件的向下兼容覆盖，推荐使用最新的 Chrome 浏览器以获得最佳体验。</li>
        <li>哔哩哔哩页面已经改版，如果插件已经是最新版，请联系作者进行更新插件。</li>
      </ul>
    </div>
  </v-card>
</template>

<script>
    import '../assets/tab-component.css';

    export default {
        name: 'AboutTabComponent',
    };
</script>
