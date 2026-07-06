<template>
  <section class="bg-forest-950 px-5 py-24 text-white sm:px-8">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-300">{{ content.eyebrow }}</p>
        <h2 class="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">{{ content.title }}</h2>
        <p class="mt-5 text-base leading-7 text-white/70">{{ content.description }}</p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <article v-for="item in content.items" :key="item.title" class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
          <ShieldCheck class="size-6 text-sage-300" aria-hidden="true" />
          <h3 class="mt-5 font-display text-xl font-bold">{{ item.title }}</h3>
          <p class="mt-3 text-sm leading-6 text-white/70">{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'

defineProps<{
  content: {
    eyebrow: string
    title: string
    description: string
    items: Array<{ title: string; description: string }>
  }
}>()
</script>
