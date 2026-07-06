<template>
  <section class="px-5 pb-24 pt-36 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ site.pages.travelGuides.eyebrow }}</p>
      <h1 class="mt-3 max-w-4xl font-display text-4xl font-bold leading-tight text-forest-950 sm:text-6xl">{{ site.pages.travelGuides.title }}</h1>
      <p class="mt-5 max-w-2xl text-base leading-7 text-mist-700">{{ site.pages.travelGuides.description }}</p>
    </div>
    <div class="mt-12">
      <CardGrid>
        <TravelGuideCard v-for="guide in guides" :key="guide.slug" :guide="guide" />
      </CardGrid>
    </div>
  </section>
</template>

<script setup lang="ts">
import site from '../../../data/site.json'
import guides from '../../../data/travel-guides.json'

useSeoMeta({
  title: `${site.pages.travelGuides.title} | ${site.brand.name}`,
  description: site.pages.travelGuides.description,
  ogImage: site.seo.ogImage
})
</script>
