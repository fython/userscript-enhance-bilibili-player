<template>
  <v-card flat>
    <h1 class="mt-4 mx-4">基本</h1>
    <v-list multiple flat>
      <v-subheader>视频菜单</v-subheader>
      <v-list-group>
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-eye</v-icon>
          </v-list-item-icon>
          <v-list-item-title>原版菜单选项可见性</v-list-item-title>
        </template>
        <v-list-item-group v-model="rawMenuSelectedItems" multiple>
          <template v-for="(item, i) in rawMenuItems">
            <v-list-item active-class="black--text" :key="`raw-menu-item-${i}`" :value="item.id">
              <template v-slot:default="{ active, toggle }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox
                    :input-value="active"
                    :true-value="item"
                    @click="toggle"
                ></v-checkbox>
              </v-list-item-action>  
              </template>  
            </v-list-item>  
          </template>
        </v-list-item-group>
      </v-list-group>
      <v-list-group value="true">
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-eye</v-icon>
          </v-list-item-icon>
          <v-list-item-title>增强菜单选项可见性</v-list-item-title>
        </template>
        <v-list-item-group v-model="enhanceMenuSelectedItems" multiple>
          <template v-for="(item, i) in enhanceMenuItems">
            <v-list-item active-class="black--text" :key="`enhance-menu-item-${i}`" :value="item.id">
              <template v-slot:default="{ active, toggle }">
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-checkbox
                    :input-value="active"
                    :true-value="item"
                    @click="toggle"
                ></v-checkbox>
              </v-list-item-action>  
              </template>  
            </v-list-item>  
          </template>
        </v-list-item-group>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import '../assets/tab-component.css';
import { Settings } from '../../../common/constants';
import EnhancePluginStore from '../../../common/store';

export default {
  name: 'BasicTabComponent',
  data: () => ({
      rawMenuItems: [
          {
              id: Settings.MENU_SHOW_RATIO,
              title: '画面比例'
          },
          {
              id: Settings.MENU_SHOW_PLAYBACK_SPEED,
              title: '播放速度'
          },
          {
              id: Settings.MENU_SHOW_LIGHT_OFF,
              title: '关灯'
          },
          {
              id: Settings.MENU_SHOW_MIRROR,
              title: '镜像'
          }, 
          {
              id: Settings.MENU_SHOW_KEYMAP,
              title: '快捷键说明'
          }, 
          {
              id: Settings.MENU_SHOW_CHANGELOG,
              title: '更新日志'
          },
      ],
      rawMenuSelectedItems: [],
      enhanceMenuItems: [
          {
              id: Settings.MENU_SHOW_COPY_TS_URL,
              title: '复制当前时间位置的视频链接'
          },
          {
              id: Settings.MENU_SHOW_COPY_SCREENSHOT,
              title: '复制当前时间位置的视频截图'
          }
      ],
      enhanceMenuSelectedItems: [],
      store: null,
  }),
  watch: {
      rawMenuSelectedItems(newValue) {
          this.rawMenuItems.forEach(({id}) => {
              this.store.setValue(id, (newValue.indexOf(id) !== -1) ? 1 : 0)
          });
      },
      enhanceMenuSelectedItems(newValue) {
          this.enhanceMenuItems.forEach(({id}) => {
              this.store.setValue(id, (newValue.indexOf(id) !== -1) ? 1 : 0)
          });
      },
  },
  methods: {
      async initStore() {
          this.store = await EnhancePluginStore.getInstance();
          const initialRawMenu = [];
          const initialEnhanceMenu = [];
          this.rawMenuItems.forEach(({id}) => {
              if (this.store.getValue(id, 1) === 1) {
                  initialRawMenu.push(id);
              }
          });
          this.enhanceMenuItems.forEach(({id}) => {
              if (this.store.getValue(id, 1) === 1) {
                  initialEnhanceMenu.push(id);
              }
          });
          this.rawMenuSelectedItems = initialRawMenu;
          this.enhanceMenuSelectedItems = initialEnhanceMenu;
      }
  },
  mounted() {
      this.initStore();
  }
};
</script>
