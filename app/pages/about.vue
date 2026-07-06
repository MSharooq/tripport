<template>
  <section class="px-5 pb-24 pt-36 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ page.eyebrow }}</p>
      <h1 class="mt-3 max-w-4xl font-display text-4xl font-bold leading-tight text-forest-950 sm:text-6xl">{{ page.title }}</h1>
      <p class="mt-5 max-w-3xl text-lg leading-8 text-mist-700">{{ page.description }}</p>
      <div class="mt-14 grid gap-6 md:grid-cols-3">
        <article v-for="card in page.cards" :key="card.title" class="rounded-3xl border border-mist-200 bg-white p-6 shadow-soft">
          <h2 class="font-display text-2xl font-bold text-forest-950">{{ card.title }}</h2>
          <p class="mt-3 text-sm leading-6 text-mist-700">{{ card.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import site from '../../data/site.json'

const page = site.pages.about

useSeoMeta({
  title: `${page.title} | ${site.brand.name}`,
  description: page.description,
  ogImage: site.seo.ogImage
})
</script>
