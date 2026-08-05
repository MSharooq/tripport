<script setup lang="ts">
import { packageDuration, packageTypeLabel } from '~/data/itineraries'
import type { TripPackage } from '~/data/packages/types'

const props = defineProps<{ packageDocument: TripPackage }>()

defineEmits<{ close: [] }>()

const duration = computed(() => packageDuration(props.packageDocument.duration))
const typeLabel = computed(() => packageTypeLabel(props.packageDocument.packageType))
const heroImage = computed(() => props.packageDocument.images.cover.url)
const journeyTitle = computed(() => props.packageDocument.title || 'Your package title')
const journeySummary = computed(() => props.packageDocument.summary || 'Your package summary will appear here once you add it.')
</script>

<template>
  <AdminPreviewFrame label="Package preview" @close="$emit('close')">
    <article class="package-preview">
      <section class="package-preview__hero" :class="{ 'package-preview__hero--empty': !heroImage }" :style="heroImage ? { backgroundImage: `url(${heroImage})` } : undefined">
        <div class="package-preview__hero-copy"><span>{{ duration }} · {{ typeLabel }}</span><h1>{{ journeyTitle }}</h1><p>{{ journeySummary }}</p></div>
      </section>

      <section class="package-preview__body">
        <main>
          <span class="package-preview__eyebrow">Route overview</span>
          <h2>{{ packageDocument.destination.locations.length ? packageDocument.destination.locations.join(' · ') : 'Your destinations' }}</h2>
          <p class="package-preview__intro">{{ packageDocument.description || 'Your full journey introduction will appear here.' }}</p>

          <div class="package-preview__facts"><div><span>Duration</span><strong>{{ duration }}</strong></div><div><span>Destinations</span><strong>{{ packageDocument.destination.locations.length || '—' }} stops</strong></div><div><span>Travel style</span><strong>{{ typeLabel }}</strong></div></div>

          <section class="package-preview__days"><span class="package-preview__eyebrow">The journey</span><h2>Day-by-day itinerary</h2><article v-for="day in packageDocument.itinerary" :key="day.day"><div><span>Day</span><strong>{{ String(day.day).padStart(2, '0') }}</strong></div><section><h3>{{ day.title || `Day ${day.day} title` }}</h3><p>{{ day.description || 'A description of this day will appear here.' }}</p><small v-if="day.meals?.length || day.overnightAt">{{ [day.meals?.join(', '), day.overnightAt ? `Overnight in ${day.overnightAt}` : ''].filter(Boolean).join(' · ') }}</small></section></article></section>

          <section class="package-preview__included"><div><span>What’s included</span><ul v-if="packageDocument.inclusions.length"><li v-for="item in packageDocument.inclusions" :key="item"><MaterialIcon name="check" :size="16" />{{ item }}</li></ul><p v-else>Add inclusions to show them here.</p></div><div><span>What’s not included</span><ul v-if="packageDocument.exclusions.length"><li v-for="item in packageDocument.exclusions" :key="item"><MaterialIcon name="remove" :size="16" />{{ item }}</li></ul><p v-else>Add exclusions to show them here.</p></div></section>
        </main>

        <aside><span class="package-preview__eyebrow">Start planning</span><h3>Interested in this journey?</h3><p>Share your travel dates and group details. Our team will respond with the right next steps.</p><button type="button">{{ packageDocument.contact.callToAction || 'Enquire about this journey' }}</button><small>Available on request</small></aside>
      </section>
    </article>
  </AdminPreviewFrame>
</template>

<style scoped>
.package-preview{color:#17362b}.package-preview__hero{position:relative;display:grid;min-height:390px;align-items:end;padding:48px clamp(24px,6vw,78px);background-position:center;background-size:cover;color:#fff;isolation:isolate}.package-preview__hero::before{position:absolute;z-index:-1;inset:0;background:linear-gradient(90deg,rgb(10 33 26 / 83%),rgb(10 33 26 / 33%));content:''}.package-preview__hero--empty{background:linear-gradient(135deg,#235d49,#0e3028)}.package-preview__hero-copy{max-width:720px}.package-preview__hero span,.package-preview__eyebrow{display:block;font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.package-preview__hero span{width:max-content;padding:8px 10px;border-radius:999px;background:rgb(255 255 255 / 17%);backdrop-filter:blur(4px)}.package-preview__hero h1{max-width:720px;margin:16px 0 11px;font-size:clamp(42px,5vw,69px);letter-spacing:-.075em;line-height:.94}.package-preview__hero p{max-width:620px;margin:0;color:rgb(255 255 255 / 85%);font-size:16px;line-height:1.65}.package-preview__body{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:58px;padding:62px clamp(24px,6vw,78px)}.package-preview__eyebrow{color:#0d7253}.package-preview__body main>h2{margin:13px 0 16px;font-size:clamp(35px,4vw,58px);letter-spacing:-.065em;line-height:.98}.package-preview__intro{margin:0;color:#66756d;font-size:16px;line-height:1.72}.package-preview__facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:34px 0 42px;border:1px solid #dce7e0;border-radius:14px;overflow:hidden;background:#dce7e0}.package-preview__facts div{padding:15px;background:#fff}.package-preview__facts span{display:block;color:#7a8880;font-size:10px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.package-preview__facts strong{display:block;margin-top:7px;font-size:13px;line-height:1.4}.package-preview__days{padding-top:32px;border-top:1px solid #dce7e0}.package-preview__days h2{margin:11px 0 21px;font-size:32px;letter-spacing:-.06em}.package-preview__days article{display:grid;grid-template-columns:76px minmax(0,1fr);overflow:hidden;margin-top:10px;border:1px solid #dde8e1;border-radius:14px}.package-preview__days article>div{padding:16px 13px;background:#eef5f0;color:#174b39}.package-preview__days article>div span{display:block;font-size:9px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.package-preview__days article>div strong{display:block;margin-top:3px;font-size:29px;letter-spacing:-.07em}.package-preview__days article section{padding:16px 18px}.package-preview__days h3{margin:0;font-size:18px;letter-spacing:-.035em}.package-preview__days p{margin:7px 0 0;color:#63726a;font-size:13px;line-height:1.6}.package-preview__days small{display:block;margin-top:8px;color:#1a7355;font-size:11px;font-weight:800}.package-preview__included{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:30px}.package-preview__included>div{padding:19px;border:1px solid #dde7e1;border-radius:13px;background:#f8faf8}.package-preview__included span{font-size:13px;font-weight:850}.package-preview__included ul{display:grid;gap:7px;padding:0;margin:13px 0 0;list-style:none}.package-preview__included li{display:flex;gap:7px;align-items:flex-start;color:#52635b;font-size:12px;line-height:1.5}.package-preview__included li .material-icon{color:#0a7657}.package-preview__included>div:last-child li .material-icon{color:#8c6757}.package-preview__included p{margin:12px 0 0;color:#7b8881;font-size:12px}.package-preview__body aside{align-self:start;padding:24px;border:1px solid #dce7e0;border-radius:16px;background:#f5f8f6}.package-preview__body aside h3{margin:13px 0 9px;font-size:25px;letter-spacing:-.05em;line-height:1.04}.package-preview__body aside p{margin:0;color:#65736b;font-size:13px;line-height:1.62}.package-preview__body aside button{width:100%;margin-top:20px;padding:13px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:13px;font-weight:800}.package-preview__body aside small{display:block;margin-top:11px;color:#4e7464;font-size:11px;font-weight:800;text-align:center}@media(max-width:780px){.package-preview__body{grid-template-columns:1fr;gap:30px;padding-top:38px}.package-preview__body aside{position:static}.package-preview__facts,.package-preview__included{grid-template-columns:1fr}.package-preview__hero{min-height:330px}}@media(max-width:520px){.package-preview__hero h1{font-size:43px}.package-preview__facts{grid-template-columns:1fr}.package-preview__days article{grid-template-columns:64px minmax(0,1fr)}}
</style>
