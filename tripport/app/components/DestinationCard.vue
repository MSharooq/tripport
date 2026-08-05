<script setup lang="ts">
import type { Destination } from '~/data/destinations'

const props = defineProps<{ destination: Destination }>()

const coverImage = computed(() => props.destination.image ? {
  url: props.destination.image,
  alt: props.destination.imageAlt || props.destination.name,
  variants: props.destination.imageVariants,
  width: props.destination.imageWidth,
  height: props.destination.imageHeight,
} : null)
const locationLabel = computed(() => [props.destination.region, props.destination.state].filter(Boolean).join(' · '))
</script>

<template>
  <NuxtLink class="destination-card" :to="`/destinations/${destination.slug}`">
    <TripportImage
      v-if="coverImage"
      :image="coverImage"
      :alt="destination.imageAlt || destination.name"
      :sizes="'(max-width: 720px) calc((100vw - 47px) / 2), (max-width: 1050px) calc((100vw - 92px) / 3), 244px'"
    />
    <span v-else class="destination-card__fallback"><MaterialIcon name="image" :size="28" /></span>
    <span class="destination-card__overlay" />
    <span class="destination-card__content">
      <small>{{ locationLabel || 'Kerala, India' }}</small>
      <strong>{{ destination.name }}</strong>
      <span>{{ destination.idealNights || 'Explore this destination' }}</span>
    </span>
    <span v-if="destination.gallery?.length" class="destination-card__gallery"><MaterialIcon name="photo_library" :size="15" />{{ destination.gallery.length + 1 }}</span>
  </NuxtLink>
</template>

<style scoped>
.destination-card__fallback{display:grid;width:100%;height:100%;place-items:center;background:linear-gradient(135deg,#35785f,#113e32);color:#d7eee1}.destination-card__gallery{position:absolute;top:13px;right:13px;display:inline-flex;align-items:center;gap:4px;padding:6px 8px;border:1px solid rgb(255 255 255 / 30%);border-radius:999px;background:rgb(14 39 30 / 48%);backdrop-filter:blur(5px);color:#fff;font-size:10px;font-weight:850}
</style>
