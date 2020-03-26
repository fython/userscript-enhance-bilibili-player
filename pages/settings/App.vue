<template>
  <div id="app">
    <v-app>
      <v-app-bar app>
        <v-toolbar-title class="app-title">哔哩哔哩播放器增强插件</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon href="https://github.com/fython/userscript-enhance-bilibili-player">
          <v-icon>mdi-github</v-icon>
        </v-btn>
      </v-app-bar>
      <v-content>
        <div id="progress-content" class="d-flex flex-column my-8" v-if="!store">
          <v-progress-circular class="mx-auto" :size="50" color="primary" indeterminate></v-progress-circular>
          <span class="subtitle-1 mt-8 mx-auto">正在等待插件加载……</span>
          <span class="subtitle-2 mt-4 mx-auto" v-if="showTimeoutText">
            似乎加载不到插件，你确认已经安装<a href="https://greasyfork.org/zh-CN/scripts/397885">哔哩哔哩播放器增强插件</a>了吗？
          </span>
        </div>
        <v-tabs vertical v-else>
          <v-tab>
            <v-icon left>mdi-tune</v-icon>
            基本
          </v-tab>
          <v-tab>
            <v-icon left>mdi-information-outline</v-icon>
            关于
          </v-tab>
          <v-tab-item>
            <basic-tab-component></basic-tab-component>
          </v-tab-item>
          <v-tab-item>
            <about-tab-component></about-tab-component>
          </v-tab-item>
        </v-tabs>
      </v-content>
      <plugin-update-dialog ref="pluginUpdateDialog" />
    </v-app>
  </div>
</template>

<script>
    import BasicTabComponent from './components/BasicTabComponent.vue';
    import AboutTabComponent from './components/AboutTabComponent.vue';
    import PluginUpdateDialog from './components/dialog/PluginUpdateDialog';
    import EnhancePluginStore from '../../common/store';

    export default {
        name: 'App',
        data: () => ({
            store: null,
            timeoutCallback: null,
            showTimeoutText: false,
        }),
        components: {
            'basic-tab-component': BasicTabComponent,
            'about-tab-component': AboutTabComponent,
            'plugin-update-dialog': PluginUpdateDialog,
        },
        mounted() {
            this.timeoutCallback = setTimeout(() => {
                this.showTimeoutText = true;
                this.timeoutCallback = null;
            }, 5000);
            EnhancePluginStore.getInstance().then((store) => {
                setTimeout(() => {
                    this.store = store;
                    if (!store.version || store.version < EnhancePluginStore.version) {
                        this.$refs.pluginUpdateDialog.showDialog();
                    }
                    if (this.timeoutCallback) {
                        clearTimeout(this.timeoutCallback);
                    }
                }, 500);
            }, (err) => window.console.error(err));
        }
    };
</script>

<style lang="sass" scoped>
  .app-title
    font-weight: 500

    .v-tab
      min-width: 120px
</style>
