<script setup lang="ts">
import type { Testimonial } from '~/data/testimonials'

const props = withDefaults(defineProps<{
  testimonial: Testimonial
  preview?: boolean
}>(), {
  preview: false,
})

const imageSource = computed(() => props.testimonial.image?.trim() ? {
  url: props.testimonial.image,
  variants: props.testimonial.imageVariants,
  width: props.testimonial.imageWidth,
  height: props.testimonial.imageHeight,
} : null)

const initials = computed(() => {
  const words = props.testimonial.name.trim().split(/\s+/).filter(Boolean)
  return words.slice(0, 2).map(word => word[0]).join('').toUpperCase() || 'T'
})

const travellerMeta = computed(() => [props.testimonial.location, props.testimonial.travellerType].filter(Boolean).join(' · '))
const stars = computed(() => Array.from({ length: 5 }, (_, index) => index < props.testimonial.rating))
</script>

<template>
  <article v-if="testimonial.name || testimonial.quote || preview" class="testimonial-card" :class="{ 'testimonial-card--preview': preview }">
    <div class="testimonial-card__topline">
      <div class="testimonial-card__rating" :aria-label="`${testimonial.rating || 0} out of 5 stars`">
        <span v-for="(active, index) in stars" :key="index" :class="{ 'is-active': active }" aria-hidden="true">★</span>
      </div>
      <span v-if="testimonial.featured" class="testimonial-card__featured">Featured story</span>
    </div>

    <h3 v-if="testimonial.title">{{ testimonial.title }}</h3>
    <blockquote v-if="testimonial.quote">“{{ testimonial.quote }}”</blockquote>
    <p v-else-if="preview" class="testimonial-card__empty-copy">The traveller’s review will appear here.</p>

    <footer class="testimonial-card__traveller">
      <TripportImage v-if="imageSource" :image="imageSource" :alt="testimonial.name ? `${testimonial.name}, traveller` : 'Traveller'" sizes="38px" />
      <span v-else class="testimonial-card__avatar" aria-hidden="true">{{ initials }}</span>
      <div>
        <strong v-if="testimonial.name">{{ testimonial.name }}</strong>
        <strong v-else-if="preview">Traveller name</strong>
        <small v-if="travellerMeta">{{ travellerMeta }}</small>
      </div>
    </footer>
  </article>
</template>

<style scoped>
.testimonial-card{display:grid;gap:20px;padding:25px;border:1px solid #dce8e0;border-radius:18px;background:#fff;color:#183b2e;box-shadow:0 12px 34px rgb(15 54 41 / 7%)}.testimonial-card__topline{display:flex;align-items:center;justify-content:space-between;gap:12px}.testimonial-card__rating{display:flex;gap:3px;color:#d6dfda;font-size:17px;letter-spacing:.03em;line-height:1}.testimonial-card__rating .is-active{color:#d89422}.testimonial-card__featured{padding:5px 8px;border-radius:999px;background:#e9f5ed;color:#23714f;font-size:10px;font-weight:850;letter-spacing:.06em;text-transform:uppercase}.testimonial-card h3{margin:0;color:#183b2e;font-size:20px;letter-spacing:-.045em;line-height:1.15}.testimonial-card blockquote{margin:0;color:#41564c;font-size:15px;font-weight:520;line-height:1.72}.testimonial-card__empty-copy{margin:0;color:#829189;font-size:14px;font-style:italic;line-height:1.6}.testimonial-card__traveller{display:flex;align-items:center;gap:10px;padding-top:18px;border-top:1px solid #e5ede8}.testimonial-card__traveller img,.testimonial-card__avatar{display:grid;width:38px;height:38px;flex:0 0 auto;place-items:center;border-radius:50%;object-fit:cover}.testimonial-card__traveller img{background:#dbe9e1}.testimonial-card__avatar{background:#dceddf;color:#276349;font-size:12px;font-weight:850}.testimonial-card__traveller strong,.testimonial-card__traveller small{display:block}.testimonial-card__traveller strong{color:#1d4637;font-size:13px}.testimonial-card__traveller small{margin-top:3px;color:#78877f;font-size:11px}.testimonial-card--preview{max-width:620px;margin:0 auto;padding:31px}@media(max-width:540px){.testimonial-card{padding:20px}.testimonial-card--preview{padding:23px}.testimonial-card blockquote{font-size:14px}}
</style>
