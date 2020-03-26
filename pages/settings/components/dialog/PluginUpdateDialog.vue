<template>
  <v-dialog v-model="show" max-width="400">
    <v-card>
      <v-card-title class="headline">不支持的插件版本</v-card-title>
      <v-card-text>
        设置页面需要搭配最新的插件本体，请及时升级获得最佳体验。
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="show = false">忽略</v-btn>
        <v-btn color="primary darken-1" text @click="show = false" href="https://greasyfork.org/zh-CN/scripts/397885">升级插件</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    export default {
        name: 'PluginUpdateDialog',
        data: () => ({
            show: false
        }),
        methods: {
            showDialog() {
                this.show = true;
            }
        }
    };
</script>

<style scoped>

</style>
