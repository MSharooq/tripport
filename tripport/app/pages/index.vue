<script setup lang="ts">
import { itineraries, packageTypeLabel, type PackageType } from '~/data/itineraries'
import { destinations, type Destination } from '~/data/destinations'
import { testimonials, type Testimonial } from '~/data/testimonials'
import type { TripPackage } from '~/data/packages/types'
import { getWhatsAppLink } from '~/data/contact'

useSeoMeta({
  title: 'Thoughtful Kerala Journeys',
  description: 'Discover flexible Kerala itineraries and local travel inspiration from a Kochi-based team with more than fifteen years of experience.',
})

const { openEnquiry } = useEnquiry()
const { data: managedPackages } = await useFetch<TripPackage[]>('/api/content/packages', {
  default: () => itineraries,
})
const { data: managedDestinations } = await useFetch<Destination[]>('/api/content/destinations', {
  default: () => destinations,
})
const { data: managedTestimonials } = await useFetch<Testimonial[]>('/api/content/testimonials', {
  default: () => testimonials,
})
const selectedPackageType = ref<'All' | PackageType>('All')
const quickItinerary = ref('')
const quickEnquiryType = ref<'package' | 'planning'>('package')
const quickTravelMonth = ref('')
const quickTravellers = ref(2)
const homeWhatsAppLink = getWhatsAppLink('Hello Tripport, I need help with a Kerala itinerary.')
const packageTypeFilters = computed(() => ['All', ...new Set((managedPackages.value ?? itineraries).filter(item => item.status === 'published').map(item => item.packageType))] as Array<'All' | PackageType>)
const publishedItineraries = computed(() => (managedPackages.value ?? itineraries).filter((item) => item.status === 'published'))
const visibleItineraries = computed(() => selectedPackageType.value === 'All'
  ? publishedItineraries.value.slice(0, 6)
  : publishedItineraries.value.filter((item) => item.packageType === selectedPackageType.value).slice(0, 6))
const visibleDestinations = computed(() => (managedDestinations.value ?? destinations).filter(item => item.status === 'published').slice(0, 8))
const publishedTestimonials = computed(() => (managedTestimonials.value ?? testimonials).filter(item => item.status === 'published'))
const carouselTestimonials = computed(() => [...publishedTestimonials.value]
  .sort((first, second) => Number(second.featured) - Number(first.featured) || first.sortOrder - second.sortOrder)
  .slice(0, 9))

function openQuickEnquiry() {
  const itinerary = publishedItineraries.value.find((item) => item.slug === quickItinerary.value)
  openEnquiry({
    itineraryTitle: itinerary?.title,
    enquiryType: quickEnquiryType.value,
    travelMonth: quickTravelMonth.value,
    travellers: quickTravellers.value,
  })
}
</script>

<template>
  <div>
    <section class="home-hero">
      <div class="home-hero__scrim" />
      <div class="page-shell home-hero__content">
        <div class="home-hero__copy">
          <span class="hero-chip">Kerala · Kochi</span>
          <h1>Discover Kerala,<br>your way.</h1>
          <p>Thoughtfully planned journeys, flexible itineraries and local Kerala knowledge—made for days that feel effortless and memorable.</p>
          <div class="home-hero__trust"><strong>15+ years</strong><span>of travel experience behind every route</span></div>
        </div>

        <aside class="quick-enquiry" aria-label="Quick itinerary enquiry">
          <div class="quick-enquiry__heading"><span class="eyebrow">Plan with Tripport</span><h2>{{ quickEnquiryType === 'package' ? 'Find the right Kerala route' : 'Start planning your journey' }}</h2></div>
          <div class="quick-tabs" aria-label="Enquiry type">
            <button class="quick-tabs__button" :class="{ 'quick-tabs__button--active': quickEnquiryType === 'package' }" type="button" :aria-pressed="quickEnquiryType === 'package'" @click="quickEnquiryType = 'package'">Package enquiry</button>
            <button class="quick-tabs__button" :class="{ 'quick-tabs__button--active': quickEnquiryType === 'planning' }" type="button" :aria-pressed="quickEnquiryType === 'planning'" @click="quickEnquiryType = 'planning'">Trip planning</button>
          </div>
          <label class="quick-field">
            <span>{{ quickEnquiryType === 'package' ? 'Itinerary' : 'Route (optional)' }}</span>
            <span class="quick-select"><select v-model="quickItinerary" aria-label="Itinerary"><option value="">{{ quickEnquiryType === 'package' ? 'Choose a Kerala route' : 'Choose a route to begin with' }}</option><option v-for="item in publishedItineraries" :key="item.slug" :value="item.slug">{{ item.title }}</option></select><MaterialIcon name="expand_more" :size="18" /></span>
          </label>
          <div class="quick-field-row"><label class="quick-field"><span>Travel month</span><input v-model="quickTravelMonth" type="month" aria-label="Travel month"></label><label class="quick-field"><span>Travellers</span><span class="quick-select"><select v-model.number="quickTravellers" aria-label="Travellers"><option :value="2">2 guests</option><option :value="4">4 guests</option><option :value="6">6 guests</option><option :value="8">Group of 8+</option></select><MaterialIcon name="expand_more" :size="18" /></span></label></div>
          <button class="button button--dark quick-enquiry__button" type="button" @click="openQuickEnquiry">{{ quickEnquiryType === 'package' ? 'Start an enquiry' : 'Plan my journey' }} <MaterialIcon name="arrow_forward" :size="18" /></button>
          <p>Prefer to chat? <a :href="homeWhatsAppLink" target="_blank" rel="noopener">WhatsApp us</a></p>
        </aside>
      </div>
    </section>

    <section class="intro-section page-shell">
      <span class="section-chip">Who we are</span>
      <h2>We’re a Kochi-based team creating <strong>well-paced Kerala journeys.</strong> From the first idea to the final day, <strong>we make each trip feel clear, personal, and easy to enjoy.</strong></h2>
      <div class="intro-section__thumbs"><img src="/images/munnar.jpg" alt="Munnar tea plantations"><img src="/images/hero.jpg" alt="Kerala backwater houseboat"><img src="/images/thekkady.jpg" alt="Thekkady forest"></div>
      <div class="achievement-rule"><span class="section-chip">Our foundation</span></div>
      <div class="achievement-grid">
        <div class="achievement"><strong>15+</strong><span>years in travel</span></div><div class="achievement achievement--muted"><strong>1000+</strong><span>Happy Customers</span></div><div class="achievement"><strong>Kochi</strong><span>our Kerala base</span></div><div class="achievement achievement--muted"><strong>Kerala</strong><span>our first love</span></div>
      </div>
    </section>

    <section id="itineraries" class="section page-shell">
      <div class="section-heading"><div><span class="eyebrow">Explore by journey</span><h2>Popular Kerala itineraries</h2></div><p>Choose a route that speaks to you, then send a short enquiry to start planning.</p></div>
      <div class="filter-row" aria-label="Filter itinerary types"><button v-for="packageType in packageTypeFilters" :key="packageType" class="filter-button" :class="{ 'filter-button--active': selectedPackageType === packageType }" type="button" @click="selectedPackageType = packageType">{{ packageType === 'All' ? 'All itineraries' : packageTypeLabel(packageType) }}</button></div>
      <div class="itinerary-grid"><ItineraryCard v-for="item in visibleItineraries" :key="item.slug" :itinerary="item" /></div>
      <div class="center-action"><NuxtLink class="button button--outline" to="/itineraries">View all itineraries <MaterialIcon name="arrow_forward" :size="18" /></NuxtLink></div>
    </section>

    <section id="destinations" class="section section--dark">
      <div class="page-shell">
        <div class="section-heading section-heading--dark"><div><span class="eyebrow eyebrow--light">Across Kerala</span><h2>Places that make the itinerary.</h2></div><p>From misty tea country to the coast, explore the stops that define a Kerala journey.</p></div>
        <div class="destination-grid"><DestinationCard v-for="destination in visibleDestinations" :key="destination.slug" :destination="destination" /></div>
        <div class="center-action"><NuxtLink class="button button--light" to="/destinations">Explore all destinations <MaterialIcon name="arrow_forward" :size="18" /></NuxtLink></div>
      </div>
    </section>

    <section class="section page-shell why-section">
      <div class="why-section__copy"><span class="section-chip">Why Tripport</span><h2>Local insight,<br>thoughtfully shared.</h2><p>A great Kerala trip is more than a list of places. It needs a sensible rhythm, meaningful experiences and people who know the destination well.</p><div class="why-list"><div><b>Itinerary-first</b><span>Every journey is easy to explore and understand.</span></div><div><b>Travel at your pace</b><span>We focus on useful details and clear routes, without public price distractions.</span></div><div><b>Based in Kochi</b><span>Kerala knowledge grounded in more than fifteen years of travel experience.</span></div></div><button class="button button--dark" type="button" @click="openEnquiry()">Start an enquiry</button></div>
      <div class="why-section__image"><img src="/images/varkala.jpg" alt="Varkala coast in Kerala"><div class="route-note"><span>Kerala route coverage</span><strong>10 launch destinations</strong><div class="route-note__bar"><i /></div><small>Ready to expand as Tripport grows</small></div></div>
    </section>

    <section class="section section--soft">
      <div class="page-shell guide-grid">
        <div class="guide-feature"><span class="eyebrow">Travel guides</span><h2>Useful Kerala knowledge for better journeys.</h2><p>Evergreen guides to help you choose the right season, route and pace for your time in Kerala.</p><NuxtLink class="text-link" to="/travel-guides">Browse travel guides <MaterialIcon name="arrow_forward" :size="17" /></NuxtLink></div>
        <NuxtLink class="guide-card guide-card--image" to="/travel-guides/best-time-to-visit-kerala"><img src="/images/munnar-wide.jpg" alt="Munnar green hills"><span>When to go</span><strong>Best time to visit Kerala</strong></NuxtLink>
        <NuxtLink class="guide-card" to="/travel-guides/kerala-route-guide"><span>Route planning</span><strong>How many days are enough for Kerala?</strong><i>Read guide <MaterialIcon name="arrow_forward" :size="16" /></i></NuxtLink>
      </div>
    </section>

    <section class="section page-shell partner-section">
      <span class="section-chip">The Tripport way</span>
      <h2>Made for the journey, not just the checklist.</h2>
      <p>We believe the most memorable Kerala trips leave room to slow down, take in the landscape and enjoy the small details along the way.</p>
      <div class="partner-section__items"><div><strong>Thoughtful route information</strong><span>Clear duration, flow and highlights so you can picture the journey.</span></div><div><strong>Flexible starting points</strong><span>Itineraries ready to adapt around your travel style and interests.</span></div><div><strong>Grounded local knowledge</strong><span>A Kochi-based team focused on Kerala from day one.</span></div></div>
    </section>

    <section id="traveller-stories" class="section section--soft testimonial-section">
      <div class="page-shell">
        <div class="testimonial-section__heading">
          <div><span class="eyebrow">Traveller stories</span><h2>Journeys remembered for the right reasons.</h2></div>
          <div><p>Genuine feedback from people who have travelled with Tripport.</p><NuxtLink class="button button--outline testimonial-section__share" to="/share-your-story">Share your story <MaterialIcon name="arrow_forward" :size="18" /></NuxtLink></div>
        </div>
        <TestimonialCarousel v-if="carouselTestimonials.length" :testimonials="carouselTestimonials" />
        <div v-else class="testimonial-section__empty"><MaterialIcon name="star" :size="24" /><div><strong>The first Tripport stories are on their way.</strong><p>Have travelled with us? Your experience can help someone else plan their Kerala journey.</p></div><NuxtLink class="text-link" to="/share-your-story">Share your story <MaterialIcon name="arrow_forward" :size="17" /></NuxtLink></div>
      </div>
    </section>

    <section class="home-cta">
      <img src="/images/hero.jpg" alt="Kerala backwaters"><div class="home-cta__shade" /><div class="page-shell home-cta__content"><span class="hero-chip">Ready when you are</span><h2>Build a Kerala journey<br>your travellers will remember.</h2><button class="button button--light" type="button" @click="openEnquiry()">Start an enquiry <MaterialIcon name="arrow_forward" :size="18" /></button></div>
    </section>
  </div>
</template>

<style scoped>
.home-hero{position:relative;min-height:760px;color:#fff;background:url('/images/hero.jpg') center 52%/cover no-repeat;overflow:hidden}.home-hero__scrim{position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,20,15,.7),rgba(4,20,15,.2) 55%,rgba(4,20,15,.1))}.home-hero__content{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) 430px;gap:54px;align-items:end;min-height:760px;padding:185px 0 66px}.home-hero__copy{max-width:625px}.hero-chip,.section-chip{display:inline-flex;align-items:center;gap:7px;padding:8px 12px;border-radius:999px;background:#fff;color:#111;font-size:11px;font-weight:700}.hero-chip::before,.section-chip::before{content:"";width:5px;height:5px;background:currentColor;border-radius:50%}.home-hero h1{margin:18px 0 18px;font-size:clamp(54px,5vw,76px);line-height:.98;letter-spacing:-.07em}.home-hero__copy>p{max-width:575px;margin:0;color:rgba(255,255,255,.86);font-size:15px;line-height:1.62}.home-hero__trust{display:flex;align-items:center;gap:10px;margin-top:30px;font-size:12px;color:rgba(255,255,255,.75)}.home-hero__trust strong{font-size:25px;letter-spacing:-.05em;color:#fff}.quick-enquiry{padding:25px;background:#fff;color:#111;border-radius:25px;box-shadow:0 22px 60px rgba(0,0,0,.25)}.quick-enquiry__heading h2{margin:7px 0 17px;font-size:22px;letter-spacing:-.04em}.quick-tabs{display:grid;grid-template-columns:1fr 1fr;padding:4px;background:#f3f3f3;border-radius:999px;margin-bottom:13px}.quick-tabs span{padding:10px;text-align:center;border-radius:999px;font-size:11px}.quick-tabs__active{background:#fff;box-shadow:0 2px 9px rgba(0,0,0,.1);font-weight:700}.quick-field{display:grid;gap:5px;padding:10px 12px;border:1px solid #e6e6e6;border-radius:13px;background:#fff}.quick-field>span{font-size:9px;color:#747474;text-transform:uppercase;letter-spacing:.06em}.quick-field select,.quick-field input{min-width:0;border:0;background:transparent;color:#171717;outline:0;font-size:12px;font-weight:650}.quick-field-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:9px}.quick-enquiry>.quick-field{margin-top:9px}.quick-enquiry__button{width:100%;margin-top:12px}.quick-enquiry>p{margin:13px 0 0;color:#777;font-size:11px;text-align:center}.quick-enquiry a{color:var(--green);font-weight:750}.intro-section{padding:90px 0 86px;text-align:center}.intro-section h2{max-width:1200px;margin:26px auto 0;color:#898989;font-size:clamp(29px,3.6vw,51px);font-weight:430;line-height:1.18;letter-spacing:-.05em}.intro-section h2 strong{color:#101010;font-weight:650}.intro-section__thumbs{display:flex;justify-content:center;gap:10px;margin:30px 0 0}.intro-section__thumbs img{width:145px;height:76px;object-fit:cover;border-radius:13px}.achievement-rule{position:relative;margin-top:66px;border-top:1px solid #dedede}.achievement-rule .section-chip{position:absolute;top:0;left:50%;transform:translate(-50%,-50%);padding:6px 10px;font-size:9px}.achievement-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:28px}.achievement{display:grid;min-height:150px;place-items:center;align-content:center;border-radius:16px;background:#fafafa}.achievement strong{font-size:38px;letter-spacing:-.06em}.achievement span{margin-top:9px;color:#838383;font-size:11px}.achievement--muted strong{color:#c8c8c8}.center-action{display:flex;justify-content:center;margin-top:38px}.section--dark{background:var(--forest);color:#fff}.section-heading--dark p{color:rgba(255,255,255,.68)}.why-section{display:grid;grid-template-columns:.88fr 1.12fr;gap:80px;align-items:center}.why-section h2{margin:20px 0;font-size:clamp(42px,4.5vw,67px);line-height:.98;letter-spacing:-.065em}.why-section__copy>p{max-width:480px;color:#666;font-size:14px;line-height:1.68}.why-list{display:grid;gap:9px;margin:30px 0}.why-list>div{padding:16px;border:1px solid #e7e7e7;border-radius:13px}.why-list b{display:block;font-size:14px}.why-list span{display:block;margin-top:6px;color:#727272;font-size:12px;line-height:1.5}.why-section__image{position:relative;height:570px;overflow:hidden;border-radius:23px}.why-section__image>img{height:100%;object-fit:cover}.route-note{position:absolute;right:30px;bottom:30px;width:290px;padding:20px;background:#fff;color:#111;border-radius:18px;box-shadow:0 18px 48px rgba(0,0,0,.2)}.route-note span,.route-note small{display:block;color:#737373;font-size:11px}.route-note strong{display:block;margin:6px 0 14px;font-size:23px;letter-spacing:-.04em}.route-note__bar{height:7px;overflow:hidden;background:#ededed;border-radius:999px}.route-note__bar i{display:block;width:72%;height:100%;border-radius:inherit;background:#111}.route-note small{margin-top:11px}.guide-grid{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:18px}.guide-feature{padding:26px 8px}.guide-feature h2{margin:11px 0;font-size:clamp(34px,3.6vw,51px);line-height:1.02;letter-spacing:-.05em}.guide-feature p{max-width:350px;color:#666;font-size:14px;line-height:1.6}.guide-card{position:relative;display:flex;min-height:320px;flex-direction:column;justify-content:end;padding:24px;overflow:hidden;border:1px solid #e3e3e3;border-radius:20px;background:#fff}.guide-card>span{color:#787878;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.guide-card strong{margin-top:10px;max-width:280px;font-size:25px;line-height:1.08;letter-spacing:-.04em}.guide-card i{margin-top:25px;color:var(--green);font-size:12px;font-style:normal;font-weight:800}.guide-card--image{color:#fff;border:0}.guide-card--image:before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(0,0,0,.62),rgba(0,0,0,.03))}.guide-card--image img{position:absolute;inset:0;height:100%;object-fit:cover}.guide-card--image>*:not(img){position:relative;z-index:2;color:#fff}.partner-section{text-align:center}.partner-section h2{margin:18px 0 10px;font-size:clamp(35px,4.5vw,62px);letter-spacing:-.06em}.partner-section>p{max-width:600px;margin:0 auto;color:#6e6e6e;font-size:14px;line-height:1.65}.partner-section__items{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;margin-top:36px;text-align:left}.partner-section__items>div{padding:22px;border:1px solid #e7e7e7;border-radius:16px}.partner-section__items strong{display:block;font-size:16px}.partner-section__items span{display:block;margin-top:8px;color:#737373;font-size:12px;line-height:1.55}.home-cta{position:relative;min-height:525px;color:#fff;overflow:hidden}.home-cta>img,.home-cta__shade{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.home-cta__shade{background:linear-gradient(90deg,rgba(0,0,0,.65),rgba(0,0,0,.08))}.home-cta__content{position:relative;z-index:2;padding-top:145px}.home-cta h2{margin:18px 0 30px;font-size:clamp(45px,5vw,76px);line-height:.98;letter-spacing:-.065em}@media(max-width:960px){.home-hero__content{grid-template-columns:1fr;align-items:end;padding-top:155px}.home-hero{min-height:980px}.quick-enquiry{max-width:500px}.why-section{grid-template-columns:1fr;gap:40px}.why-section__image{height:470px}.guide-grid{grid-template-columns:1fr 1fr}.guide-feature{grid-column:1/-1}.partner-section__items{grid-template-columns:1fr}.home-cta__content{padding-top:120px}}@media(max-width:650px){.home-hero{min-height:930px}.home-hero__content{min-height:930px;padding:135px 0 36px}.home-hero h1{font-size:50px}.quick-enquiry{padding:20px;border-radius:20px}.intro-section{padding:64px 0}.intro-section h2{font-size:28px}.achievement-grid{grid-template-columns:1fr 1fr}.achievement{min-height:120px}.why-section__image{height:380px}.route-note{right:16px;bottom:16px;width:245px}.guide-grid{grid-template-columns:1fr}.guide-feature{grid-column:auto}.guide-card{min-height:270px}.home-cta{min-height:470px}.home-cta__content{padding-top:110px}.home-cta h2{font-size:46px}}
</style>

<style scoped>
.quick-select {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 18px;
  align-items: center;
}

.quick-select select {
  width: 100%;
  appearance: none;
}

.quick-select .material-icon {
  justify-self: end;
  color: #676767;
  pointer-events: none;
}

.quick-tabs__button {
  border: 0;
  padding: 10px;
  border-radius: 999px;
  background: transparent;
  color: #555;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.quick-tabs__button--active {
  background: #fff;
  color: #111;
  box-shadow: 0 2px 9px rgb(0 0 0 / 10%);
  font-weight: 700;
}

.quick-tabs__button:focus-visible {
  outline: 2px solid var(--forest);
  outline-offset: 2px;
}
</style>

<style scoped>
.hero-chip,.section-chip{font-size:12px}.home-hero__copy>p{font-size:17px}.home-hero__trust{font-size:14px}.quick-enquiry__heading h2{font-size:24px}.quick-tabs span{font-size:13px}.quick-field>span{font-size:10px}.quick-field select,.quick-field input{font-size:14px}.quick-enquiry>p{font-size:12px}.achievement-rule .section-chip{font-size:10px}.achievement span{font-size:13px}.why-section__copy>p,.guide-feature p,.partner-section>p{font-size:16px}.why-list span,.partner-section__items span{font-size:14px}.guide-card>span{font-size:12px}.guide-card i{font-size:14px}.route-note span,.route-note small{font-size:12px}
</style>

<style scoped>
.testimonial-section__heading{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.58fr);gap:34px;align-items:end;margin-bottom:34px}.testimonial-section__heading h2{max-width:680px;margin:11px 0 0;color:#183d2f;font-size:clamp(37px,4vw,58px);letter-spacing:-.065em;line-height:.98}.testimonial-section__heading>div:last-child{display:grid;justify-items:start;gap:18px}.testimonial-section__heading p{max-width:410px;margin:0;color:#62746b;font-size:15px;line-height:1.62}.testimonial-section__share{min-height:42px;padding:0 17px;color:var(--forest);border-color:#a8c5b4}.testimonial-section__empty{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:17px;align-items:center;padding:26px 28px;border:1px solid #d8e6de;border-radius:18px;background:#fff}.testimonial-section__empty>.material-icon{display:grid;width:45px;height:45px;place-items:center;border-radius:50%;background:#e9f4ed;color:#226a4e}.testimonial-section__empty strong{display:block;color:#1d4637;font-size:16px}.testimonial-section__empty p{max-width:600px;margin:5px 0 0;color:#718077;font-size:13px;line-height:1.55}@media(max-width:760px){.testimonial-section__heading{grid-template-columns:1fr;gap:18px}.testimonial-section__empty{grid-template-columns:auto minmax(0,1fr);padding:22px}.testimonial-section__empty .text-link{grid-column:2;justify-self:start}}@media(max-width:480px){.testimonial-section__empty{grid-template-columns:1fr}.testimonial-section__empty .text-link{grid-column:auto}}
</style>
