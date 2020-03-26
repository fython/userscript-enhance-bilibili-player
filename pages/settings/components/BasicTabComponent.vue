<template>
  <v-card flat>
    <h1 class="mt-4 mx-4">基本</h1>

    <v-card class="mt-2 mx-2">
      <v-list flat>
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
                    <v-checkbox :input-value="active" :true-value="item" @click="toggle"></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list-group>

        <v-divider class="mx-4"></v-divider>

        <v-list-group value="true">
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>mdi-eye</v-icon>
            </v-list-item-icon>
            <v-list-item-title>增强菜单选项可见性</v-list-item-title>
          </template>
          <v-list-item-group v-model="enhanceMenuSelectedItems" multiple>
            <template v-for="(item, i) in enhanceMenuItems">
              <v-list-item
                  active-class="black--text"
                  :key="`enhance-menu-item-${i}`"
                  :value="item.id"
              >
                <template v-slot:default="{ active, toggle }">
                  <v-list-item-content>
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox :input-value="active" :true-value="item" @click="toggle"></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list-group>
      </v-list>
    </v-card>

    <v-card class="mt-2 mx-2">
      <v-list flat>
        <v-subheader>视频链接</v-subheader>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-timer-10</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>时间格式（不影响跳转）</v-list-item-title>
            <v-select
                v-model="currentTsStyle"
                :items="tsStyles"
                item-text="title"
                item-value="value"
                menu-props="auto"
                hide-details
                single-line></v-select>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-card class="mt-2 mx-2">
      <v-list flat>
        <v-subheader>视频截图</v-subheader>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-image</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>图像格式</v-list-item-title>
            <v-select
                v-model="currentImageFormat"
                :items="imageFormats"
                item-text="title"
                item-value="mime"
                menu-props="auto"
                hide-details
                single-line></v-select>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-quality-high</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>质量</v-list-item-title>
            <v-slider
                class="mt-4"
                min="50"
                max="100"
                inverse-label
                :label="'' + currentImageQuality"
                :disabled="currentImageFormat === 'image/png'"
                v-model="currentImageQuality"
                thumb-label></v-slider>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-card>
</template>

<script>
    import '../assets/tab-component.css';
    import {Settings} from '../../../common/constants';
    import EnhancePluginStore from '../../../common/store';

    export default {
        name: 'BasicTabComponent',
        data: () => ({
            rawMenuItems: [
                {id: Settings.MENU_SHOW_RATIO, title: '画面比例'},
                {id: Settings.MENU_SHOW_PLAYBACK_SPEED, title: '播放速度'},
                {id: Settings.MENU_SHOW_LIGHT_OFF, title: '关灯'},
                {id: Settings.MENU_SHOW_MIRROR, title: '镜像'},
                {id: Settings.MENU_SHOW_KEYMAP, title: '快捷键说明'},
                {id: Settings.MENU_SHOW_CHANGELOG, title: '更新日志'},
                {id: Settings.MENU_SHOW_COLOR_AND_SFX, title: '视频色彩调节/音效调节'},
            ],
            rawMenuSelectedItems: [],
            enhanceMenuItems: [
                {id: Settings.MENU_SHOW_COPY_TS_URL, title: '复制当前时间位置的视频链接'},
                {id: Settings.MENU_SHOW_COPY_SCREENSHOT, title: '复制当前时间位置的视频截图'},
            ],
            enhanceMenuSelectedItems: [],
            tsStyles: [
                {value: 0, title: 'https://www.bilibili.com/video/XXXXXX?t=[小时]h[分钟]m[秒数]s'},
                {value: 1, title: 'https://www.bilibili.com/video/XXXXXX?t=[秒数]'},
            ],
            currentTsStyle: 0,
            imageFormats: [
                {mime: 'image/png', title: 'PNG（推荐）'},
                {mime: 'image/jpeg', title: 'JPEG'},
                {mime: 'image/webp', title: 'WebP'},
            ],
            currentImageFormat: 'image/png',
            currentImageQuality: 100,
            /**
             * @type {EnhancePluginStore}
             */
            store: null
        }),
        watch: {
            rawMenuSelectedItems(newValue) {
                this.rawMenuItems.forEach(({id}) => {
                    this.store.setValue(id, newValue.indexOf(id) !== -1 ? 1 : 0);
                });
            },
            enhanceMenuSelectedItems(newValue) {
                this.enhanceMenuItems.forEach(({id}) => {
                    this.store.setValue(id, newValue.indexOf(id) !== -1 ? 1 : 0);
                });
            },
            currentTsStyle(newValue) {
                this.store.timestampStyle = newValue;
            },
            currentImageFormat(newValue) {
                this.store.screenshotFormat = newValue;
                if (newValue === 'image/png') {
                    this.currentImageQuality = 100;
                }
            },
            currentImageQuality(newValue) {
                this.store.screenshotQuality = newValue;
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
                this.currentTsStyle = this.store.timestampStyle;
                this.currentImageFormat = this.store.screenshotFormat;
                this.currentImageQuality = this.store.screenshotQuality;
            }
        },
        mounted() {
            this.initStore();
        }
    };
</script>
