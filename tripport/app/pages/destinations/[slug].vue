<script setup lang="ts">
import type { Destination } from '~/data/destinations'
import { responsiveImageSrc } from '~/data/images'
import type { TripPackage } from '~/data/packages/types'

const route = useRoute()
const { openEnquiry } = useEnquiry()

const { data: destinationResponse } = await useFetch<Destination[]>('/api/content/destinations', {
  default: () => [],
})
const { data: packageResponse } = await useFetch<TripPackage[]>('/api/content/packages', {
  default: () => [],
})

const allDestinations = computed(() => {
  return destinationResponse.value?.filter(item => item.status === 'published') ?? []
})
const allPackages = computed(() => {
  return packageResponse.value?.filter(item => item.status === 'published') ?? []
})
const destination = computed(() => allDestinations.value.find(item => item.slug === String(route.params.slug)))

if (!destination.value) throw createError({ statusCode: 404, statusMessage: 'Destination not found' })

const heroImage = computed(() => destination.value?.image ? {
  url: destination.value.image,
  alt: destination.value.imageAlt || destination.value.name,
  variants: destination.value.imageVariants,
  width: destination.value.imageWidth,
  height: destination.value.imageHeight,
} : null)
const hasHeroImage = computed(() => Boolean(responsiveImageSrc(heroImage.value)))
const galleryImages = computed(() => (destination.value?.gallery ?? []).filter(image => image.url?.trim()))
const facts = computed(() => {
  if (destination.value?.facts?.length) return destination.value.facts
  if (!destination.value) return []
  return [
    { label: 'Best for', value: destination.value.bestFor?.[0] || 'Kerala journeys' },
    { label: 'Ideal stay', value: destination.value.idealNights || 'Plan to suit your route' },
    { label: 'Region', value: destination.value.region || destination.value.state || 'Kerala' },
  ]
})
const related = computed(() => {
  if (!destination.value) return []
  const relatedSlugs = destination.value.relatedItinerarySlugs ?? []
  const explicitMatches = allPackages.value.filter(item => relatedSlugs.includes(item.slug))
  if (explicitMatches.length) return explicitMatches.slice(0, 3)
  return allPackages.value
    .filter(item => item.destination.locations.some(stop => stop.toLowerCase() === destination.value!.name.toLowerCase()))
    .slice(0, 3)
})

useSeoMeta({
  title: () => destination.value?.seo.metaTitle || `${destination.value?.name ?? 'Kerala'} Travel Guide`,
  description: () => destination.value?.seo.metaDescription || destination.value?.summary || '',
  ogImage: () => responsiveImageSrc(heroImage.value) || undefined,
})
</script>

<template>
  <div v-if="destination">
    <section class="destination-hero" :class="{ 'destination-hero--no-image': !hasHeroImage }">
      <TripportImage v-if="heroImage" class="destination-hero__media" :image="heroImage" :alt="destination.imageAlt || destination.name" sizes="100vw" loading="eager" fetchpriority="high" />
      <div class="page-shell destination-hero__content">
        <span class="hero-chip">{{ [destination.region, destination.state].filter(Boolean).join(' · ') }}</span>
        <h1>{{ destination.name }}</h1>
        <p>{{ destination.summary }}</p>
      </div>
    </section>

    <section class="section page-shell destination-detail">
      <main>
        <span class="eyebrow">Plan the stop</span>
        <h2>How {{ destination.name }} fits into a Kerala journey.</h2>
        <p class="destination-detail__intro">{{ destination.introduction || destination.summary }}</p>

        <dl class="detail-facts">
          <div v-for="fact in facts" :key="`${fact.label}-${fact.value}`"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div>
        </dl>

        <section v-if="destination.highlights?.length" class="destination-detail__section">
          <span>Highlights</span>
          <h3>Moments worth making time for.</h3>
          <ul class="destination-chip-list"><li v-for="item in destination.highlights" :key="item"><MaterialIcon name="check" :size="16" />{{ item }}</li></ul>
        </section>

        <section v-if="destination.bestFor?.length" class="destination-detail__section destination-detail__section--soft">
          <span>Best for</span>
          <h3>Who will enjoy it most.</h3>
          <div class="destination-tags"><b v-for="item in destination.bestFor" :key="item">{{ item }}</b></div>
        </section>

        <section v-if="galleryImages.length" class="destination-gallery" aria-label="Destination gallery">
          <figure v-for="image in galleryImages" :key="image.url"><TripportImage :image="image" :alt="image.alt || `${destination.name} travel inspiration`" :sizes="'(max-width: 620px) calc(100vw - 36px), 500px'" /></figure>
        </section>
      </main>

      <aside class="destination-detail__aside">
        <span class="eyebrow">Plan a journey</span>
        <h3>Include {{ destination.name }} in your Kerala route.</h3>
        <p>Tell us when you would like to travel and what you enjoy. We will help you find the right pace and route.</p>
        <button class="button button--dark" type="button" @click="openEnquiry(`${destination.name} journey`)">Start an enquiry</button>
      </aside>
    </section>

    <section v-if="related.length" class="section section--soft">
      <div class="page-shell">
        <div class="section-heading"><div><span class="eyebrow">Suggested routes</span><h2>Itineraries including {{ destination.name }}</h2></div></div>
        <div class="itinerary-grid"><ItineraryCard v-for="item in related" :key="item.slug" :itinerary="item" /></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.destination-hero{position:relative;display:flex;min-height:540px;align-items:end;overflow:hidden;background-position:center;background-size:cover;color:#fff;isolation:isolate}.destination-hero__media{position:absolute;z-index:-2;inset:0;width:100%;height:100%;object-fit:cover}.destination-hero::before{position:absolute;z-index:-1;inset:0;background:linear-gradient(90deg,rgb(7 27 20 / 78%),rgb(7 27 20 / 24%));content:''}.destination-hero--no-image{background:linear-gradient(135deg,#2d745a,#113e32)}.destination-hero__content{padding-bottom:76px}.destination-hero__content h1{max-width:760px;margin:19px 0 13px;font-size:clamp(55px,6vw,88px);letter-spacing:-.08em;line-height:.9}.destination-hero__content p{max-width:650px;margin:0;color:rgb(255 255 255 / 87%);font-size:17px;line-height:1.65}.destination-detail{display:grid;grid-template-columns:minmax(0,1fr) 342px;gap:76px}.destination-detail h2{max-width:770px;margin:13px 0 17px;color:#183c2e;font-size:clamp(39px,4.2vw,64px);letter-spacing:-.07em;line-height:.96}.destination-detail__intro{max-width:740px;margin:0;color:#617067;font-size:17px;line-height:1.75}.detail-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:35px 0 0;overflow:hidden;border:1px solid #dce7e0;border-radius:15px;background:#dce7e0}.detail-facts>div{padding:17px;background:#fff}.detail-facts dt,.destination-detail__section>span{display:block;color:#5d856f;font-size:10px;font-weight:850;letter-spacing:.11em;text-transform:uppercase}.detail-facts dd{margin:7px 0 0;color:#183c2e;font-size:14px;font-weight:800;line-height:1.35}.destination-detail__section{padding-top:35px;margin-top:35px;border-top:1px solid #dce7e0}.destination-detail__section h3{margin:11px 0 17px;font-size:29px;letter-spacing:-.055em;line-height:1.03}.destination-chip-list{display:grid;gap:9px;padding:0;margin:0;list-style:none}.destination-chip-list li{display:flex;gap:8px;align-items:flex-start;padding:13px 14px;border:1px solid #e0e9e3;border-radius:11px;color:#506159;font-size:14px;line-height:1.5}.destination-chip-list .material-icon{margin-top:2px;color:#087654}.destination-detail__section--soft{padding:25px;margin-top:35px;border:0;border-radius:16px;background:#f1f7f3}.destination-tags{display:flex;flex-wrap:wrap;gap:8px}.destination-tags b{padding:9px 11px;border-radius:9px;background:#fff;color:#315c4b;font-size:12px}.destination-gallery{display:grid;grid-template-columns:1.3fr 1fr;gap:11px;margin-top:36px}.destination-gallery figure{height:225px;margin:0;overflow:hidden;border-radius:14px;background:#e6eee9}.destination-gallery figure:first-child{grid-row:span 2;height:461px}.destination-gallery img{width:100%;height:100%;object-fit:cover}.destination-detail__aside{position:sticky;top:98px;align-self:start;padding:27px;border:1px solid #dce7e0;border-radius:18px;background:#f5f8f6}.destination-detail__aside h3{margin:14px 0 10px;font-size:28px;letter-spacing:-.055em;line-height:1.04}.destination-detail__aside p{margin:0;color:#64746c;font-size:14px;line-height:1.65}.destination-detail__aside .button{width:100%;margin-top:22px}@media(max-width:900px){.destination-detail{grid-template-columns:1fr;gap:40px}.destination-detail__aside{position:static}.destination-gallery{max-width:760px}}@media(max-width:620px){.destination-hero{min-height:470px}.destination-hero__content{padding-bottom:52px}.destination-hero__content h1{font-size:55px}.destination-detail{gap:30px}.detail-facts,.destination-gallery{grid-template-columns:1fr}.destination-gallery figure,.destination-gallery figure:first-child{height:245px}.destination-detail__section{margin-top:28px;padding-top:28px}}
</style>

<style scoped>
.destination-hero__media{z-index:0}.destination-hero::before{z-index:1}.destination-hero__content{position:relative;z-index:2}
</style>
