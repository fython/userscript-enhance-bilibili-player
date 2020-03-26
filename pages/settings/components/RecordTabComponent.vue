<template>
  <v-card flat>
    <h1 class="mt-4 mx-4">录制</h1>

    <v-card class="mt-2 mx-2">
      <v-list flat>
        <v-subheader>录制格式</v-subheader>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-content-save</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>封装格式</v-list-item-title>
            <v-select
                v-model="currentRecordMimeType"
                :items="recordMimeTypes"
                item-text="title"
                item-value="value"
                menu-props="auto"
                :error="isUnsupportedMimeType"
                :error-messages="isUnsupportedMimeType ? ['不支持的格式'] : []"
                hide-details
                single-line></v-select>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-dialog v-model="showUnsupportedMimeType" max-width="400">
      <v-card>
        <v-card-title class="headline">不支持的封装格式</v-card-title>
        <v-card-text>
          您的浏览器上的 <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder">MediaRecorder API</a>
          似乎并不支持 <code>{{ currentRecordMimeType }}</code> 这个封装格式，如果录制时遇到错误，请记得回来这里更换格式。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary darken-1" text @click="showUnsupportedMimeType = false">我知道了</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
    import '../assets/tab-component.css';
    import {MimeTypes} from '../../../common/constants';
    import EnhancePluginStore from '../../../common/store';

    export default {
        name: 'RecordTabComponent',
        data: () => ({
            recordMimeTypes: [
                {value: 'default', title: '浏览器自动选择（推荐）'},
                {value: MimeTypes.MP4, title: 'MP4'},
                {value: MimeTypes.MP3, title: 'MP3 仅音频'},
                {value: MimeTypes.MKV, title: 'MKV'},
                {value: MimeTypes.WEBM, title: 'WebM'},
                {value: MimeTypes.WEBM_AUDIO, title: 'WebM 仅音频'},
                {value: MimeTypes.OGG, title: 'OGG'},
            ],
            currentRecordMimeType: 'default',
            showUnsupportedMimeType: false,
            isUnsupportedMimeType: false,
        }),
        watch: {
            currentRecordMimeType(newValue) {
                if (newValue !== 'default') {
                    this.showUnsupportedMimeType = !MediaRecorder.isTypeSupported(newValue);
                    this.isUnsupportedMimeType = !MediaRecorder.isTypeSupported(newValue);
                } else {
                    this.isUnsupportedMimeType = false;
                }
                this.store.recordMimeType = newValue;
            }
        },
        methods: {
            async initStore() {
                this.store = await EnhancePluginStore.getInstance();
                this.currentRecordMimeType = this.store.recordMimeType;
            }
        },
        mounted() {
            this.initStore();
        }
    };
</script>

<style scoped>

</style>
