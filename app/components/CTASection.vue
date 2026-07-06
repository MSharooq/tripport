<template>
  <section id="enquiry" class="px-5 py-24 sm:px-8">
    <div class="mx-auto overflow-hidden rounded-[2rem] bg-forest-950 shadow-mist">
      <div class="grid min-h-[440px] lg:grid-cols-[1fr_0.85fr]">
        <div class="p-8 text-white sm:p-12 lg:p-16">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-300">{{ content.eyebrow }}</p>
          <h2 class="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight sm:text-5xl">{{ content.title }}</h2>
          <p class="mt-5 max-w-2xl text-base leading-7 text-white/70">{{ content.description }}</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink class="rounded-full bg-white px-6 py-3 text-sm font-bold text-forest-950" :to="content.primaryLink">{{ content.primaryLabel }}</NuxtLink>
            <a class="rounded-full border border-white/30 px-6 py-3 text-sm font-bold text-white" :href="content.secondaryLink" rel="noreferrer" target="_blank">{{ content.secondaryLabel }}</a>
          </div>
        </div>
        <img class="h-full min-h-[320px] w-full object-cover" src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=85" :alt="content.title" loading="lazy">
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  content: {
    eyebrow: string
    title: string
    description: string
    primaryLabel: string
    primaryLink: string
    secondaryLabel: string
    secondaryLink: string
  }
}>()
</script>
