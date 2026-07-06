<template>
  <div ref="root" class="mx-auto max-w-7xl px-5 sm:px-8">
    <div class="flex gap-2 overflow-x-auto rounded-full border border-mist-200 bg-white/70 p-2 shadow-soft backdrop-blur-xl">
      <button
        v-for="category in categories"
        :key="category"
        class="shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition"
        :class="category === activeCategory ? 'bg-forest-950 text-white shadow-soft' : 'text-mist-700 hover:bg-forest-100 hover:text-forest-950'"
        type="button"
        @click="setCategory(category)"
      >
        {{ category }}
      </button>
    </div>

    <div ref="panel" class="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
      <NuxtLink
        v-if="activeGuide"
        class="group relative min-h-[500px] overflow-hidden rounded-[2rem] bg-forest-950 shadow-mist"
        :to="`/travel-guides/${activeGuide.slug}`"
      >
        <img class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" :src="activeGuide.image" :alt="activeGuide.title" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-forest-950/85 via-forest-950/20 to-transparent" />
        <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-100">{{ activeGuide.destination }}</p>
          <h3 class="mt-3 font-display text-4xl font-bold leading-tight">{{ activeGuide.title }}</h3>
          <p class="mt-4 max-w-xl text-base leading-7 text-white/78">{{ activeGuide.excerpt }}</p>
          <div class="mt-6 flex flex-wrap gap-2 text-xs font-bold">
            <span class="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">{{ activeGuide.bestTime }}</span>
            <span class="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">{{ activeGuide.idealDuration }}</span>
          </div>
        </div>
      </NuxtLink>

      <div class="grid gap-4">
        <button
          v-for="guide in filteredGuides"
          :key="guide.slug"
          class="group grid gap-4 rounded-3xl border border-mist-200 bg-white p-4 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-mist sm:grid-cols-[8rem_1fr]"
          :class="guide.slug === activeSlug ? 'ring-2 ring-forest-950/15' : ''"
          type="button"
          @click="setGuide(guide.slug)"
        >
          <img class="h-32 w-full rounded-2xl object-cover sm:h-full" :src="guide.image" :alt="guide.title" loading="lazy">
          <span class="block">
            <span class="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">{{ guide.destination }}</span>
            <span class="mt-2 block font-display text-2xl font-bold text-forest-950">{{ guide.title }}</span>
            <span class="mt-2 line-clamp-2 text-sm leading-6 text-mist-700">{{ guide.excerpt }}</span>
            <span class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-forest-950">
              Read guide
              <ArrowRight class="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ArrowRight } from 'lucide-vue-next'

interface Guide {
  title: string
  slug: string
  destination: string
  excerpt: string
  image: string
  bestTime: string
  idealDuration: string
}

const props = defineProps<{ guides: Guide[] }>()
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const activeCategory = ref('All')
const activeSlug = ref(props.guides[0]?.slug ?? '')

const categoryForGuide = (guide: Guide) => {
  if (['Coorg'].includes(guide.destination)) return 'Karnataka'
  if (['Ooty'].includes(guide.destination)) return 'Tamil Nadu'
  return 'Kerala'
}

const categories = computed(() => ['All', ...new Set(props.guides.map(categoryForGuide))])
const filteredGuides = computed(() => {
  if (activeCategory.value === 'All') return props.guides
  return props.guides.filter((guide) => categoryForGuide(guide) === activeCategory.value)
})
const activeGuide = computed(() => filteredGuides.value.find((guide) => guide.slug === activeSlug.value) ?? filteredGuides.value[0])

const animatePanel = () => {
  if (!panel.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  gsap.fromTo(panel.value.children, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', stagger: 0.06 })
}

const setCategory = (category: string) => {
  activeCategory.value = category
  activeSlug.value = filteredGuides.value[0]?.slug ?? ''
  nextTick(animatePanel)
}

const setGuide = (slug: string) => {
  activeSlug.value = slug
  nextTick(animatePanel)
}

onMounted(() => {
  if (!root.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  gsap.from(root.value, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' })
})
</script>
