<script setup lang="ts">
import { itineraries } from '~/data/itineraries'
import { responsiveImageSrc } from '~/data/images'
import { findTravelGuide } from '~/data/travelGuides'
import type { TripPackage } from '~/data/packages/types'
import type { TravelGuide } from '~/data/travelGuides'

const route = useRoute()
const slug = String(route.params.slug)
const { data: managedGuide } = await useFetch<TravelGuide | null>(() => `/api/content/guides/${slug}`, { default: () => findTravelGuide(slug) ?? null })
const { data: managedPackages } = await useFetch<TripPackage[]>('/api/content/packages', { default: () => itineraries })
const guide = computed(() => managedGuide.value ?? findTravelGuide(slug))

if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: 'Travel guide not found' })
}

const relatedItineraries = computed(() => (managedPackages.value ?? itineraries).filter(itinerary =>
  itinerary.status === 'published' && guide.value?.relatedItinerarySlugs.includes(itinerary.slug),
))
const { openEnquiry } = useEnquiry()
const guideHero = computed(() => guide.value ? {
  url: guide.value.image,
  variants: guide.value.imageVariants,
  width: guide.value.imageWidth,
  height: guide.value.imageHeight,
} : null)

useSeoMeta({
  title: () => guide.value?.seo.metaTitle ?? 'Kerala travel guide',
  description: () => guide.value?.seo.metaDescription ?? '',
  ogTitle: () => guide.value?.seo.metaTitle ?? 'Kerala travel guide',
  ogDescription: () => guide.value?.seo.metaDescription ?? '',
  ogImage: () => guideHero.value ? responsiveImageSrc(guideHero.value) : '',
})
</script>

<template>
  <div v-if="guide">
    <section class="inner-hero inner-hero--image guide-hero">
      <TripportImage v-if="guideHero" class="guide-hero__media" :image="guideHero" :alt="guide.title" sizes="100vw" loading="eager" fetchpriority="high" />
      <div class="page-shell inner-hero__content">
        <span class="hero-chip">{{ guide.category }} · {{ guide.readTime }}</span>
        <h1>{{ guide.title }}</h1>
        <p>{{ guide.intro }}</p>
      </div>
    </section>

    <section class="section page-shell guide-layout">
      <article class="guide-article">
        <div class="guide-article__intro"><span class="eyebrow">Tripport guide</span><p>{{ guide.summary }}</p></div>

        <section v-for="(section, index) in guide.sections" :key="section.heading" class="guide-article__section">
          <span class="guide-article__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <div><h2>{{ section.heading }}</h2><p v-if="section.lead" class="guide-article__lead">{{ section.lead }}</p><p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p></div>
        </section>

        <section class="guide-takeaways"><span class="eyebrow">The short version</span><h2>Three things to keep in mind.</h2><ul><li v-for="takeaway in guide.takeaways" :key="takeaway"><MaterialIcon name="check" :size="18" />{{ takeaway }}</li></ul></section>
      </article>

      <aside class="guide-sidebar">
        <section class="guide-sidebar__card">
          <span class="eyebrow">At a glance</span>
          <dl><div v-for="fact in guide.quickLook" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl>
        </section>
        <section class="guide-sidebar__card guide-sidebar__card--cta">
          <span class="eyebrow">Plan with Tripport</span>
          <h3>Ready to start your Kerala journey?</h3>
          <p>Send an enquiry when you are ready to talk through the route, dates and people travelling.</p>
          <button class="button button--dark" type="button" @click="openEnquiry()">Start an enquiry <MaterialIcon name="arrow_forward" :size="17" /></button>
        </section>
      </aside>
    </section>

    <section v-if="relatedItineraries.length" class="section section--soft">
      <div class="page-shell"><div class="section-heading"><div><span class="eyebrow">Put it into practice</span><h2>Routes inspired by this guide.</h2></div><p>Explore these itinerary ideas, then send us an enquiry when one feels right.</p></div><div class="itinerary-grid"><ItineraryCard v-for="itinerary in relatedItineraries" :key="itinerary.slug" :itinerary="itinerary" /></div></div>
    </section>

    <section class="guide-bottom-cta">
      <div class="page-shell guide-bottom-cta__content"><div><span class="hero-chip">Travel well</span><h2>Make the route<br>feel right for you.</h2></div><button class="button button--light" type="button" @click="openEnquiry()">Start an enquiry <MaterialIcon name="arrow_forward" :size="18" /></button></div>
    </section>
  </div>
</template>

<style scoped>
.guide-hero{position:relative;isolation:isolate;background-position:center}.guide-hero__media{position:absolute;z-index:0;inset:0;width:100%;height:100%;object-fit:cover}.guide-hero::before{z-index:1}.guide-hero .inner-hero__content{z-index:2}.guide-layout{display:grid;grid-template-columns:minmax(0,1fr) 330px;gap:90px}.guide-article{max-width:760px}.guide-article__intro{padding-bottom:38px;border-bottom:1px solid #dfe7e2}.guide-article__intro>p{margin:15px 0 0;color:#263c33;font-size:22px;font-weight:500;letter-spacing:-.025em;line-height:1.45}.guide-article__section{display:grid;grid-template-columns:62px minmax(0,1fr);gap:20px;padding:43px 0;border-bottom:1px solid #e2e9e4}.guide-article__number{color:#0b7655;font-size:13px;font-weight:850;letter-spacing:.08em}.guide-article__section h2{margin:0;color:#122b22;font-size:clamp(31px,3.2vw,43px);letter-spacing:-.06em;line-height:1.04}.guide-article__section p{margin:17px 0 0;color:#596960;font-size:17px;line-height:1.75}.guide-article__section .guide-article__lead{margin-top:11px;color:#1f4939;font-size:18px;font-weight:750;line-height:1.5}.guide-sidebar{position:sticky;top:102px;align-self:start;display:grid;gap:14px}.guide-sidebar__card{padding:25px;border:1px solid #dbe6df;border-radius:18px;background:#fff}.guide-sidebar__card dl{display:grid;gap:15px;margin:21px 0 0}.guide-sidebar__card dl div{padding-bottom:15px;border-bottom:1px solid #e7ede9}.guide-sidebar__card dl div:last-child{padding:0;border:0}.guide-sidebar__card dt{color:#78867e;font-size:11px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.guide-sidebar__card dd{margin:6px 0 0;color:#1d4938;font-size:15px;font-weight:800;line-height:1.35}.guide-sidebar__card--cta{background:#eff6f1}.guide-sidebar__card h3{margin:15px 0 10px;font-size:27px;letter-spacing:-.055em;line-height:1.06}.guide-sidebar__card p{margin:0;color:#617167;font-size:15px;line-height:1.6}.guide-sidebar__card .button{width:100%;margin-top:21px}.guide-takeaways{padding:44px 0 0}.guide-takeaways h2{margin:14px 0 20px;font-size:clamp(32px,3.2vw,45px);letter-spacing:-.06em;line-height:1.04}.guide-takeaways ul{display:grid;gap:11px;padding:0;margin:0;list-style:none}.guide-takeaways li{display:flex;gap:10px;align-items:flex-start;padding:16px;border-radius:12px;background:#f2f7f4;color:#40564b;font-size:15px;line-height:1.55}.guide-takeaways .material-icon{flex:0 0 auto;margin-top:3px;color:#087754}.guide-bottom-cta{padding:82px 0;background:#123f32;color:#fff}.guide-bottom-cta__content{display:flex;align-items:end;justify-content:space-between;gap:28px}.guide-bottom-cta h2{margin:18px 0 0;font-size:clamp(42px,5vw,68px);letter-spacing:-.07em;line-height:.96}@media(max-width:900px){.guide-layout{grid-template-columns:1fr;gap:48px}.guide-sidebar{position:static;grid-template-columns:1fr 1fr}.guide-article{max-width:none}}@media(max-width:620px){.guide-article__intro>p{font-size:19px}.guide-article__section{grid-template-columns:1fr;gap:10px;padding:35px 0}.guide-article__section p{font-size:16px}.guide-sidebar{grid-template-columns:1fr}.guide-bottom-cta__content{align-items:start;flex-direction:column}.guide-bottom-cta{padding:62px 0}}
</style>
