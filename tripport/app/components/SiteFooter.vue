<script setup lang="ts">
import { getWhatsAppLink, tripportContact } from '~/data/contact'

const whatsappLink = getWhatsAppLink('Hello Tripport, I would like help planning a journey.')
</script>

<template>
  <footer class="site-footer">
    <div class="page-shell site-footer__grid">
      <div>
        <NuxtLink class="brand brand--footer" to="/">
          <span class="brand__mark"><img src="/images/tripport_logo.svg" alt=""></span><span>Tripport</span>
        </NuxtLink>
        <p>Thoughtfully planned Kerala journeys, made for memorable travel.</p>
        <span class="footer-location">Kochi, Kerala · India</span>
      </div>
      <div class="footer-links"><span>Explore</span><NuxtLink to="/destinations">Destinations</NuxtLink><NuxtLink to="/itineraries">Itineraries</NuxtLink><NuxtLink to="/travel-guides">Travel guides</NuxtLink></div>
      <div class="footer-links"><span>Tripport</span><NuxtLink to="/plan-your-trip">Plan your trip</NuxtLink><NuxtLink to="/about">About us</NuxtLink><NuxtLink to="/contact">Contact</NuxtLink></div>
      <div class="footer-links"><span>Get in touch</span><a :href="`mailto:${tripportContact.email}`">{{ tripportContact.email }}</a><a :href="tripportContact.phoneHref">{{ tripportContact.phoneDisplay }}</a><a :href="whatsappLink" target="_blank" rel="noopener">WhatsApp enquiry</a></div>
    </div>
    <div class="page-shell site-footer__bottom"><span>© {{ new Date().getFullYear() }} Tripport. All rights reserved.</span><span>Built for Kerala travel planning.</span></div>
  </footer>
</template>
