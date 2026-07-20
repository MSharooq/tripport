<script setup lang="ts">
import { itineraries, packageDuration, packageTypeLabel, standardCancellationPolicy, standardTerms } from '~/data/itineraries'
import { getWhatsAppLink } from '~/data/contact'

const route = useRoute()
const itinerary = computed(() => itineraries.find(item => item.slug === route.params.slug && item.status === 'published'))

if (!itinerary.value) {
  throw createError({ statusCode: 404, statusMessage: 'Itinerary not found' })
}

const { openEnquiry } = useEnquiry()
const activeImage = ref(0)
const expandedDay = ref<number | null>(itinerary.value.itinerary[0]?.day ?? null)
const expandedFaq = ref<number | null>(null)
let carouselTimer: ReturnType<typeof setInterval> | undefined

const gallery = computed(() => itinerary.value ? [itinerary.value.images.cover, ...(itinerary.value.images.gallery ?? [])] : [])
const duration = computed(() => itinerary.value ? packageDuration(itinerary.value.duration) : '')
const typeLabel = computed(() => itinerary.value ? packageTypeLabel(itinerary.value.packageType) : '')
const cancellationPolicy = computed(() => [...standardCancellationPolicy, ...(itinerary.value?.cancellationExceptions ?? [])])
const terms = computed(() => [...standardTerms, ...(itinerary.value?.additionalTerms ?? [])])
const relatedItineraries = computed(() => itinerary.value
  ? itineraries.filter(item => item.status === 'published' && item.slug !== itinerary.value!.slug).slice(0, 3)
  : [])

watch(() => itinerary.value?.slug, () => {
  activeImage.value = 0
  expandedDay.value = itinerary.value?.itinerary[0]?.day ?? null
  startCarousel()
})

function previousImage() {
  activeImage.value = (activeImage.value - 1 + gallery.value.length) % gallery.value.length
  startCarousel()
}

function nextImage() {
  activeImage.value = (activeImage.value + 1) % gallery.value.length
  startCarousel()
}

function startCarousel() {
  stopCarousel()
  if (gallery.value.length > 1) carouselTimer = setInterval(nextImage, 5500)
}

function stopCarousel() {
  if (carouselTimer) clearInterval(carouselTimer)
  carouselTimer = undefined
}

function toggleDay(day: number) {
  expandedDay.value = expandedDay.value === day ? null : day
}

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

function routeSummary(from: string, to: string) {
  return `${from} → ${to}`
}

onMounted(startCarousel)
onBeforeUnmount(stopCarousel)

useSeoMeta({
  title: () => itinerary.value?.seo.metaTitle ?? 'Kerala itinerary',
  description: () => itinerary.value?.seo.metaDescription ?? '',
  ogTitle: () => itinerary.value?.seo.metaTitle ?? 'Kerala itinerary',
  ogDescription: () => itinerary.value?.seo.metaDescription ?? '',
  ogImage: () => itinerary.value?.images.cover.url ?? '',
})
</script>

<template>
  <div v-if="itinerary">
    <section
      class="inner-hero inner-hero--image itinerary-hero"
      :style="{ backgroundImage: `url(${gallery[activeImage]?.url})` }"
      @mouseenter="stopCarousel"
      @mouseleave="startCarousel"
      @focusin="stopCarousel"
      @focusout="startCarousel"
    >
      <div class="page-shell inner-hero__content">
        <span class="hero-chip">{{ duration }} · {{ typeLabel }}</span>
        <h1>{{ itinerary.title }}</h1>
        <p>{{ itinerary.summary }}</p>
      </div>

      <div v-if="gallery.length > 1" class="page-shell hero-carousel-controls" aria-label="Itinerary photo controls">
        <button type="button" aria-label="Show previous photo" @click="previousImage"><MaterialIcon name="arrow_back" :size="20" /></button>
        <span>{{ activeImage + 1 }} / {{ gallery.length }}</span>
        <button type="button" aria-label="Show next photo" @click="nextImage"><MaterialIcon name="arrow_forward" :size="20" /></button>
      </div>
    </section>

    <section class="section page-shell itinerary-detail">
      <div class="itinerary-detail__main">
        <span class="eyebrow">Route overview</span>
        <h2>{{ itinerary.destination.locations.join(' · ') }}</h2>
        <p class="itinerary-intro">{{ itinerary.description }}</p>

        <div class="journey-facts" aria-label="Itinerary overview">
          <div><span>Duration</span><strong>{{ duration }}</strong></div>
          <div><span>Destinations</span><strong>{{ itinerary.destination.locations.length }} stops</strong></div>
          <div><span>Travel style</span><strong>{{ typeLabel }}</strong></div>
        </div>

        <div v-if="itinerary.highlights?.length" class="tag-section">
          <span class="tag-section__label">Journey highlights</span>
          <div class="highlight-list"><span v-for="highlight in itinerary.highlights" :key="highlight">{{ highlight }}</span></div>
        </div>

        <div v-if="itinerary.suitableFor?.length" class="tag-section tag-section--light">
          <span class="tag-section__label">Well suited for</span>
          <div class="highlight-list"><span v-for="traveller in itinerary.suitableFor" :key="traveller">{{ traveller }}</span></div>
        </div>

        <div class="day-plan-heading">
          <span class="eyebrow">The journey</span>
          <h2>Day-by-day itinerary</h2>
          <p>Open each day for route details, included experiences, meals and your planned overnight stay.</p>
        </div>

        <ol class="day-list">
          <li
            v-for="item in itinerary.itinerary"
            :key="item.day"
            class="day-item"
            :class="{ 'day-item--open': expandedDay === item.day }"
          >
            <div class="day-item__number" aria-hidden="true"><span>Day</span><strong>{{ String(item.day).padStart(2, '0') }}</strong></div>

            <div class="day-item__content">
              <button class="day-card" type="button" :aria-expanded="expandedDay === item.day" :aria-controls="`day-detail-${item.day}`" @click="toggleDay(item.day)">
                <span class="day-card__copy"><small>Journey day {{ String(item.day).padStart(2, '0') }}</small><strong>{{ item.title }}</strong></span>
                <MaterialIcon class="day-card__toggle" name="expand_more" :size="24" />
              </button>

              <div v-if="expandedDay === item.day" :id="`day-detail-${item.day}`" class="day-card__details">
                <div class="day-card__body">
                  <div class="day-copy"><span>Today’s rhythm</span><p>{{ item.description }}</p></div>

                  <div v-if="item.routeLegs?.length" class="day-detail-block">
                    <span>Route</span>
                    <ul class="route-legs"><li v-for="leg in item.routeLegs" :key="`${leg.from}-${leg.to}`"><strong>{{ routeSummary(leg.from, leg.to) }}</strong><small>{{ [leg.mode, leg.distanceKm ? `${leg.distanceKm} km` : '', leg.estimatedTravelTime].filter(Boolean).join(' · ') }}</small><em v-if="leg.note">{{ leg.note }}</em></li></ul>
                  </div>

                  <div v-if="item.activities?.length" class="day-detail-block">
                    <span>Included experiences</span>
                    <ul class="activity-list"><li v-for="experience in item.activities" :key="experience.title"><MaterialIcon name="check" :size="16" /><div><strong>{{ experience.title }}</strong><p v-if="experience.description">{{ experience.description }}</p><small v-if="experience.duration">{{ experience.duration }}</small></div></li></ul>
                  </div>

                  <div v-if="item.optionalActivities?.length" class="day-detail-block">
                    <span>More to explore</span>
                    <ul class="optional-list"><li v-for="experience in item.optionalActivities" :key="experience.title"><strong>{{ experience.title }}</strong><small>{{ [experience.duration, experience.availabilityNote ?? 'Available on request'].filter(Boolean).join(' · ') }}</small><p v-if="experience.description">{{ experience.description }}</p></li></ul>
                  </div>

                  <div v-if="item.meals?.length || item.overnightAt" class="day-meta">
                    <div v-if="item.meals?.length"><span>Meals</span><p><b v-for="meal in item.meals" :key="meal">{{ meal }}</b></p></div>
                    <div v-if="item.overnightAt"><span>Overnight</span><p>{{ item.overnightAt }}</p></div>
                  </div>
                </div>
                <figure v-if="item.image"><img :src="item.image.url" :alt="item.image.alt"><figcaption>{{ item.title }}</figcaption></figure>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <aside class="itinerary-detail__aside">
        <span class="eyebrow">Start planning</span>
        <h3>Interested in this journey?</h3>
        <p>Share your travel dates and group details. Our team will respond with the right next steps.</p>
        <button v-if="itinerary.contact.enquiryEnabled" class="button button--dark" type="button" @click="openEnquiry(itinerary.title)">{{ itinerary.contact.callToAction }}</button>
        <a v-if="itinerary.contact.whatsappEnabled" :href="getWhatsAppLink(`Hello Tripport, I am interested in ${itinerary.title}.`)" target="_blank" rel="noopener">Chat on WhatsApp <MaterialIcon name="arrow_forward" :size="16" /></a>
      </aside>
    </section>

    <section v-if="itinerary.accommodation || itinerary.transport" class="section section--soft">
      <div class="page-shell package-details">
        <div class="package-details__heading"><span class="eyebrow">Stay & travel</span><h2>How this journey is put together.</h2><p>These details make the route easier to understand. Your final confirmation will list every service reserved for your dates.</p></div>
        <div class="stay-travel-grid">
          <section v-if="itinerary.accommodation" class="information-card information-card--wide">
            <div class="information-card__heading"><span>Accommodation</span><h3>{{ itinerary.accommodation.category }}</h3><p>{{ itinerary.accommodation.roomType }} · {{ itinerary.accommodation.occupancy }}</p></div>
            <div class="hotel-list"><article v-for="property in itinerary.accommodation.properties" :key="`${property.location}-${property.hotelName}`"><div><span>{{ property.location }} · {{ property.nights }} {{ property.nights === 1 ? 'night' : 'nights' }}</span><strong>{{ property.hotelName }}</strong></div><p>{{ property.roomType }}<br>{{ property.mealPlan }}</p></article></div>
            <small v-if="itinerary.accommodation.hotelNote" class="information-note">{{ itinerary.accommodation.hotelNote }}</small>
          </section>
          <section v-if="itinerary.transport" class="information-card">
            <div class="information-card__heading"><span>Transport</span><h3>{{ itinerary.transport.vehicle }}</h3><p>{{ itinerary.transport.type }}</p></div>
            <dl class="transport-list"><div v-if="itinerary.transport.maximumGuests"><dt>Guests</dt><dd>Up to {{ itinerary.transport.maximumGuests }}</dd></div><div v-if="itinerary.transport.luggageCapacity"><dt>Luggage</dt><dd>{{ itinerary.transport.luggageCapacity }}</dd></div><div><dt>Pick-up</dt><dd>{{ itinerary.transport.pickupLocations.join(' · ') }}</dd></div><div><dt>Drop</dt><dd>{{ itinerary.transport.dropLocations.join(' · ') }}</dd></div></dl>
            <ul class="service-list"><li v-if="itinerary.transport.driverIncluded"><MaterialIcon name="check" :size="16" />Driver included</li><li v-if="itinerary.transport.fuelIncluded"><MaterialIcon name="check" :size="16" />Fuel included</li><li v-if="itinerary.transport.tollsAndParkingIncluded"><MaterialIcon name="check" :size="16" />Tolls and parking included</li></ul>
            <small v-if="itinerary.transport.vehicleNote" class="information-note">{{ itinerary.transport.vehicleNote }}</small>
          </section>
        </div>
      </div>
    </section>

    <section class="section section--soft package-details package-details--compact">
      <div class="page-shell">
        <div class="package-details__heading"><span class="eyebrow">What to expect</span><h2>Included in your journey.</h2><p>A clear outline of what is covered before you send an enquiry.</p></div>
        <div class="package-details__grid">
          <section class="detail-card detail-card--included"><h3>What’s included</h3><ul><li v-for="item in itinerary.inclusions" :key="item"><MaterialIcon name="check" :size="17" />{{ item }}</li></ul></section>
          <section class="detail-card"><h3>What’s not included</h3><ul><li v-for="item in itinerary.exclusions" :key="item"><MaterialIcon name="remove" :size="17" />{{ item }}</li></ul></section>
        </div>
      </div>
    </section>

    <section v-if="itinerary.importantInformation?.length" class="section page-shell important-section">
      <span class="eyebrow">Important information</span><h2>Useful details before you enquire.</h2>
      <ul><li v-for="item in itinerary.importantInformation" :key="item"><MaterialIcon name="check" :size="17" />{{ item }}</li></ul>
    </section>

    <section class="section section--soft">
      <div class="page-shell policy-grid">
        <section class="policy-card"><span class="eyebrow">Cancellation policy</span><h2>Clear terms, before you confirm.</h2><ol><li v-for="policy in cancellationPolicy" :key="`${policy.period}-${policy.note}`"><strong>{{ policy.period }}</strong><p>{{ policy.cancellationChargePercent !== undefined ? `${policy.cancellationChargePercent}% cancellation charge` : policy.note }}</p></li></ol></section>
        <section class="policy-card"><span class="eyebrow">Terms & conditions</span><h2>A few important notes.</h2><ol><li v-for="term in terms" :key="term">{{ term }}</li></ol></section>
      </div>
    </section>

    <section v-if="itinerary.faq?.length" class="section page-shell faq-section">
      <div class="faq-section__heading"><span class="eyebrow">Questions, answered</span><h2>Before you go.</h2></div>
      <div class="faq-list"><article v-for="(faq, index) in itinerary.faq" :key="faq.question" :class="{ 'faq-item--open': expandedFaq === index }"><button type="button" :aria-expanded="expandedFaq === index" @click="toggleFaq(index)"><strong>{{ faq.question }}</strong><MaterialIcon name="expand_more" :size="22" /></button><p v-if="expandedFaq === index">{{ faq.answer }}</p></article></div>
    </section>

    <section class="section section--soft related-section">
      <div class="page-shell"><div class="section-heading"><div><span class="eyebrow">More to explore</span><h2>Other Kerala routes</h2></div></div><div class="itinerary-grid"><ItineraryCard v-for="item in relatedItineraries" :key="item.slug" :itinerary="item" /></div></div>
    </section>
  </div>
</template>

<style scoped>
.itinerary-hero{transition:background-image .25s ease}.hero-carousel-controls{position:absolute;right:0;bottom:30px;left:0;z-index:2;display:flex;justify-content:flex-end;align-items:center;gap:6px}.hero-carousel-controls button{display:grid;width:38px;height:38px;place-items:center;border:0;border-radius:50%;background:rgb(255 255 255 / 92%);color:#17372f;cursor:pointer}.hero-carousel-controls>span{min-width:48px;padding:0 8px;color:#fff;font-size:11px;font-weight:800;text-align:center}.itinerary-detail{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:70px}.itinerary-detail__main>h2{margin:14px 0 18px;font-size:clamp(42px,4.2vw,68px);font-weight:650;letter-spacing:-.065em;line-height:.98}.itinerary-intro{max-width:720px;margin:0;color:#63716b;font-size:16px;line-height:1.75}.journey-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin:36px 0;border:1px solid #dde6e0;border-radius:16px;overflow:hidden;background:#dde6e0}.journey-facts div{padding:17px;background:#fff}.journey-facts span,.tag-section__label{display:block;color:#78847e;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.journey-facts strong{display:block;margin-top:7px;color:#17372f;font-size:14px;line-height:1.35}.tag-section{padding:23px 0;border-top:1px solid #dde6e0}.tag-section--light{padding-bottom:40px}.highlight-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.highlight-list span{padding:9px 11px;border-radius:9px;background:#edf2ee;color:#21473a;font-size:11px;font-weight:800}.tag-section--light .highlight-list span{background:#f6f7f6;color:#5d6963}.day-plan-heading{padding-top:24px;border-top:1px solid #dce4df}.day-plan-heading h2{margin:13px 0 10px;font-size:clamp(38px,3.7vw,56px);font-weight:650;letter-spacing:-.065em;line-height:.98}.day-plan-heading p{max-width:620px;margin:0;color:#69766f;font-size:15px;line-height:1.65}.day-list{display:grid;gap:14px;padding:0;margin:36px 0 0;list-style:none}.day-item{display:grid;grid-template-columns:142px minmax(0,1fr);overflow:hidden;border:1px solid #dfe7e2;border-radius:20px;background:#fff;transition:border-color .2s ease,box-shadow .2s ease}.day-item:hover{border-color:#afcfbf}.day-item--open{border-color:#77b596;box-shadow:0 18px 45px rgb(20 69 54 / 10%)}.day-item__number{display:grid;align-content:start;gap:4px;padding:27px 22px;background:#edf3ef;color:#164a38}.day-item--open .day-item__number{background:#143d31;color:#fff}.day-item__number span{font-size:10px;font-weight:850;letter-spacing:.16em;text-transform:uppercase;opacity:.68}.day-item__number strong{font-size:52px;font-weight:650;letter-spacing:-.09em;line-height:.9}.day-card{display:flex;width:100%;min-height:108px;justify-content:space-between;align-items:center;gap:24px;padding:22px 26px;border:0;background:#fff;color:#151a17;text-align:left;cursor:pointer}.day-card__copy{display:grid;gap:7px}.day-card__copy small{color:#739182;font-size:10px;font-weight:850;letter-spacing:.11em;text-transform:uppercase}.day-card__copy strong{font-size:23px;font-weight:650;letter-spacing:-.035em;line-height:1.12}.day-card__toggle{display:grid;width:36px;height:36px;place-items:center;border-radius:50%;background:#edf3ef;color:#173f33;transition:transform .2s ease}.day-item--open .day-card__toggle{transform:rotate(180deg);background:#d6eadf}.day-card__details{display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:24px;padding:0 26px 27px;border-top:1px solid #e2ebe5}.day-card__body{display:grid;gap:21px;padding-top:24px}.day-copy>span,.day-detail-block>span,.day-meta span{display:block;color:#718077;font-size:10px;font-weight:850;letter-spacing:.11em;text-transform:uppercase}.day-copy p{margin:8px 0 0;color:#536159;font-size:14px;line-height:1.68}.day-detail-block{padding-top:20px;border-top:1px solid #edf0ee}.route-legs,.activity-list,.optional-list{display:grid;gap:10px;padding:0;margin:10px 0 0;list-style:none}.route-legs li,.optional-list li{display:grid;gap:3px;padding:12px 13px;border-radius:10px;background:#f6f8f6}.route-legs strong,.optional-list strong{font-size:13px}.route-legs small,.optional-list small{color:#537265;font-size:11px;font-weight:700}.route-legs em,.optional-list p{margin:2px 0 0;color:#7a837e;font-size:11px;font-style:normal;line-height:1.45}.activity-list li{display:flex;gap:9px;align-items:flex-start}.activity-list .material-icon{margin-top:2px;color:#0a7a57}.activity-list strong{display:block;font-size:13px}.activity-list p{margin:3px 0;color:#66746d;font-size:12px;line-height:1.5}.activity-list small{color:#0e7658;font-size:11px;font-weight:800}.day-meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding-top:20px;border-top:1px solid #edf0ee}.day-meta p{margin:7px 0 0;color:#263b32;font-size:12px;font-weight:750;line-height:1.5}.day-meta p b{display:inline-block;padding:5px 7px;margin:0 4px 4px 0;border-radius:6px;background:#edf3ef;color:#285541;font-size:10px}.day-card__details figure{min-height:250px;padding:0;margin:24px 0 0;overflow:hidden;border-radius:13px;background:#e8eeea}.day-card__details img{width:100%;height:100%;object-fit:cover}.day-card__details figcaption{position:absolute;clip:rect(0 0 0 0);clip-path:inset(50%);width:1px;height:1px;overflow:hidden;white-space:nowrap}.itinerary-detail__aside{position:sticky;top:100px;align-self:start;padding:28px;border:1px solid #dde7e1;border-radius:18px;background:#f8faf8}.itinerary-detail__aside h3{margin:14px 0 10px;font-size:27px;letter-spacing:-.05em;line-height:1.04}.itinerary-detail__aside p{margin:0;color:#66736c;font-size:13px;line-height:1.65}.itinerary-detail__aside .button{width:100%;margin-top:22px}.itinerary-detail__aside>a{display:inline-flex;align-items:center;gap:5px;margin-top:17px;color:#155e48;font-size:12px;font-weight:850;text-decoration:none}.package-details__heading{max-width:690px}.package-details__heading h2,.important-section h2,.policy-card h2,.faq-section h2{margin:14px 0 10px;font-size:clamp(34px,3.5vw,52px);font-weight:650;letter-spacing:-.065em;line-height:1}.package-details__heading p{margin:0;color:#68756e;font-size:14px;line-height:1.65}.stay-travel-grid{display:grid;grid-template-columns:1.35fr .9fr;gap:16px;margin-top:32px}.information-card{padding:24px;border:1px solid #dbe5df;border-radius:17px;background:#fff}.information-card__heading>span{color:#0f7456;font-size:10px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.information-card__heading h3{margin:8px 0 5px;font-size:23px;letter-spacing:-.045em}.information-card__heading p{margin:0;color:#77837c;font-size:12px}.hotel-list{display:grid;gap:1px;margin-top:20px;border-top:1px solid #edf0ee}.hotel-list article{display:flex;justify-content:space-between;gap:14px;padding:14px 0;border-bottom:1px solid #edf0ee}.hotel-list span{display:block;color:#0e7455;font-size:10px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.hotel-list strong{display:block;margin-top:5px;font-size:14px}.hotel-list p{min-width:120px;margin:0;color:#68766f;font-size:11px;line-height:1.55;text-align:right}.information-note{display:block;margin-top:16px;color:#77837c;font-size:11px;line-height:1.5}.transport-list{display:grid;gap:12px;margin:22px 0 0}.transport-list div{display:grid;gap:3px}.transport-list dt{color:#7b8880;font-size:10px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.transport-list dd{margin:0;color:#223b31;font-size:12px;font-weight:700;line-height:1.4}.service-list{display:grid;gap:7px;padding:0;margin:20px 0 0;list-style:none}.service-list li{display:flex;gap:7px;align-items:center;color:#23523e;font-size:11px;font-weight:750}.service-list .material-icon{color:#087654}.package-details--compact{padding-top:0}.package-details--compact>.page-shell{padding-top:90px;border-top:1px solid #dbe5df}.package-details__grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:30px}.detail-card{padding:27px;border:1px solid #dce5df;border-radius:17px;background:#fff}.detail-card h3{margin:0;font-size:22px;letter-spacing:-.04em}.detail-card ul{display:grid;gap:13px;padding:0;margin:21px 0 0;list-style:none}.detail-card li{display:flex;gap:8px;align-items:flex-start;color:#59675f;font-size:13px;line-height:1.55}.detail-card--included li .material-icon{color:#0a7a57}.detail-card:not(.detail-card--included) li .material-icon{color:#8a6554}.important-section{padding-top:95px;padding-bottom:95px}.important-section ul{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:0;margin:30px 0 0;list-style:none}.important-section li{display:flex;gap:8px;padding:18px;border:1px solid #dee7e1;border-radius:13px;color:#59675f;font-size:12px;line-height:1.55}.important-section .material-icon{flex:0 0 auto;color:#0a7a57}.policy-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.policy-card{padding:29px;border:1px solid #dbe5df;border-radius:18px;background:#fff}.policy-card h2{font-size:32px}.policy-card ol{display:grid;gap:14px;padding:0;margin:25px 0 0;list-style:none}.policy-card li{padding:0 0 14px;border-bottom:1px solid #edf0ee;color:#59675f;font-size:13px;line-height:1.55}.policy-card li:last-child{padding-bottom:0;border:0}.policy-card li strong{display:block;color:#1e4637;font-size:12px}.policy-card li p{margin:5px 0 0}.faq-section{display:grid;grid-template-columns:.75fr 1.25fr;gap:70px}.faq-section h2{font-size:clamp(38px,4vw,56px)}.faq-list{display:grid;gap:9px}.faq-list article{overflow:hidden;border:1px solid #dce5df;border-radius:13px}.faq-list button{display:flex;width:100%;justify-content:space-between;align-items:center;gap:16px;padding:18px;border:0;background:#fff;color:#1d2c25;text-align:left;cursor:pointer}.faq-list button strong{font-size:14px}.faq-list button .material-icon{color:#265540;transition:transform .2s ease}.faq-item--open button .material-icon{transform:rotate(180deg)}.faq-list p{padding:0 18px 18px;margin:0;color:#66746d;font-size:13px;line-height:1.65}.related-section{padding-top:0}.related-section :deep(.section-heading){padding-top:50px;border-top:1px solid #dce4df}@media(max-width:900px){.itinerary-detail,.faq-section{grid-template-columns:1fr;gap:40px}.itinerary-detail__aside{position:static}.stay-travel-grid,.important-section ul,.policy-grid{grid-template-columns:1fr}.package-details__grid{grid-template-columns:1fr}}@media(max-width:620px){.hero-carousel-controls{bottom:18px}.hero-carousel-controls button{width:34px;height:34px}.journey-facts{grid-template-columns:1fr}.day-item{grid-template-columns:92px minmax(0,1fr)}.day-item__number{padding:22px 14px}.day-item__number strong{font-size:40px}.day-card{min-height:103px;padding:20px 15px 20px 18px;gap:12px}.day-card__copy strong{font-size:19px}.day-card__toggle{width:30px;height:30px}.day-card__details{grid-template-columns:1fr;gap:0;padding:0 18px 22px}.day-card__details figure{height:185px;min-height:0;margin-top:22px}.day-meta{grid-template-columns:1fr}.hotel-list article{display:block}.hotel-list p{margin-top:7px;text-align:left}.policy-card{padding:23px}.important-section{padding-top:65px;padding-bottom:65px}}
</style>

<style scoped>
.hero-carousel-controls>span{font-size:12px}.itinerary-intro{font-size:18px}.journey-facts span,.tag-section__label,.day-item__number span,.day-card__copy small,.day-copy>span,.day-detail-block>span,.day-meta span,.information-card__heading>span,.hotel-list span,.transport-list dt{font-size:11px}.journey-facts strong{font-size:16px}.highlight-list span{font-size:12px}.day-plan-heading p{font-size:16px}.day-card__copy strong{font-size:25px}.day-copy p{font-size:16px}.route-legs strong,.optional-list strong,.activity-list strong{font-size:14px}.route-legs small,.optional-list small,.activity-list small,.information-note{font-size:12px}.route-legs em,.optional-list p,.activity-list p{font-size:13px}.day-meta p{font-size:14px}.day-meta p b{font-size:11px}.itinerary-detail__aside p{font-size:15px}.itinerary-detail__aside>a{font-size:14px}.package-details__heading p{font-size:16px}.information-card__heading p,.hotel-list p{font-size:13px}.hotel-list strong{font-size:16px}.transport-list dd{font-size:14px}.service-list li{font-size:13px}.detail-card li,.policy-card li,.faq-list p{font-size:14px}.important-section li{font-size:14px}.policy-card li strong,.faq-list button strong{font-size:14px}
@media(max-width:620px){.day-card__copy strong{font-size:21px}.day-copy p{font-size:15px}}
</style>
