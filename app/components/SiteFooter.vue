<template>
  <footer class="bg-forest-950 px-5 py-12 text-white sm:px-8">
    <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
      <div>
        <div class="flex items-center gap-3">
          <span class="grid size-11 place-items-center rounded-full bg-white text-forest-950">
            <Compass class="size-5" aria-hidden="true" />
          </span>
          <div>
            <p class="font-display text-xl font-bold">{{ site.brand.name }}</p>
            <p class="text-sm text-sage-300">{{ site.brand.tagline }}</p>
          </div>
        </div>
        <p class="mt-6 max-w-lg text-sm leading-7 text-white/70">{{ site.brand.description }}</p>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-300">Navigation</p>
        <div class="mt-5 grid gap-3">
          <NuxtLink v-for="item in navigation" :key="item.to" class="text-sm text-white/75 transition hover:text-white" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>

      <div>
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-300">Contact</p>
        <div class="mt-5 space-y-3 text-sm text-white/75">
          <p>{{ site.brand.phone }}</p>
          <p>{{ site.brand.email }}</p>
          <p>{{ site.brand.address }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Compass } from 'lucide-vue-next'
import navigation from '../../data/navigation.json'
import site from '../../data/site.json'
</script>
