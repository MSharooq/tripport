<script setup lang="ts">
import type { Testimonial } from '~/data/testimonials'

defineProps<{
  testimonial: Testimonial
}>()

defineEmits<{ close: [] }>()
</script>

<template>
  <AdminPreviewFrame label="Testimonial preview" @close="$emit('close')">
    <article class="testimonial-preview">
      <header class="testimonial-preview__hero">
        <span>Traveller stories</span>
        <h1>What travellers are saying.</h1>
        <p>Only genuine reviews added through Tripport Manager are shown on the website.</p>
      </header>

      <section class="testimonial-preview__content">
        <div class="testimonial-preview__context">
          <span>On the website</span>
          <h2>{{ testimonial.featured ? 'A featured traveller story' : 'A traveller story' }}</h2>
          <p v-if="testimonial.itinerarySlug">Linked to the <strong>{{ testimonial.itinerarySlug }}</strong> itinerary.</p>
          <p v-else>Not linked to a specific itinerary.</p>
        </div>
        <TestimonialCard :testimonial="testimonial" preview />
      </section>
    </article>
  </AdminPreviewFrame>
</template>

<style scoped>
.testimonial-preview{min-height:100%;color:#17362b;background:#f7faf8}.testimonial-preview__hero{padding:68px clamp(24px,7vw,92px) 58px;background:linear-gradient(135deg,#143f32,#2c7256);color:#fff}.testimonial-preview__hero span,.testimonial-preview__context>span{display:block;font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.testimonial-preview__hero span{color:#b7d9ca}.testimonial-preview__hero h1{max-width:670px;margin:14px 0 11px;font-size:clamp(42px,5.2vw,70px);letter-spacing:-.08em;line-height:.94}.testimonial-preview__hero p{max-width:570px;margin:0;color:rgb(255 255 255 / 82%);font-size:16px;line-height:1.65}.testimonial-preview__content{display:grid;grid-template-columns:minmax(0,.78fr) minmax(320px,1.22fr);gap:44px;align-items:center;padding:62px clamp(24px,7vw,92px)}.testimonial-preview__context{padding:6px 0}.testimonial-preview__context>span{color:#177653}.testimonial-preview__context h2{max-width:330px;margin:14px 0 10px;color:#173b2e;font-size:clamp(29px,3.4vw,44px);letter-spacing:-.07em;line-height:.98}.testimonial-preview__context p{max-width:330px;margin:0;color:#66776e;font-size:14px;line-height:1.65}.testimonial-preview__context strong{color:#285e48;font-weight:800}@media(max-width:720px){.testimonial-preview__hero{padding-top:48px}.testimonial-preview__content{grid-template-columns:1fr;gap:28px;padding-top:38px;padding-bottom:48px}}
</style>
