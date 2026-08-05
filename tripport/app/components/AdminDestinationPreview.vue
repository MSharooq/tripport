<script setup lang="ts">
import type { Destination } from '~/data/destinations'
import { destinationImageSource } from '~/data/destinations'

const props = defineProps<{ destination: Destination }>()

defineEmits<{ close: [] }>()

const heroImage = computed(() => props.destination.image ? destinationImageSource(props.destination.image) : '')
const galleryImages = computed(() => (props.destination.gallery ?? []).filter(image => image.url?.trim()))
const facts = computed(() => {
  if (props.destination.facts?.length) return props.destination.facts
  return [
    { label: 'Best for', value: props.destination.bestFor?.[0] || 'Kerala journeys' },
    { label: 'Ideal stay', value: props.destination.idealNights || 'Plan your stay' },
    { label: 'Region', value: props.destination.region || props.destination.state || 'Kerala' },
  ]
})
</script>

<template>
  <AdminPreviewFrame label="Destination preview" @close="$emit('close')">
    <article class="destination-preview">
      <section class="destination-preview__hero" :class="{ 'destination-preview__hero--empty': !heroImage }" :style="heroImage ? { backgroundImage: `url(${heroImage})` } : undefined">
        <div>
          <span>{{ [destination.region, destination.state].filter(Boolean).join(' · ') || 'Kerala, India' }}</span>
          <h1>{{ destination.name || 'Your destination name' }}</h1>
          <p>{{ destination.summary || 'A concise destination summary will appear here.' }}</p>
        </div>
      </section>

      <section class="destination-preview__body">
        <main>
          <span class="destination-preview__eyebrow">Plan the stop</span>
          <h2>How {{ destination.name || 'this destination' }} fits into a Kerala journey.</h2>
          <p class="destination-preview__intro">{{ destination.introduction || 'Your destination introduction will appear here once you add it.' }}</p>

          <dl class="destination-preview__facts">
            <div v-for="fact in facts" :key="`${fact.label}-${fact.value}`"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div>
          </dl>

          <section v-if="destination.highlights?.length" class="destination-preview__section">
            <span class="destination-preview__eyebrow">Highlights</span>
            <h3>Moments worth making time for.</h3>
            <ul><li v-for="item in destination.highlights" :key="item"><MaterialIcon name="check" :size="16" />{{ item }}</li></ul>
          </section>

          <section v-if="destination.bestFor?.length" class="destination-preview__section destination-preview__section--soft">
            <span class="destination-preview__eyebrow">Best for</span>
            <h3>Who will enjoy it most.</h3>
            <div class="destination-preview__tags"><b v-for="item in destination.bestFor" :key="item">{{ item }}</b></div>
          </section>

          <section v-if="galleryImages.length" class="destination-preview__gallery" aria-label="Destination gallery preview">
            <figure v-for="image in galleryImages" :key="image.url"><img :src="destinationImageSource(image.url)" :alt="image.alt || `${destination.name || 'Destination'} travel inspiration`"></figure>
          </section>
        </main>

        <aside>
          <span class="destination-preview__eyebrow">Plan a journey</span>
          <h3>Include {{ destination.name || 'this destination' }} in your Kerala route.</h3>
          <p>Tell us when you would like to travel and what you enjoy. We will help you find the right pace and route.</p>
          <button type="button">Start an enquiry</button>
        </aside>
      </section>
    </article>
  </AdminPreviewFrame>
</template>

<style scoped>
.destination-preview{color:#17362b}.destination-preview__hero{position:relative;display:grid;min-height:390px;align-items:end;padding:48px clamp(24px,6vw,78px);background-position:center;background-size:cover;color:#fff;isolation:isolate}.destination-preview__hero::before{position:absolute;z-index:-1;inset:0;background:linear-gradient(90deg,rgb(10 33 26 / 84%),rgb(10 33 26 / 32%));content:''}.destination-preview__hero--empty{background:linear-gradient(135deg,#285e4b,#0e3028)}.destination-preview__hero>div{max-width:720px}.destination-preview__hero span,.destination-preview__eyebrow{display:block;font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.destination-preview__hero span{width:max-content;padding:8px 10px;border-radius:999px;background:rgb(255 255 255 / 17%);backdrop-filter:blur(4px)}.destination-preview__hero h1{margin:16px 0 11px;font-size:clamp(42px,5vw,69px);letter-spacing:-.075em;line-height:.94}.destination-preview__hero p{max-width:620px;margin:0;color:rgb(255 255 255 / 85%);font-size:16px;line-height:1.65}.destination-preview__body{display:grid;grid-template-columns:minmax(0,1fr) 296px;gap:62px;padding:62px clamp(24px,6vw,78px)}.destination-preview__eyebrow{color:#0c7252}.destination-preview__body main>h2{margin:13px 0 16px;font-size:clamp(35px,4vw,58px);letter-spacing:-.065em;line-height:.98}.destination-preview__intro{margin:0;color:#66756d;font-size:16px;line-height:1.72}.destination-preview__facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:34px 0 0;overflow:hidden;border:1px solid #dce7e0;border-radius:14px;background:#dce7e0}.destination-preview__facts>div{padding:15px;background:#fff}.destination-preview__facts dt{color:#75847b;font-size:10px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.destination-preview__facts dd{margin:7px 0 0;color:#1e4939;font-size:13px;font-weight:800;line-height:1.4}.destination-preview__section{padding-top:33px;margin-top:33px;border-top:1px solid #dce7e0}.destination-preview__section h3{margin:10px 0 16px;font-size:28px;letter-spacing:-.055em;line-height:1.03}.destination-preview__section ul{display:grid;gap:8px;padding:0;margin:0;list-style:none}.destination-preview__section li{display:flex;gap:7px;align-items:flex-start;padding:12px 13px;border:1px solid #dce7e0;border-radius:10px;color:#53635b;font-size:13px;line-height:1.55}.destination-preview__section li .material-icon{margin-top:2px;color:#0a7657}.destination-preview__section--soft{padding:22px;margin-top:33px;border:0;border-radius:14px;background:#f0f7f3}.destination-preview__tags{display:flex;flex-wrap:wrap;gap:7px}.destination-preview__tags b{padding:8px 10px;border-radius:8px;background:#fff;color:#315e4c;font-size:11px}.destination-preview__gallery{display:grid;grid-template-columns:1.3fr 1fr;gap:10px;margin-top:33px}.destination-preview__gallery figure{height:184px;margin:0;overflow:hidden;border-radius:12px;background:#e8eeea}.destination-preview__gallery figure:first-child{grid-row:span 2;height:378px}.destination-preview__gallery img{width:100%;height:100%;object-fit:cover}.destination-preview aside{align-self:start;padding:24px;border:1px solid #dce7e0;border-radius:16px;background:#f5f8f6}.destination-preview aside h3{margin:13px 0 9px;font-size:25px;letter-spacing:-.05em;line-height:1.04}.destination-preview aside p{margin:0;color:#65736b;font-size:13px;line-height:1.62}.destination-preview aside button{width:100%;margin-top:20px;padding:13px;border:0;border-radius:10px;background:#113e32;color:#fff;font-size:13px;font-weight:800}@media(max-width:780px){.destination-preview__body{grid-template-columns:1fr;gap:31px;padding-top:38px}.destination-preview__facts{grid-template-columns:1fr}.destination-preview__hero{min-height:330px}}@media(max-width:520px){.destination-preview__hero h1{font-size:43px}.destination-preview__gallery{grid-template-columns:1fr}.destination-preview__gallery figure,.destination-preview__gallery figure:first-child{height:205px}}
</style>
