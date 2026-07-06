<template>
  <div class="mx-auto mb-10 flex max-w-7xl flex-col gap-4 px-5 sm:px-8 lg:flex-row lg:items-end lg:justify-between">
    <div class="max-w-3xl">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ eyebrow }}</p>
      <h2 class="mt-3 font-display text-3xl font-bold leading-tight text-forest-950 sm:text-5xl">{{ title }}</h2>
      <p v-if="description" class="mt-4 max-w-2xl text-base leading-7 text-mist-700">{{ description }}</p>
    </div>
    <NuxtLink
      v-if="ctaLabel && ctaLink"
      class="inline-flex w-fit items-center gap-2 rounded-full border border-sage-300 px-5 py-3 text-sm font-bold text-forest-950 transition hover:bg-sage-100"
      :to="ctaLink"
    >
      {{ ctaLabel }}
      <ArrowRight class="size-4" aria-hidden="true" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

defineProps<{
  eyebrow: string
  title: string
  description?: string
  ctaLabel?: string
  ctaLink?: string
}>()
</script>
