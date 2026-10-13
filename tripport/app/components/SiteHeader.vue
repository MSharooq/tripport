<script setup lang="ts">
import { getWhatsAppLink } from '~/data/contact'

const route = useRoute()
const mobileOpen = ref(false)
const { openEnquiry } = useEnquiry()

const isHome = computed(() => route.path === '/')
const whatsappLink = getWhatsAppLink('Hello Tripport, I would like to know more about your Kerala itineraries.')
const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Itineraries', to: '/itineraries' },
  { label: 'Travel Guides', to: '/travel-guides' },
  { label: 'Plan your trip', to: '/plan-your-trip' },
  { label: 'About', to: '/about' },
]

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header class="site-header" :class="{ 'site-header--home': isHome, 'site-header--mobile-open': mobileOpen }">
    <div class="site-header__inner page-shell">
      <NuxtLink class="brand" to="/" aria-label="Tripport by Lavanya home" @click="closeMobile">
        <span class="brand__mark"><img src="/images/tripport_logo.svg" alt=""></span>
        <span class="brand__wordmark">
          <span class="brand__name">Tripport</span>
          <span class="brand__endorsement"><span class="brand__by">by</span><img class="brand__lavanya" src="/images/lavanya-wordmark.svg" alt="Lavanya" width="79" height="24"></span>
        </span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
      </nav>

      <div class="header-actions">
        <a class="header-whatsapp" :href="whatsappLink" target="_blank" rel="noopener">WhatsApp</a>
        <button class="button button--forest header-cta" type="button" @click="openEnquiry()">Enquire now</button>
        <button class="mobile-toggle" :class="{ 'mobile-toggle--open': mobileOpen }" type="button" :aria-expanded="mobileOpen" aria-controls="mobile-navigation" :aria-label="mobileOpen ? 'Close navigation' : 'Open navigation'" @click="mobileOpen = !mobileOpen">
          <MaterialIcon :name="mobileOpen ? 'close' : 'menu'" :size="24" />
        </button>
      </div>
    </div>

    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="mobile-menu">
        <nav id="mobile-navigation" class="mobile-nav page-shell" aria-label="Mobile navigation">
          <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" @click="closeMobile"><span>{{ item.label }}</span><MaterialIcon name="arrow_forward" :size="18" /></NuxtLink>
          <div class="mobile-nav__footer">
            <a :href="whatsappLink" target="_blank" rel="noopener">WhatsApp us</a>
            <button class="button button--forest" type="button" @click="openEnquiry(); closeMobile()">Start an enquiry <MaterialIcon name="arrow_forward" :size="18" /></button>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.site-header__inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
}

.brand {
  justify-self: start;
  flex-shrink: 0;
}

.site-header--home .brand__lavanya {
  filter: brightness(0) invert(1);
}

.desktop-nav {
  position: static;
  transform: none;
  margin-inline: 0;
}

.header-actions {
  justify-self: end;
  flex-shrink: 0;
  margin-left: 0;
}

.mobile-toggle {
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid rgb(17 62 50 / 16%);
  border-radius: 50%;
  background: rgb(255 255 255 / 94%);
  color: var(--forest);
  box-shadow: 0 5px 16px rgb(12 46 37 / 8%);
  transition: background .2s ease, color .2s ease, transform .2s ease;
}

.mobile-toggle:hover {
  transform: scale(1.03);
}

.mobile-toggle--open {
  background: var(--forest);
  color: #fff;
}

.mobile-menu {
  position: absolute;
  top: 100%;
  right: 0;
  left: 0;
  padding: 10px 0 24px;
  border-bottom: 1px solid #e5ebe7;
  background: rgb(255 255 255 / 98%);
  box-shadow: 0 18px 38px rgb(14 45 36 / 12%);
  backdrop-filter: blur(14px);
}

.mobile-nav__footer {
  display: grid;
  gap: 12px;
  margin-top: 16px;
  padding-top: 18px;
  border-top: 1px solid #e8eeea;
}

.mobile-nav__footer > a {
  color: var(--green);
  font-size: 14px;
  font-weight: 800;
  text-align: center;
}

.mobile-nav__footer .button {
  width: 100%;
  gap: 7px;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity .2s ease, transform .2s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (min-width: 1051px) {
  .mobile-menu {
    display: none;
  }
}

@media (min-width: 1051px) and (max-width: 1240px) {
  .site-header__inner {
    gap: 16px;
  }

  .desktop-nav a {
    padding-inline: 10px;
    font-size: 13px;
  }

  .header-whatsapp {
    display: none;
  }
}

@media (max-width: 1050px) {
  .site-header__inner {
    display: flex;
  }

  .header-actions {
    margin-left: auto;
  }

  .site-header--home.site-header--mobile-open {
    border-bottom: 1px solid #e5ebe7;
    background: #fff;
    color: #111;
  }

  .site-header--home.site-header--mobile-open .brand__lavanya {
    filter: none;
  }
}

@media (max-width: 720px) {
  .mobile-menu {
    padding-bottom: 20px;
  }

  .mobile-nav__footer {
    margin-top: 12px;
  }
}

</style>
