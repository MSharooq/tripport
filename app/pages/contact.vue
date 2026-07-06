<template>
  <section class="px-5 pb-24 pt-36 sm:px-8">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ content.eyebrow }}</p>
        <h1 class="mt-3 font-display text-4xl font-bold leading-tight text-forest-950 sm:text-6xl">{{ content.title }}</h1>
        <p class="mt-5 text-lg leading-8 text-mist-700">{{ content.description }}</p>
        <div class="mt-8 rounded-3xl bg-forest-950 p-6 text-white shadow-mist">
          <p class="font-display text-2xl font-bold">{{ site.brand.name }}</p>
          <p class="mt-3 text-sm leading-6 text-white/70">{{ site.brand.phone }}</p>
          <p class="text-sm leading-6 text-white/70">{{ site.brand.email }}</p>
        </div>
      </div>
      <EnquiryForm :submit-label="content.submitLabel" :whatsapp-label="content.whatsappLabel" :whatsapp-number="site.brand.whatsappNumber" />
    </div>
  </section>
</template>

<script setup lang="ts">
import site from '../../data/site.json'

const content = site.sections.contact

useSeoMeta({
  title: `${content.title} | ${site.brand.name}`,
  description: content.description,
  ogImage: site.seo.ogImage
})
</script>
