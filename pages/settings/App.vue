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
        <v-tabs vertical>
          <v-tab>
            <v-icon left>mdi-tune</v-icon>基本
          </v-tab>
          <v-tab>
            <v-icon left>mdi-information-outline</v-icon>关于
          </v-tab>
          <v-tab-item>
            <basic-tab-component></basic-tab-component>
          </v-tab-item>
          <v-tab-item>
            <about-tab-component></about-tab-component>
          </v-tab-item>
        </v-tabs>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import BasicTabComponent from './components/BasicTabComponent.vue';
import AboutTabComponent from './components/AboutTabComponent.vue';

export default {
  name: 'App',
  data: () => ({
      
  }),
  components: {
    'basic-tab-component': BasicTabComponent,
    'about-tab-component': AboutTabComponent
  },
  mounted() {
      
  }
};
</script>

<style lang="sass" scoped>
.app-title
  font-weight: 500

.v-tab
  min-width: 120px
</style>