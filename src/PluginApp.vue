<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import {
  initMenuInjector,
  clearMenuInjector,
  unregisterAllMenuItems,
} from '@/components/player-menu';
import VideoShotFeature from '@/features/video-shot';
import VideoRecordFeature from '@/features/video-record';

onMounted(() => {
  initMenuInjector();

  const enabledFeatures = [
    VideoShotFeature,
    VideoRecordFeature,
  ];

  for (const f of enabledFeatures) {
    f.register();
  }
});

onUnmounted(() => {
  clearMenuInjector();
  unregisterAllMenuItems();
});

</script>

<template>
  <div>
  </div>
</template>

<style scoped>

</style>
