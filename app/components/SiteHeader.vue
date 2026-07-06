<template>
  <header class="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
    <nav class="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/70 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-xl">
      <NuxtLink class="flex items-center gap-3" to="/">
        <span class="grid size-10 place-items-center rounded-full bg-forest-950 text-white">
          <Compass class="size-5" aria-hidden="true" />
        </span>
        <span>
          <span class="block font-display text-base font-bold leading-none text-forest-950">{{ site.brand.name }}</span>
          <span class="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-600 sm:block">{{ site.brand.tagline }}</span>
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-1 lg:flex">
        <NuxtLink
          v-for="item in navigation"
          :key="item.to"
          class="rounded-full px-4 py-2 text-sm font-semibold text-mist-700 transition hover:bg-forest-100 hover:text-forest-950"
          :to="item.to"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2">
        <a
          class="hidden rounded-full border border-sage-300 px-4 py-2 text-sm font-semibold text-forest-950 transition hover:bg-sage-100 md:inline-flex"
          :href="`https://wa.me/${site.brand.whatsappNumber}`"
          rel="noreferrer"
          target="_blank"
        >
          WhatsApp
        </a>
        <NuxtLink class="inline-flex items-center gap-2 rounded-full bg-forest-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest-900" to="/contact">
          <Send class="size-4" aria-hidden="true" />
          Enquire
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Compass, Send } from 'lucide-vue-next'
import navigation from '../../data/navigation.json'
import site from '../../data/site.json'
</script>
