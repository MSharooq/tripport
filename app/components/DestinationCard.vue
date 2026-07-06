<template>
  <article class="group overflow-hidden rounded-3xl bg-white shadow-soft">
    <div class="relative aspect-[4/5] overflow-hidden">
      <img class="h-full w-full object-cover transition duration-500 group-hover:scale-105" :src="destination.image" :alt="destination.name" loading="lazy">
      <div class="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
      <div class="absolute inset-x-4 bottom-4 rounded-2xl border border-white/30 bg-white/70 p-4 backdrop-blur-xl">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">{{ destination.region }}</p>
        <h3 class="mt-1 font-display text-2xl font-bold text-forest-950">{{ destination.name }}</h3>
        <p class="mt-2 line-clamp-2 text-sm leading-6 text-mist-700">{{ destination.description }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  destination: {
    slug: string
    name: string
    region: string
    description: string
    image: string
  }
}>()
</script>
