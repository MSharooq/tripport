<template>
  <article>
    <section class="px-5 pb-16 pt-28 sm:px-8">
      <div class="mx-auto max-w-7xl">
        <VideoCard class="min-h-[520px] shadow-mist" :alt="pkg.title" :image="pkg.image" :video="pkg.video">
          <div class="absolute inset-x-5 bottom-5 rounded-[1.75rem] border border-white/30 bg-white/75 p-6 backdrop-blur-xl sm:inset-x-8 sm:bottom-8 sm:p-8">
            <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ pkg.category }} · {{ pkg.region }}</p>
            <h1 class="mt-3 max-w-4xl font-display text-4xl font-bold leading-tight text-forest-950 sm:text-6xl">{{ pkg.title }}</h1>
            <div class="mt-5 flex flex-wrap gap-3 text-sm font-bold text-forest-950">
              <span class="rounded-full bg-forest-100 px-4 py-2">{{ pkg.destination }}</span>
              <span class="rounded-full bg-white px-4 py-2">{{ pkg.duration }}</span>
              <span class="rounded-full bg-white px-4 py-2">{{ pkg.priceLabel }}</span>
            </div>
          </div>
        </VideoCard>
      </div>
    </section>

    <section class="px-5 pb-24 sm:px-8">
      <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_360px]">
        <div class="space-y-10">
          <ContentBlock :title="labels.overview">
            <p>{{ pkg.overview }}</p>
          </ContentBlock>

          <ContentBlock :title="labels.highlights">
            <ul class="grid gap-3 sm:grid-cols-2">
              <li v-for="highlight in pkg.highlights" :key="highlight" class="rounded-2xl bg-white p-4 shadow-soft">{{ highlight }}</li>
            </ul>
          </ContentBlock>

          <ContentBlock :title="labels.itinerary">
            <div class="space-y-3">
              <details v-for="item in pkg.itinerary" :key="item.day" class="rounded-2xl border border-mist-200 bg-white p-5 shadow-soft">
                <summary class="cursor-pointer font-display text-lg font-bold text-forest-950">{{ item.day }} · {{ item.title }}</summary>
                <p class="mt-3 text-sm leading-6 text-mist-700">{{ item.description }}</p>
              </details>
            </div>
          </ContentBlock>

          <div class="grid gap-6 md:grid-cols-2">
            <ContentBlock :title="labels.inclusions">
              <ul class="space-y-3">
                <li v-for="item in pkg.inclusions" :key="item" class="text-sm">{{ item }}</li>
              </ul>
            </ContentBlock>
            <ContentBlock :title="labels.exclusions">
              <ul class="space-y-3">
                <li v-for="item in pkg.exclusions" :key="item" class="text-sm">{{ item }}</li>
              </ul>
            </ContentBlock>
          </div>

          <ContentBlock :title="labels.bestTime">
            <p>{{ pkg.bestTime }}</p>
          </ContentBlock>
        </div>

        <aside class="h-fit rounded-[2rem] border border-mist-200 bg-white p-6 shadow-mist lg:sticky lg:top-28">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ labels.idealFor }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="item in pkg.idealFor" :key="item" class="rounded-lg bg-forest-100 px-3 py-2 text-xs font-bold text-forest-950">{{ item }}</span>
          </div>
          <p class="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ labels.tags }}</p>
          <div class="mt-4 flex flex-wrap gap-2">
            <span v-for="tag in pkg.tags" :key="tag" class="rounded-lg bg-mist-100 px-3 py-2 text-xs font-bold text-mist-700">{{ tag }}</span>
          </div>
          <h2 class="mt-8 font-display text-2xl font-bold text-forest-950">{{ labels.enquiryTitle }}</h2>
          <p class="mt-3 text-sm leading-6 text-mist-700">{{ labels.enquiryDescription }}</p>
          <NuxtLink class="mt-6 inline-flex w-full justify-center rounded-full bg-forest-950 px-6 py-3 text-sm font-bold text-white" to="/contact">{{ labels.enquiryLabel }}</NuxtLink>
        </aside>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import site from '../../../data/site.json'
import packages from '../../../data/packages.json'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const pkg = packages.find((item) => item.slug === slug)
const labels = site.pages.packageDetail

if (!pkg) {
  throw createError({ statusCode: 404, statusMessage: 'Package not found' })
}

useSeoMeta({
  title: pkg.seo.title,
  description: pkg.seo.description,
  ogTitle: pkg.seo.title,
  ogDescription: pkg.seo.description,
  ogImage: pkg.image
})
</script>
