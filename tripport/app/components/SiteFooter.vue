<template>
  <footer class="site-footer">
    <div class="page-shell site-footer__grid">
      <div>
        <NuxtLink class="brand brand--footer" to="/">
          <span class="brand__mark">T</span><span>Tripport</span>
        </NuxtLink>
        <p>Thoughtfully planned Kerala journeys, made for memorable travel.</p>
        <span class="footer-location">Kochi, Kerala · India</span>
      </div>
      <div class="footer-links"><span>Explore</span><NuxtLink to="/destinations">Destinations</NuxtLink><NuxtLink to="/itineraries">Itineraries</NuxtLink><NuxtLink to="/travel-guides">Travel guides</NuxtLink></div>
      <div class="footer-links"><span>Tripport</span><NuxtLink to="/plan-your-trip">Plan your trip</NuxtLink><NuxtLink to="/about">About us</NuxtLink><NuxtLink to="/contact">Contact</NuxtLink></div>
      <div class="footer-links"><span>Get in touch</span><a href="mailto:hello@tripport.in">hello@tripport.in</a><a href="tel:+910000000000">+91 00000 00000</a><a href="https://wa.me/910000000000" target="_blank" rel="noopener">WhatsApp enquiry</a></div>
    </div>
    <div class="page-shell site-footer__bottom"><span>© {{ new Date().getFullYear() }} Tripport. All rights reserved.</span><span>Built for Kerala travel planning.</span></div>
  </footer>
</template>
