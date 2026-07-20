<script setup lang="ts">
import { packageDuration, packageTypeLabel, type Itinerary } from '~/data/itineraries'

const props = defineProps<{ itinerary: Itinerary }>()
const { openEnquiry } = useEnquiry()
const duration = computed(() => packageDuration(props.itinerary.duration))
const packageType = computed(() => packageTypeLabel(props.itinerary.packageType))
const images = computed(() => [props.itinerary.images.cover, ...(props.itinerary.images.gallery ?? [])])
const activeImage = ref(0)
const copiedShareLink = ref(false)
let copiedShareTimer: ReturnType<typeof setTimeout> | undefined

watch(() => props.itinerary.slug, () => {
  activeImage.value = 0
})

function previousImage() {
  activeImage.value = (activeImage.value - 1 + images.value.length) % images.value.length
}

function nextImage() {
  activeImage.value = (activeImage.value + 1) % images.value.length
}

async function shareItinerary() {
  const url = new URL(`/itineraries/${props.itinerary.slug}`, window.location.origin).href
  const shareData = { title: props.itinerary.title, text: props.itinerary.summary, url }

  if (navigator.share) {
    try {
      await navigator.share(shareData)
      return
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }

  try {
    if (!navigator.clipboard) throw new Error('Clipboard is unavailable')
    await navigator.clipboard.writeText(url)
    copiedShareLink.value = true
    if (copiedShareTimer) clearTimeout(copiedShareTimer)
    copiedShareTimer = setTimeout(() => { copiedShareLink.value = false }, 2200)
  } catch {
    window.prompt('Copy this itinerary link:', url)
  }
}

onBeforeUnmount(() => {
  if (copiedShareTimer) clearTimeout(copiedShareTimer)
})
</script>

<template>
  <article class="itinerary-card">
    <div class="itinerary-card__image" role="group" :aria-label="`${itinerary.title} photo gallery`">
      <NuxtLink class="itinerary-card__image-link" :to="`/itineraries/${itinerary.slug}`" :aria-label="`View ${itinerary.title}`">
        <img class="itinerary-card__cover" :src="images[activeImage].url" :alt="images[activeImage].alt" loading="lazy">
      </NuxtLink>
      <div v-if="images.length > 1" class="itinerary-card__carousel-controls">
        <button type="button" aria-label="Show previous photo" @click="previousImage"><MaterialIcon name="arrow_back" :size="18" /></button>
        <button type="button" aria-label="Show next photo" @click="nextImage"><MaterialIcon name="arrow_forward" :size="18" /></button>
      </div>
      <div v-if="images.length > 1" class="itinerary-card__dots" aria-label="Choose photo">
        <button v-for="(image, index) in images" :key="image.url" type="button" :class="{ 'is-active': activeImage === index }" :aria-label="`Show photo ${index + 1}`" :aria-pressed="activeImage === index" @click="activeImage = index" />
      </div>
      <button class="itinerary-card__share" type="button" :aria-label="copiedShareLink ? 'Itinerary link copied' : 'Share itinerary'" @click="shareItinerary"><MaterialIcon name="share" :size="19" /><span class="sr-only">{{ copiedShareLink ? 'Itinerary link copied' : 'Share itinerary' }}</span></button>
      <span class="duration-chip">{{ duration }}</span>
    </div>
    <div class="itinerary-card__body">
      <p class="route-text">{{ itinerary.destination.locations.join(' · ') }}</p>
      <h3><NuxtLink :to="`/itineraries/${itinerary.slug}`">{{ itinerary.title }}</NuxtLink></h3>
      <p class="itinerary-card__summary">{{ itinerary.summary }}</p>
      <div class="itinerary-card__bottom">
        <span class="theme-chip">{{ packageType }}</span>
        <button class="itinerary-card__enquire" type="button" @click="openEnquiry(itinerary.title)">Enquire <MaterialIcon name="arrow_forward" :size="17" /></button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.itinerary-card__image{isolation:isolate}.itinerary-card__image-link{display:block;width:100%;height:100%}.itinerary-card__cover{width:100%;height:100%;object-fit:cover}.itinerary-card__carousel-controls{position:absolute;top:50%;right:12px;left:12px;z-index:2;display:flex;justify-content:space-between;transform:translateY(-50%);pointer-events:none;opacity:0;transition:opacity .18s ease}.itinerary-card__image:hover .itinerary-card__carousel-controls,.itinerary-card__image:focus-within .itinerary-card__carousel-controls{opacity:1}.itinerary-card__carousel-controls button,.itinerary-card__share{display:grid;width:35px;height:35px;place-items:center;border:0;border-radius:50%;background:rgb(255 255 255 / 94%);color:#17372f;box-shadow:0 3px 12px rgb(14 44 35 / 14%);cursor:pointer}.itinerary-card__carousel-controls button{pointer-events:auto}.itinerary-card__carousel-controls button:hover,.itinerary-card__share:hover{background:#fff;transform:scale(1.04)}.itinerary-card__share{position:absolute;top:14px;right:14px;z-index:3}.itinerary-card__dots{position:absolute;bottom:17px;left:50%;z-index:2;display:flex;gap:5px;transform:translateX(-50%)}.itinerary-card__dots button{width:6px;height:6px;padding:0;border:0;border-radius:50%;background:rgb(255 255 255 / 62%);box-shadow:0 1px 4px rgb(0 0 0 / 24%);cursor:pointer}.itinerary-card__dots button.is-active{width:16px;border-radius:999px;background:#fff}.itinerary-card__enquire{display:inline-flex;align-items:center;gap:5px;padding:10px 14px;border:1px solid var(--forest);border-radius:999px;background:var(--forest);color:#fff;font-size:13px;font-weight:850;line-height:1;box-shadow:0 4px 12px rgb(17 62 50 / 18%);transition:background .18s ease,box-shadow .18s ease,transform .18s ease}.itinerary-card__enquire:hover{background:var(--forest-hover);box-shadow:0 6px 16px rgb(14 48 40 / 22%);transform:translateY(-1px)}.itinerary-card__enquire:focus-visible{outline:3px solid rgb(17 62 50 / 25%);outline-offset:3px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}@media(hover:none){.itinerary-card__carousel-controls{opacity:1}}@media(max-width:620px){.itinerary-card__carousel-controls{right:10px;left:10px}.itinerary-card__carousel-controls button,.itinerary-card__share{width:33px;height:33px}.itinerary-card__enquire{padding:10px 14px;font-size:14px}}
</style>
