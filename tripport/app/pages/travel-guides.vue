<script setup lang="ts">
import type { TravelGuide } from '~/data/travelGuides'
import { travelGuides } from '~/data/travelGuides'

useSeoMeta({
  title: 'Kerala Travel Guides',
  description: 'Useful Kerala travel planning resources for inspired, well-paced journeys.',
})

const selectedGuide = ref<TravelGuide | null>(null)
const route = useRoute()
const isGuideDetail = computed(() => typeof route.params.slug === 'string')

function openQuickLook(guide: TravelGuide) {
  selectedGuide.value = guide
}

function closeQuickLook() {
  selectedGuide.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeQuickLook()
}

watch(selectedGuide, (guide) => {
  document.body.style.overflow = guide ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <NuxtPage v-if="isGuideDetail" />
  <div v-else>
    <section class="inner-hero">
      <div class="page-shell inner-hero__content">
        <span class="eyebrow">Travel well</span>
        <h1>Kerala travel guides.</h1>
        <p>Clear, useful planning information to help you make the most of a Kerala journey.</p>
      </div>
    </section>

    <section class="section page-shell">
      <div class="section-heading guide-heading">
        <div><span class="eyebrow">Plan with confidence</span><h2>Thoughtful notes for better Kerala journeys.</h2></div>
        <p>Get a quick overview, or open the full guide when you are ready to go deeper.</p>
      </div>

      <div class="guide-page-grid">
        <article v-for="guide in travelGuides" :key="guide.slug" class="guide-page-card">
          <NuxtLink class="guide-page-card__image" :to="`/travel-guides/${guide.slug}`" :aria-label="`Read ${guide.title}`"><img :src="`/images/${guide.image}`" :alt="guide.title"></NuxtLink>
          <div class="guide-page-card__body">
            <div class="guide-page-card__meta"><span>{{ guide.category }}</span><small>{{ guide.readTime }}</small></div>
            <h2><NuxtLink :to="`/travel-guides/${guide.slug}`">{{ guide.title }}</NuxtLink></h2>
            <p>{{ guide.summary }}</p>
            <div class="guide-page-card__actions"><NuxtLink :to="`/travel-guides/${guide.slug}`">Read guide <MaterialIcon name="arrow_forward" :size="17" /></NuxtLink><button type="button" @click="openQuickLook(guide)">Quick look <MaterialIcon name="north_east" :size="16" /></button></div>
          </div>
        </article>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="selectedGuide" class="guide-modal-backdrop" role="presentation" @mousedown.self="closeQuickLook">
        <section class="guide-modal" role="dialog" aria-modal="true" aria-labelledby="quick-look-title">
          <button class="guide-modal__close" type="button" aria-label="Close quick look" @click="closeQuickLook"><MaterialIcon name="close" :size="22" /></button>
          <img :src="`/images/${selectedGuide.image}`" :alt="selectedGuide.title">
          <div class="guide-modal__body">
            <div class="guide-modal__meta"><span>{{ selectedGuide.category }}</span><small>{{ selectedGuide.readTime }}</small></div>
            <h2 id="quick-look-title">{{ selectedGuide.title }}</h2>
            <p class="guide-modal__intro">{{ selectedGuide.intro }}</p>
            <dl class="quick-facts"><div v-for="fact in selectedGuide.quickLook" :key="fact.label"><dt>{{ fact.label }}</dt><dd>{{ fact.value }}</dd></div></dl>
            <div class="quick-takeaways"><span>Quick takeaways</span><ul><li v-for="takeaway in selectedGuide.takeaways" :key="takeaway"><MaterialIcon name="check" :size="16" />{{ takeaway }}</li></ul></div>
            <NuxtLink class="button button--dark" :to="`/travel-guides/${selectedGuide.slug}`" @click="closeQuickLook">Read the full guide <MaterialIcon name="arrow_forward" :size="17" /></NuxtLink>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.guide-heading{margin-bottom:38px}.guide-page-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.guide-page-card{display:flex;min-height:100%;flex-direction:column;overflow:hidden;border:1px solid #e1e7e3;border-radius:19px;background:#fff}.guide-page-card__image{display:block;overflow:hidden}.guide-page-card img{height:225px;object-fit:cover;transition:transform .3s ease}.guide-page-card:hover img{transform:scale(1.03)}.guide-page-card__body{display:flex;flex:1;flex-direction:column;padding:22px}.guide-page-card__meta,.guide-modal__meta{display:flex;justify-content:space-between;gap:12px;align-items:center}.guide-page-card__meta span,.guide-modal__meta span{color:#0f7355;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.guide-page-card__meta small,.guide-modal__meta small{color:#839087;font-size:12px;font-weight:700}.guide-page-card h2{margin:12px 0 11px;font-size:25px;line-height:1.1;letter-spacing:-.045em}.guide-page-card h2 a:hover{color:#0e7355}.guide-page-card p{margin:0;color:#66736c;font-size:15px;line-height:1.6}.guide-page-card__actions{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:auto;padding-top:22px}.guide-page-card__actions a,.guide-page-card__actions button{display:inline-flex;align-items:center;gap:4px;border:0;background:transparent;color:#0f7355;font-size:14px;font-weight:850;text-decoration:none}.guide-page-card__actions button{padding:8px 10px;border-radius:8px;background:#edf5f0;color:#1f5945}.guide-page-card__actions button:hover{background:#dceee4}.guide-modal-backdrop{position:fixed;inset:0;z-index:1000;display:grid;place-items:center;padding:24px;background:rgb(8 33 26 / 62%);backdrop-filter:blur(7px)}.guide-modal{position:relative;display:grid;width:min(860px,100%);max-height:calc(100vh - 48px);grid-template-columns:.9fr 1.1fr;overflow:auto;border-radius:24px;background:#fff;box-shadow:0 30px 90px rgb(2 30 20 / 35%)}.guide-modal>img{width:100%;height:100%;min-height:540px;object-fit:cover}.guide-modal__body{padding:42px}.guide-modal__close{position:absolute;top:15px;right:15px;z-index:2;display:grid;width:39px;height:39px;place-items:center;border:0;border-radius:50%;background:rgb(255 255 255 / 93%);color:#17372f}.guide-modal h2{margin:15px 0 13px;font-size:clamp(30px,3.4vw,44px);letter-spacing:-.06em;line-height:1.02}.guide-modal__intro{margin:0;color:#5e6d65;font-size:16px;line-height:1.65}.quick-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:28px 0 25px}.quick-facts div{padding:12px 10px;border-radius:10px;background:#f1f6f3}.quick-facts dt,.quick-takeaways>span{color:#6e7b74;font-size:10px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.quick-facts dd{margin:7px 0 0;color:#1a4435;font-size:13px;font-weight:800;line-height:1.35}.quick-takeaways{padding-top:22px;border-top:1px solid #e4ebe6}.quick-takeaways ul{display:grid;gap:10px;padding:0;margin:11px 0 28px;list-style:none}.quick-takeaways li{display:flex;gap:8px;align-items:flex-start;color:#516158;font-size:13px;line-height:1.5}.quick-takeaways .material-icon{margin-top:2px;color:#0a7a57}@media(max-width:850px){.guide-page-grid{grid-template-columns:1fr 1fr}.guide-modal{grid-template-columns:1fr}.guide-modal>img{display:none}.guide-modal__body{padding:36px}}@media(max-width:560px){.guide-page-grid{grid-template-columns:1fr}.guide-modal-backdrop{padding:12px}.guide-modal{max-height:calc(100vh - 24px);border-radius:19px}.guide-modal__body{padding:32px 22px}.quick-facts{grid-template-columns:1fr}.guide-page-card h2{font-size:24px}}
</style>
