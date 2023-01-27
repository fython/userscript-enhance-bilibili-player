<script setup lang="ts">
import { initMenuInjector } from '@/components/player-menu';
import VideoShotFeature from '@/features/video-shot';

initMenuInjector();

const enabledFeatures = [
  VideoShotFeature,
];

for (const f of enabledFeatures) {
  f.register();
}
</script>

<template>
  <div>
  </div>
</template>

<style scoped>

</style>
