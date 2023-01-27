<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue';
import { Alert as TAlert } from 'tdesign-vue-next';
import { blobToBase64 } from '@/utils/blob';

const props = defineProps<{
  data: Blob,
}>();
const { data } = toRefs(props);
const imgSrc = ref<string>();

watch(data, async (newVal) => {
  imgSrc.value = await blobToBase64(newVal);
}, { immediate: true });
</script>

<template>
  <div class="copy-shot-body">
    <t-alert message="由于你的浏览器不支持自动复制图片，请手动右键截图保存为文件或复制" />
    <img :src="imgSrc" />
  </div>
</template>

<style scoped>
.copy-shot-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.copy-shot-body img {
  width: 100%;
}
</style>
