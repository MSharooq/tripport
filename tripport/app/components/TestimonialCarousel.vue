<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay'
import emblaCarouselVue from 'embla-carousel-vue'
import type { Testimonial } from '~/data/testimonials'

const props = defineProps<{
  testimonials: Testimonial[]
}>()

const autoplay = Autoplay({ delay: 6500, stopOnInteraction: true, stopOnMouseEnter: true, stopOnFocusIn: true })
const [emblaRef, emblaApi] = emblaCarouselVue({ align: 'start', containScroll: 'trimSnaps', loop: props.testimonials.length > 3 }, [autoplay])
const selectedIndex = ref(0)
const scrollSnaps = ref<number[]>([])
const canScrollPrev = ref(false)
const canScrollNext = ref(false)
const activeTestimonial = ref<Testimonial | null>(null)
let returnFocus: HTMLElement | null = null

function updateCarouselState() {
  const api = emblaApi.value
  if (!api) return
  selectedIndex.value = api.selectedScrollSnap()
  scrollSnaps.value = api.scrollSnapList()
  canScrollPrev.value = api.canScrollPrev()
  canScrollNext.value = api.canScrollNext()
}

function scrollPrevious() {
  emblaApi.value?.scrollPrev()
}

function scrollNext() {
  emblaApi.value?.scrollNext()
}

function scrollTo(index: number) {
  emblaApi.value?.scrollTo(index)
}

function openStory(testimonial: Testimonial) {
  returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
  activeTestimonial.value = testimonial
  autoplay.stop()
}

async function closeStory() {
  activeTestimonial.value = null
  await nextTick()
  returnFocus?.focus()
  returnFocus = null
}

onMounted(() => {
  const api = emblaApi.value
  if (!api) return
  api.on('select', updateCarouselState)
  api.on('reInit', updateCarouselState)
  updateCarouselState()

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) autoplay.stop()
})

onBeforeUnmount(() => {
  const api = emblaApi.value
  if (!api) return
  api.off('select', updateCarouselState)
  api.off('reInit', updateCarouselState)
})

watch(() => props.testimonials.map((testimonial) => testimonial.id).join('|'), async () => {
  await nextTick()
  emblaApi.value?.reInit({ loop: props.testimonials.length > 3 })
  updateCarouselState()
})
</script>

<template>
  <div class="testimonial-carousel" :class="{ 'testimonial-carousel--single': testimonials.length === 1 }">
    <div ref="emblaRef" class="testimonial-carousel__viewport">
      <div class="testimonial-carousel__container">
        <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-carousel__slide">
          <TestimonialCard compact :testimonial="testimonial" @show-more="openStory(testimonial)" />
        </div>
      </div>
    </div>

    <div v-if="testimonials.length > 1" class="testimonial-carousel__navigation">
      <div class="testimonial-carousel__dots" aria-label="Choose a traveller story">
        <button
          v-for="(_, index) in scrollSnaps"
          :key="index"
          type="button"
          :class="{ 'is-active': index === selectedIndex }"
          :aria-label="`Show traveller story ${index + 1}`"
          :aria-current="index === selectedIndex ? 'true' : undefined"
          @click="scrollTo(index)"
        />
      </div>
      <div class="testimonial-carousel__controls">
        <button type="button" aria-label="Previous traveller story" :disabled="!canScrollPrev" @click="scrollPrevious"><MaterialIcon name="arrow_back" :size="19" /></button>
        <button type="button" aria-label="Next traveller story" :disabled="!canScrollNext" @click="scrollNext"><MaterialIcon name="arrow_forward" :size="19" /></button>
      </div>
    </div>

    <TestimonialStoryDialog v-if="activeTestimonial" :testimonial="activeTestimonial" @close="closeStory" />
  </div>
</template>

<style scoped>
.testimonial-carousel{position:relative}.testimonial-carousel__viewport{overflow:hidden}.testimonial-carousel__container{display:flex;margin-left:-16px;touch-action:pan-y pinch-zoom}.testimonial-carousel__slide{min-width:0;flex:0 0 33.333%;padding-left:16px}.testimonial-carousel__slide :deep(.testimonial-card){height:100%}.testimonial-carousel__navigation{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-top:25px}.testimonial-carousel__dots{display:flex;gap:7px;align-items:center}.testimonial-carousel__dots button{width:7px;height:7px;padding:0;border:0;border-radius:999px;background:#c8d4ce;transition:width .22s ease,background .22s ease}.testimonial-carousel__dots button.is-active{width:25px;background:var(--forest)}.testimonial-carousel__dots button:focus-visible,.testimonial-carousel__controls button:focus-visible{outline:3px solid rgb(15 115 85 / 24%);outline-offset:3px}.testimonial-carousel__controls{display:flex;gap:8px}.testimonial-carousel__controls button{display:grid;width:40px;height:40px;place-items:center;border:1px solid #bed2c6;border-radius:50%;background:#fff;color:var(--forest);transition:background .18s ease,color .18s ease,border-color .18s ease}.testimonial-carousel__controls button:hover:not(:disabled){border-color:var(--forest);background:var(--forest);color:#fff}.testimonial-carousel__controls button:disabled{opacity:.36;cursor:not-allowed}@media(max-width:900px){.testimonial-carousel__slide{flex-basis:50%}}@media(max-width:620px){.testimonial-carousel__slide{flex-basis:100%}.testimonial-carousel__navigation{margin-top:20px}}
</style>
