<template>
  <section ref="heroRoot" class="px-4 pb-12 pt-24 sm:px-6 lg:px-8">
    <div class="relative mx-auto h-[calc(100svh-7.75rem)] min-h-[620px] max-h-[860px] max-w-7xl overflow-hidden rounded-[2rem] bg-forest-950 shadow-mist">
      <Transition name="fade" mode="out-in">
        <VideoCard
          :key="activeSlide.title"
          class="absolute inset-0 rounded-[2rem]"
          :alt="activeSlide.title"
          :image="activeSlide.image"
          :video="activeSlide.video"
        />
      </Transition>

      <div class="absolute inset-0 z-10 bg-gradient-to-r from-forest-950/78 via-forest-950/34 to-forest-950/10" />
      <div class="absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-forest-950/70 via-forest-950/24 to-transparent" />

      <div class="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-8 lg:p-10">
        <div class="grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div ref="copyRoot" class="max-w-2xl text-white">
            <div class="mb-5 flex flex-wrap gap-2">
              <span class="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">{{ activeSlide.location }}</span>
              <span class="max-w-full truncate rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-sage-100 backdrop-blur-md">{{ activeSlide.category }}</span>
            </div>
            <h1 class="max-w-2xl font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.35)]">{{ activeSlide.title }}</h1>
            <p class="mt-5 max-w-xl text-sm leading-7 text-white/86 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:text-base">{{ activeSlide.subtitle }}</p>
            <NuxtLink class="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-forest-950 shadow-soft transition hover:bg-sage-100" :to="activeSlide.ctaLink">
              {{ activeSlide.ctaLabel }}
              <ArrowRight class="size-4" aria-hidden="true" />
            </NuxtLink>
          </div>

          <div class="hidden rounded-[1.5rem] border border-white/35 bg-white/60 p-2.5 shadow-soft backdrop-blur-xl lg:block">
            <button
              v-for="(slide, index) in slides"
              :key="slide.title"
              class="group flex h-[5.25rem] w-full items-center gap-3 rounded-2xl p-2.5 text-left transition hover:bg-white/80"
              :class="index === activeIndex ? 'bg-white shadow-soft' : ''"
              type="button"
              @click="setSlide(index)"
            >
              <img class="size-14 shrink-0 rounded-xl object-cover" :src="slide.image" :alt="slide.title">
              <span class="min-w-0">
                <span class="block text-sm font-bold text-forest-950">{{ slide.location }}</span>
                <span class="line-clamp-2 text-xs leading-5 text-mist-700">{{ slide.title }}</span>
              </span>
            </button>
          </div>
        </div>

        <div class="mt-4 flex justify-center gap-2 lg:hidden">
          <button
            v-for="(slide, index) in slides"
            :key="slide.title"
            class="h-2.5 rounded-full bg-white/70 transition-all"
            :class="index === activeIndex ? 'w-8 bg-white' : 'w-2.5'"
            type="button"
            :aria-label="`Show ${slide.title}`"
            @click="setSlide(index)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ArrowRight } from 'lucide-vue-next'

interface HeroSlide {
  title: string
  subtitle: string
  location: string
  category: string
  video?: string
  image: string
  ctaLabel: string
  ctaLink: string
}

const props = defineProps<{ slides: HeroSlide[] }>()
const activeIndex = ref(0)
const heroRoot = ref<HTMLElement | null>(null)
const copyRoot = ref<HTMLElement | null>(null)
let intervalId: ReturnType<typeof setInterval> | undefined

const activeSlide = computed<HeroSlide>(() => props.slides[activeIndex.value] ?? props.slides[0]!)

const setSlide = (index: number) => {
  activeIndex.value = index
}

onMounted(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!reduced) {
    gsap.from(heroRoot.value, { opacity: 0, y: 16, duration: 0.8, ease: 'power3.out' })
    intervalId = setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % Math.max(props.slides.length, 1)
    }, 6500)
  }
})

watch(activeIndex, () => {
  if (!copyRoot.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return
  }

  gsap.fromTo(copyRoot.value, { opacity: 0.72 }, { opacity: 1, duration: 0.3, ease: 'power1.out' })
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 600ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
