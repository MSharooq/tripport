<template>
  <article class="px-5 pb-24 pt-28 sm:px-8">
    <div class="mx-auto max-w-6xl">
      <div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <img class="min-h-[420px] w-full rounded-[2rem] object-cover shadow-mist" :src="guide.image" :alt="guide.title">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ guide.destination }}</p>
          <h1 class="mt-4 font-display text-4xl font-bold leading-tight text-forest-950 sm:text-6xl">{{ guide.title }}</h1>
          <p class="mt-5 text-lg leading-8 text-mist-700">{{ guide.excerpt }}</p>
          <div class="mt-8 grid gap-3 sm:grid-cols-2">
            <div class="rounded-3xl bg-white p-5 shadow-soft">
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">{{ labels.bestTime }}</p>
              <p class="mt-2 font-display text-xl font-bold text-forest-950">{{ guide.bestTime }}</p>
            </div>
            <div class="rounded-3xl bg-forest-100 p-5">
              <p class="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">{{ labels.idealDuration }}</p>
              <p class="mt-2 font-display text-xl font-bold text-forest-950">{{ guide.idealDuration }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-16 grid gap-10 lg:grid-cols-2">
        <ContentBlock :title="labels.highlights">
          <ul class="grid gap-3">
            <li v-for="item in guide.highlights" :key="item" class="rounded-2xl bg-white p-4 shadow-soft">{{ item }}</li>
          </ul>
        </ContentBlock>
        <ContentBlock :title="labels.tips">
          <ul class="grid gap-3">
            <li v-for="tip in guide.tips" :key="tip" class="rounded-2xl bg-white p-4 shadow-soft">{{ tip }}</li>
          </ul>
        </ContentBlock>
      </div>

      <div class="mt-16">
        <ContentBlock :title="labels.faqs">
          <div class="space-y-3">
            <details v-for="faq in guide.faqs" :key="faq.question" class="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
              <summary class="cursor-pointer font-display text-lg font-bold text-forest-950">{{ faq.question }}</summary>
              <p class="mt-3 text-sm leading-6 text-mist-700">{{ faq.answer }}</p>
            </details>
          </div>
        </ContentBlock>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import site from '../../../data/site.json'
import guides from '../../../data/travel-guides.json'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const guide = guides.find((item) => item.slug === slug)
const labels = site.pages.travelGuides

if (!guide) {
  throw createError({ statusCode: 404, statusMessage: 'Travel guide not found' })
}

useSeoMeta({
  title: guide.seo.title,
  description: guide.seo.description,
  ogTitle: guide.seo.title,
  ogDescription: guide.seo.description,
  ogImage: guide.image
})
</script>
