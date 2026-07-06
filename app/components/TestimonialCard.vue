<template>
  <article class="rounded-3xl border border-mist-200 bg-white p-6 shadow-soft">
    <div class="flex items-center gap-1 text-forest-500">
      <Star v-for="index in testimonial.rating" :key="index" class="size-4 fill-current" aria-hidden="true" />
    </div>
    <p class="mt-5 text-base leading-7 text-mist-700">“{{ testimonial.quote }}”</p>
    <div class="mt-6 flex items-center gap-3">
      <div class="grid size-11 place-items-center rounded-full bg-forest-100 font-bold text-forest-950">{{ initials }}</div>
      <div>
        <p class="font-bold text-forest-950">{{ testimonial.name }}</p>
        <p class="text-sm text-mist-700">{{ testimonial.location }} · {{ testimonial.trip }}</p>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const props = defineProps<{
  testimonial: {
    name: string
    location: string
    trip: string
    rating: number
    quote: string
  }
}>()

const initials = computed(() => props.testimonial.name.split(' ').map((part) => part[0]).join('').slice(0, 2))
</script>
