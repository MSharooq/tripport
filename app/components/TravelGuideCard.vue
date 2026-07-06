<template>
  <article class="overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-mist">
    <NuxtLink :to="`/travel-guides/${guide.slug}`">
      <img class="aspect-[4/3] w-full object-cover" :src="guide.image" :alt="guide.title" loading="lazy">
    </NuxtLink>
    <div class="p-5">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">{{ guide.destination }}</p>
      <NuxtLink :to="`/travel-guides/${guide.slug}`">
        <h3 class="mt-3 font-display text-xl font-bold text-forest-950">{{ guide.title }}</h3>
      </NuxtLink>
      <p class="mt-3 line-clamp-3 text-sm leading-6 text-mist-700">{{ guide.excerpt }}</p>
      <div class="mt-5 grid grid-cols-2 gap-3 text-xs font-bold text-forest-950">
        <span class="rounded-2xl bg-mist-100 p-3">{{ guide.bestTime }}</span>
        <span class="rounded-2xl bg-forest-100 p-3">{{ guide.idealDuration }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  guide: {
    title: string
    slug: string
    destination: string
    excerpt: string
    image: string
    bestTime: string
    idealDuration: string
  }
}>()
</script>
