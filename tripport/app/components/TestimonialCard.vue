<script setup lang="ts">
import type { Testimonial } from '~/data/testimonials'

const props = withDefaults(defineProps<{
  testimonial: Testimonial
  preview?: boolean
  compact?: boolean
}>(), {
  preview: false,
  compact: false,
})

const emit = defineEmits<{ 'show-more': [] }>()

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
const storyMedia = computed(() => props.testimonial.storyMedia?.filter((media) => media.url?.trim()) || [])
</script>

<template>
  <article v-if="testimonial.name || testimonial.quote || preview" class="testimonial-card" :class="{ 'testimonial-card--preview': preview, 'testimonial-card--compact': compact }">
    <template v-if="compact">
      <header class="testimonial-card__compact-header">
        <div class="testimonial-card__traveller testimonial-card__traveller--compact">
          <TripportImage v-if="imageSource" :image="imageSource" :alt="testimonial.name ? `${testimonial.name}, traveller` : 'Traveller'" sizes="42px" />
          <span v-else class="testimonial-card__avatar" aria-hidden="true">{{ initials }}</span>
          <div><strong>{{ testimonial.name || 'Tripport traveller' }}</strong><small v-if="travellerMeta">{{ travellerMeta }}</small></div>
        </div>
        <div class="testimonial-card__rating" :aria-label="`${testimonial.rating || 0} out of 5 stars`"><span v-for="(active, index) in stars" :key="index" :class="{ 'is-active': active }" aria-hidden="true">★</span></div>
      </header>

      <div class="testimonial-card__compact-copy">
        <span v-if="testimonial.featured" class="testimonial-card__featured">Featured story</span>
        <h3 v-if="testimonial.title">{{ testimonial.title }}</h3>
        <blockquote v-if="testimonial.quote" class="testimonial-card__quote--clamped">“{{ testimonial.quote }}”</blockquote>
      </div>

      <footer class="testimonial-card__compact-footer">
        <span v-if="storyMedia.length" class="testimonial-card__media-note"><MaterialIcon :name="storyMedia.some(media => media.type === 'video') ? 'videocam' : 'photo_library'" :size="16" />Traveller media</span>
        <span v-else />
        <button type="button" @click="emit('show-more')">Read full review <MaterialIcon name="arrow_forward" :size="16" /></button>
      </footer>
    </template>

    <template v-else>
      <div class="testimonial-card__topline">
        <div class="testimonial-card__rating" :aria-label="`${testimonial.rating || 0} out of 5 stars`">
          <span v-for="(active, index) in stars" :key="index" :class="{ 'is-active': active }" aria-hidden="true">★</span>
        </div>
        <span v-if="testimonial.featured" class="testimonial-card__featured">Featured story</span>
      </div>

      <h3 v-if="testimonial.title">{{ testimonial.title }}</h3>
      <blockquote v-if="testimonial.quote">“{{ testimonial.quote }}”</blockquote>
      <p v-else-if="preview" class="testimonial-card__empty-copy">The traveller’s review will appear here.</p>

      <div v-if="storyMedia.length" class="testimonial-card__media">
        <figure v-for="media in storyMedia" :key="media.url">
          <img v-if="media.type === 'image'" :src="media.url" :alt="media.alt || 'Traveller shared photo'">
          <video v-else controls playsinline preload="metadata"><source :src="media.url">Your browser does not support this traveller video.</video>
        </figure>
      </div>

      <footer class="testimonial-card__traveller">
        <TripportImage v-if="imageSource" :image="imageSource" :alt="testimonial.name ? `${testimonial.name}, traveller` : 'Traveller'" sizes="38px" />
        <span v-else class="testimonial-card__avatar" aria-hidden="true">{{ initials }}</span>
        <div>
          <strong v-if="testimonial.name">{{ testimonial.name }}</strong>
          <strong v-else-if="preview">Traveller name</strong>
          <small v-if="travellerMeta">{{ travellerMeta }}</small>
        </div>
      </footer>
    </template>
  </article>
</template>

<style scoped>
.testimonial-card{display:grid;gap:20px;padding:25px;border:1px solid #dce8e0;border-radius:18px;background:#fff;color:#183b2e;box-shadow:0 12px 34px rgb(15 54 41 / 7%)}.testimonial-card__topline{display:flex;align-items:center;justify-content:space-between;gap:12px}.testimonial-card__rating{display:flex;gap:3px;color:#d6dfda;font-size:17px;letter-spacing:.03em;line-height:1}.testimonial-card__rating .is-active{color:#d89422}.testimonial-card__featured{display:inline-flex;width:max-content;padding:5px 8px;border-radius:999px;background:#e9f5ed;color:#23714f;font-size:10px;font-weight:850;letter-spacing:.06em;text-transform:uppercase}.testimonial-card h3{margin:0;color:#183b2e;font-size:20px;letter-spacing:-.045em;line-height:1.15}.testimonial-card blockquote{margin:0;color:#41564c;font-size:15px;font-weight:520;line-height:1.72}.testimonial-card__empty-copy{margin:0;color:#829189;font-size:14px;font-style:italic;line-height:1.6}.testimonial-card__media{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px}.testimonial-card__media figure{min-width:0;height:155px;margin:0;overflow:hidden;border-radius:12px;background:#e9f1ec}.testimonial-card__media img,.testimonial-card__media video{width:100%;height:100%;object-fit:cover}.testimonial-card__media video{display:block;background:#143d31}.testimonial-card__traveller{display:flex;align-items:center;gap:10px;padding-top:18px;border-top:1px solid #e5ede8}.testimonial-card__traveller img,.testimonial-card__avatar{display:grid;width:38px;height:38px;flex:0 0 auto;place-items:center;border-radius:50%;object-fit:cover}.testimonial-card__traveller img{background:#dbe9e1}.testimonial-card__avatar{background:#dceddf;color:#276349;font-size:12px;font-weight:850}.testimonial-card__traveller strong,.testimonial-card__traveller small{display:block}.testimonial-card__traveller strong{color:#1d4637;font-size:13px}.testimonial-card__traveller small{margin-top:3px;color:#78877f;font-size:11px}.testimonial-card--compact{min-height:254px;grid-template-rows:auto minmax(0,1fr) auto;gap:17px;padding:23px;box-shadow:none;transition:border-color .2s ease,box-shadow .2s ease,transform .2s ease}.testimonial-card--compact:hover{border-color:#b5d2c1;box-shadow:0 15px 33px rgb(15 54 41 / 8%);transform:translateY(-2px)}.testimonial-card__compact-header{display:flex;align-items:center;justify-content:space-between;gap:10px}.testimonial-card__traveller--compact{min-width:0;padding:0;border:0}.testimonial-card__traveller--compact :deep(img),.testimonial-card__traveller--compact .testimonial-card__avatar{width:42px;height:42px}.testimonial-card__traveller--compact strong{overflow:hidden;max-width:150px;text-overflow:ellipsis;white-space:nowrap}.testimonial-card__compact-copy{display:grid;align-content:start;gap:10px}.testimonial-card__compact-copy h3{font-size:21px;line-height:1.12}.testimonial-card__quote--clamped{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:4;color:#50645a!important;font-size:14px!important;line-height:1.62!important}.testimonial-card__compact-footer{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-top:14px;border-top:1px solid #e7eee9}.testimonial-card__media-note{display:inline-flex;align-items:center;gap:5px;color:#6d8277;font-size:11px;font-weight:750}.testimonial-card__media-note :deep(.material-icon){color:#287154}.testimonial-card__compact-footer>span:empty{display:block}.testimonial-card__compact-footer button{display:inline-flex;align-items:center;gap:4px;padding:0;border:0;background:transparent;color:#176248;font-size:12px;font-weight:850;white-space:nowrap}.testimonial-card__compact-footer button:hover{text-decoration:underline;text-underline-offset:3px}.testimonial-card__compact-footer button:focus-visible{outline:3px solid rgb(15 115 85 / 23%);outline-offset:4px;border-radius:3px}.testimonial-card--preview{max-width:620px;margin:0 auto;padding:31px}@media(max-width:540px){.testimonial-card{padding:20px}.testimonial-card--compact{min-height:236px;padding:20px}.testimonial-card--preview{padding:23px}.testimonial-card blockquote{font-size:14px}.testimonial-card__compact-copy h3{font-size:20px}}
</style>
