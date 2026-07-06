<template>
  <div class="relative overflow-hidden rounded-[2rem] bg-mist-200">
    <video
      v-if="video"
      class="h-full w-full object-cover"
      :poster="image"
      autoplay
      loop
      muted
      playsinline
    >
      <source :src="video" type="video/mp4">
    </video>
    <img v-else class="h-full w-full object-cover" :src="image" :alt="alt" loading="lazy">
    <div class="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/10 to-transparent" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  image: string
  alt: string
  video?: string
}>()
</script>
