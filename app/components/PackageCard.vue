<template>
  <article ref="card" class="group overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-mist">
    <div class="relative aspect-[4/3] overflow-hidden bg-mist-200">
      <NuxtLink class="block h-full" :to="`/packages/${pkg.slug}`">
        <VideoCard class="h-full rounded-none" :alt="pkg.title" :image="activeImage" :video="activeVideo" />
      </NuxtLink>

      <template v-if="hasMultipleImages">
        <button
          class="absolute left-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest-950 opacity-0 shadow-soft backdrop-blur transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
          type="button"
          aria-label="Previous package image"
          @click.prevent.stop="showPreviousImage"
        >
          <ChevronLeft class="size-5" aria-hidden="true" />
        </button>
        <button
          class="absolute right-3 top-1/2 z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-forest-950 opacity-0 shadow-soft backdrop-blur transition hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
          type="button"
          aria-label="Next package image"
          @click.prevent.stop="showNextImage"
        >
          <ChevronRight class="size-5" aria-hidden="true" />
        </button>

        <div class="absolute inset-x-0 bottom-3 z-10 flex justify-center gap-1.5">
          <span
            v-for="(_, index) in imageGallery"
            :key="index"
            class="h-1.5 rounded-full bg-white/70 transition-all"
            :class="index === activeImageIndex ? 'w-5 bg-white' : 'w-1.5'"
          />
        </div>
      </template>
    </div>
    <div class="p-5">
      <div class="mb-3 flex flex-wrap gap-2">
        <span class="rounded-lg bg-forest-100 px-2.5 py-1 text-xs font-bold text-forest-950">{{ pkg.duration }}</span>
        <span class="rounded-lg bg-mist-100 px-2.5 py-1 text-xs font-bold text-mist-700">{{ pkg.region }}</span>
      </div>
      <NuxtLink :to="`/packages/${pkg.slug}`">
        <h3 class="font-display text-xl font-bold text-forest-950">{{ pkg.title }}</h3>
      </NuxtLink>
      <p class="mt-1 text-sm font-semibold text-sage-600">{{ pkg.destination }}</p>
      <p class="mt-3 line-clamp-3 text-sm leading-6 text-mist-700">{{ pkg.shortDescription }}</p>
      <div class="mt-5 flex items-center justify-between gap-4">
        <span class="text-sm font-bold text-forest-950">{{ pkg.priceLabel }}</span>
        <NuxtLink class="inline-flex items-center gap-2 rounded-full bg-forest-950 px-4 py-2 text-sm font-bold text-white" :to="`/packages/${pkg.slug}`">
          {{ pkg.ctaLabel }}
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface PackageItem {
  slug: string
  title: string
  destination: string
  region: string
  duration: string
  priceLabel: string
  shortDescription: string
  image: string
  images?: string[]
  video?: string
  ctaLabel: string
}

const props = defineProps<{ pkg: PackageItem }>()

const card = ref<HTMLElement | null>(null)
const activeImageIndex = ref(0)
const imageGallery = computed(() => {
  const images = props.pkg.images?.length ? props.pkg.images : [props.pkg.image]

  return [...new Set(images.filter(Boolean))]
})
const hasMultipleImages = computed(() => imageGallery.value.length > 1)
const activeImage = computed(() => imageGallery.value[activeImageIndex.value] ?? props.pkg.image)
const activeVideo = computed(() => activeImageIndex.value === 0 ? props.pkg.video : undefined)

const showPreviousImage = () => {
  activeImageIndex.value = (activeImageIndex.value - 1 + imageGallery.value.length) % imageGallery.value.length
}

const showNextImage = () => {
  activeImageIndex.value = (activeImageIndex.value + 1) % imageGallery.value.length
}

onMounted(() => {
  if (!card.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  const ctx = gsap.context(() => {
    gsap.from(card.value, { opacity: 0, y: 18, duration: 0.55, ease: 'power2.out', scrollTrigger: undefined })
  }, card.value)

  ctx.revert()
})
</script>
