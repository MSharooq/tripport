<script setup lang="ts">
import { getWhatsAppLink, tripportContact } from '~/data/contact'

useSeoMeta({ title: 'Contact Tripport', description: 'Start a Kerala itinerary enquiry with Tripport.' })
const { openEnquiry } = useEnquiry()
const whatsappLink = getWhatsAppLink('Hello Tripport, I would like help planning a journey.')
</script>

<template><div><section class="inner-hero"><div class="page-shell inner-hero__content"><span class="eyebrow">Contact Tripport</span><h1>Let’s start with the journey.</h1><p>Tell us where you would like to go, when you would like to travel and who is coming along. We’ll take it from there.</p></div></section><section class="section page-shell contact-grid"><div><span class="eyebrow">Start an enquiry</span><h2>Planning a Kerala escape?</h2><p>Use the enquiry form and we’ll have the essential details to start the right conversation.</p><button class="button button--dark" type="button" @click="openEnquiry()">Open enquiry form</button></div><div class="contact-card"><span>Based in</span><b>{{ tripportContact.location }}</b><span>Email</span><a :href="`mailto:${tripportContact.email}`">{{ tripportContact.email }}</a><span>Phone</span><a :href="tripportContact.phoneHref">{{ tripportContact.phoneDisplay }}</a><span>WhatsApp</span><a :href="whatsappLink" target="_blank" rel="noopener">Start a WhatsApp enquiry <MaterialIcon name="arrow_forward" :size="18" /></a></div></section></div></template>

<style scoped>.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:70px}.contact-grid h2{margin:12px 0;font-size:clamp(40px,4.6vw,67px);letter-spacing:-.065em;line-height:.98}.contact-grid p{max-width:460px;color:#666;font-size:17px;line-height:1.65}.contact-card{display:grid;gap:7px;align-content:start;padding:32px;border-radius:21px;background:#f3f5f3}.contact-card span{margin-top:14px;color:#737373;font-size:12px;text-transform:uppercase;letter-spacing:.09em}.contact-card span:first-child{margin-top:0}.contact-card b,.contact-card a{font-size:20px;letter-spacing:-.03em}.contact-card a{color:#0f7355}@media(max-width:700px){.contact-grid{grid-template-columns:1fr;gap:35px}}</style>
