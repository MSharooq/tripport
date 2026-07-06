<template>
  <section ref="root" class="mx-auto max-w-7xl px-5 sm:px-8">
    <div class="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-b from-mist-100 to-mist-200 px-4 py-10 shadow-soft sm:min-h-[500px] lg:min-h-[610px]">
      <div ref="fanRoot" class="relative h-[330px] w-full max-w-6xl sm:h-[410px] lg:h-[500px]">
        <article
          v-for="(destination, index) in destinations"
          :key="destination.slug"
          class="fan-card absolute left-1/2 top-1/2 w-[min(70vw,18rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-white/60 bg-forest-950 shadow-mist will-change-transform sm:w-[20rem] lg:w-[24rem]"
          :data-index="index"
          @mouseenter="setHovered(index)"
          @mouseleave="clearHovered"
        >
          <div class="relative aspect-[3/4] overflow-hidden">
            <video
              v-if="destination.video"
              class="h-full w-full object-cover"
              :poster="destination.image"
              autoplay
              loop
              muted
              playsinline
            >
              <source :src="destination.video" type="video/mp4">
            </video>
            <img v-else class="h-full w-full object-cover" :src="destination.image" :alt="destination.name" loading="lazy">

            <div class="absolute inset-0 bg-gradient-to-t from-forest-950/88 via-forest-950/20 to-transparent transition-opacity" :class="index === activeIndex ? 'opacity-100' : 'opacity-30'" />

            <div v-if="index === activeIndex" ref="copyRoot" class="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
              <p class="text-[11px] font-bold uppercase tracking-[0.18em] text-sage-100">{{ destination.region }}</p>
              <h3 class="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl">{{ destination.name }}</h3>
              <p class="mt-3 line-clamp-3 text-sm leading-6 text-white/78">{{ destination.description }}</p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="highlight in destination.highlights.slice(0, 3)" :key="highlight" class="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                  {{ highlight }}
                </span>
              </div>
            </div>

            <div v-else class="absolute inset-x-0 bottom-0 p-4 text-white">
              <p class="font-display text-xl font-bold drop-shadow">{{ destination.name }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-center gap-4">
      <button
        class="grid size-11 place-items-center rounded-full border border-forest-950/10 bg-white/80 text-forest-950 shadow-soft backdrop-blur transition hover:bg-forest-950 hover:text-white"
        type="button"
        aria-label="Previous destination"
        @click="cycle('left')"
      >
        <ChevronLeft class="size-5" aria-hidden="true" />
      </button>

      <div class="flex items-center gap-2">
        <button
          v-for="(destination, index) in destinations"
          :key="destination.slug"
          class="h-2 rounded-full transition-all"
          :class="index === activeIndex ? 'w-8 bg-forest-950' : 'w-2 bg-forest-950/20 hover:bg-forest-950/45'"
          type="button"
          :aria-label="`Show ${destination.name}`"
          @click="setActive(index)"
        />
      </div>

      <button
        class="grid size-11 place-items-center rounded-full border border-forest-950/10 bg-white/80 text-forest-950 shadow-soft backdrop-blur transition hover:bg-forest-950 hover:text-white"
        type="button"
        aria-label="Next destination"
        @click="cycle('right')"
      >
        <ChevronRight class="size-5" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Destination {
  slug: string
  name: string
  region: string
  description: string
  image: string
  video?: string
  highlights: string[]
}

const FAN_POSITIONS = [
  { rot: -18, scale: 0.78, x: -24, y: 2.6, zIndex: 1 },
  { rot: -9, scale: 0.9, x: -12, y: 0.9, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 9, scale: 0.9, x: 12, y: 0.9, zIndex: 3 },
  { rot: 18, scale: 0.78, x: 24, y: 2.6, zIndex: 1 }
]
const HALF = 2

const props = defineProps<{ destinations: Destination[] }>()
const root = ref<HTMLElement | null>(null)
const fanRoot = ref<HTMLElement | null>(null)
const copyRoot = ref<HTMLElement | null>(null)
const activeIndex = ref(0)
const hoveredIndex = ref<number | null>(null)
const isAnimating = ref(false)

const getResponsiveMultiplier = () => {
  if (window.innerWidth < 480) return 0.34
  if (window.innerWidth < 640) return 0.46
  if (window.innerWidth < 768) return 0.58
  if (window.innerWidth < 1024) return 0.78
  return 1
}

const getHeightMultiplier = () => {
  if (window.innerHeight < 680) return 0.72
  if (window.innerHeight < 800) return 0.86
  return 1
}

const getSlot = (index: number) => {
  const total = props.destinations.length
  const diff = ((index - activeIndex.value + total + HALF) % total) - HALF

  if (Math.abs(diff) > HALF) {
    return undefined
  }

  return diff + HALF
}

const animateCopy = () => {
  if (!copyRoot.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  gsap.fromTo(copyRoot.value, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
}

const applyFanLayout = (animate = true) => {
  if (!fanRoot.value) return

  const cards = Array.from(fanRoot.value.querySelectorAll<HTMLElement>('.fan-card'))
  const multiplier = getResponsiveMultiplier()
  const heightMultiplier = getHeightMultiplier()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  isAnimating.value = true

  cards.forEach((card) => {
    const index = Number(card.dataset.index)
    const slot = getSlot(index)

    if (slot === undefined) {
      const hiddenSide = index < activeIndex.value ? -1 : 1
      gsap.to(card, {
        x: `${hiddenSide * 34 * multiplier}rem`,
        y: '3rem',
        rotation: hiddenSide * 24,
        scale: 0.55,
        opacity: 0,
        zIndex: 0,
        duration: animate && !reduced ? 0.35 : 0,
        ease: 'power2.in'
      })
      return
    }

    const position = FAN_POSITIONS[slot]!
    const isHovered = hoveredIndex.value === index
    const hoverLift = isHovered ? -2.2 * heightMultiplier : 0
    const hoverScale = isHovered ? 1.06 : 1

    gsap.to(card, {
      x: `${position.x * multiplier}rem`,
      y: `${position.y * heightMultiplier + hoverLift}rem`,
      rotation: position.rot,
      scale: position.scale * hoverScale,
      opacity: 1,
      zIndex: isHovered ? 20 : position.zIndex,
      duration: animate && !reduced ? 0.62 : 0,
      ease: 'power3.out',
      overwrite: 'auto',
      onComplete: () => {
        isAnimating.value = false
      }
    })
  })

  if (!animate || reduced) {
    isAnimating.value = false
  }
}

const setActive = (index: number) => {
  activeIndex.value = index
}

const cycle = (direction: 'left' | 'right') => {
  if (isAnimating.value || props.destinations.length < 2) return

  activeIndex.value = direction === 'right'
    ? (activeIndex.value + 1) % props.destinations.length
    : (activeIndex.value - 1 + props.destinations.length) % props.destinations.length
}

const setHovered = (index: number) => {
  hoveredIndex.value = index
  applyFanLayout(true)
}

const clearHovered = () => {
  hoveredIndex.value = null
  applyFanLayout(true)
}

onMounted(() => {
  if (root.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.from(root.value, { opacity: 0, y: 24, duration: 0.75, ease: 'power3.out' })
  }

  applyFanLayout(false)
  animateCopy()
  window.addEventListener('resize', onResize)
})

const onResize = () => applyFanLayout(false)

watch(activeIndex, async () => {
  hoveredIndex.value = null
  await nextTick()
  applyFanLayout(true)
  animateCopy()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>
