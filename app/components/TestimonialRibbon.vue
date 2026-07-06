<template>
  <div ref="root" class="mx-auto max-w-7xl overflow-hidden px-5 sm:px-8">
    <div class="rounded-[2rem] bg-forest-950 p-6 text-white shadow-mist sm:p-8">
      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <article
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
        >
          <Quote class="size-6 text-sage-300" aria-hidden="true" />
          <p class="mt-5 text-sm leading-7 text-white/78">“{{ testimonial.quote }}”</p>
          <div class="mt-6 border-t border-white/10 pt-4">
            <p class="font-bold">{{ testimonial.name }}</p>
            <p class="mt-1 text-xs uppercase tracking-[0.14em] text-sage-300">{{ testimonial.trip }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { Quote } from 'lucide-vue-next'

defineProps<{
  testimonials: Array<{
    name: string
    trip: string
    quote: string
  }>
}>()

const root = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  gsap.from(root.value.querySelectorAll('article'), {
    opacity: 0,
    x: 24,
    duration: 0.65,
    ease: 'power3.out',
    stagger: 0.08
  })
})
</script>
