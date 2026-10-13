<script setup lang="ts">
useSeoMeta({
  title: 'About Tripport by Lavanya',
  description: 'Meet Tripport by Lavanya Travel Service. Established in 1990, Lavanya brings over three decades of travel industry experience to thoughtfully planned Kerala journeys.',
})

const { openEnquiry } = useEnquiry()

const values = [
  {
    icon: 'explore',
    title: 'Experience that guides you',
    description: 'Lavanya’s decades in the travel industry shape the practical details: sensible routes, time to enjoy each place and a journey that flows.',
  },
  {
    icon: 'favorite_border',
    title: 'Planning that feels personal',
    description: 'Your dates, interests and pace are our starting point. We help shape an itinerary around the way you want to travel.',
  },
  {
    icon: 'landscape',
    title: 'A closer connection to Kerala',
    description: 'From our base in Kochi, we bring a local perspective to Kerala’s hills, backwaters and coast, with useful advice for the journey ahead.',
  },
]
</script>

<template>
  <div>
    <section class="inner-hero inner-hero--image about-hero">
      <div class="page-shell inner-hero__content">
        <span class="hero-chip">Tripport by Lavanya</span>
        <h1>New journeys.<br>A legacy since 1990.</h1>
        <p>Thoughtfully planned Kerala travel, backed by over three decades of experience with Lavanya Travel Service.</p>
        <span class="about-hero__origin">Established in 1990 <span aria-hidden="true">·</span> Based in Kochi, Kerala</span>
      </div>
    </section>

    <section class="section page-shell about-story" aria-labelledby="our-story-heading">
      <div>
        <span class="eyebrow">The people behind Tripport</span>
        <h2 id="our-story-heading">A fresh chapter.<br>Deep roots in travel.</h2>
        <div class="about-heritage">
          <span class="about-heritage__label">Lavanya Travel Service</span>
          <strong>Since 1990</strong>
          <span>Over three decades of travel industry experience.</span>
        </div>
      </div>
      <div class="content-prose about-story__copy">
        <p class="about-story__lead">Tripport is a travel brand by <strong>Lavanya Travel Service</strong>, bringing a long-standing travel agency’s experience to a new way of exploring Kerala.</p>
        <p>Lavanya has been part of the travel agency industry since 1990. Those years of experience have shaped our approach to travel: understand the traveller, think through the details and give every journey the care it deserves.</p>
        <p>Tripport carries that experience forward with a focus on Kerala. From our base in Kochi, we create thoughtful route ideas and flexible itineraries that help you discover the region at your own pace.</p>
        <p>When you plan with Tripport, you’re planning with the experience of Lavanya behind you, from the first conversation to the details that bring your trip together.</p>
      </div>
    </section>

    <section class="section section--soft" aria-labelledby="our-approach-heading">
      <div class="page-shell">
        <div class="section-heading about-values__heading">
          <div>
            <span class="eyebrow">The Lavanya experience, the Tripport way</span>
            <h2 id="our-approach-heading">Years of know-how.<br>Care in every journey.</h2>
          </div>
          <p>Our history is the foundation. How we help you travel is what brings it to life.</p>
        </div>
        <div class="about-values">
          <article v-for="value in values" :key="value.title">
            <span class="about-values__icon"><MaterialIcon :name="value.icon" :size="25" /></span>
            <h3>{{ value.title }}</h3>
            <p>{{ value.description }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="section page-shell about-cta">
      <div>
        <span class="eyebrow">Your next chapter</span>
        <h2>Let’s make your Kerala<br>journey a personal one.</h2>
        <p>Tell us what you have in mind. We’ll help you find a route that feels right.</p>
      </div>
      <div class="about-cta__actions">
        <button class="button button--forest" type="button" @click="openEnquiry()">Plan with us <MaterialIcon name="arrow_forward" :size="18" /></button>
        <NuxtLink class="text-link" to="/itineraries">Explore itineraries <MaterialIcon name="arrow_forward" :size="18" /></NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-hero {
  min-height: 570px;
  background-image: url('/images/kochi.jpg');
  background-position: center 55%;
}

.about-hero::before {
  background: linear-gradient(90deg, rgb(6 28 20 / 80%), rgb(6 28 20 / 40%) 65%, rgb(6 28 20 / 20%));
}

.about-hero h1 {
  max-width: 930px;
}

.about-hero .hero-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 13px;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 999px;
  background: rgb(255 255 255 / 12%);
  font-size: 12px;
  font-weight: 600;
}

.about-hero p {
  max-width: 580px;
  color: rgb(255 255 255 / 90%);
}

.about-hero__origin {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
  color: rgb(255 255 255 / 85%);
  font-size: 12px;
  font-weight: 600;
}

.about-story {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  gap: clamp(40px, 7vw, 100px);
}

.about-story h2,
.about-cta h2 {
  margin: 18px 0 0;
  color: var(--forest);
  font-size: clamp(38px, 4.2vw, 60px);
  line-height: 1.04;
  letter-spacing: -.06em;
}

.about-heritage {
  display: grid;
  gap: 10px;
  margin-top: 37px;
  padding: 28px 30px;
  border-left: 3px solid var(--green);
  border-radius: 0 18px 18px 0;
  background: #f1f6f2;
  color: #53665b;
  font-size: 14px;
  line-height: 1.6;
}

.about-heritage__label {
  color: var(--forest);
  font-size: 12px;
  font-weight: 750;
  letter-spacing: .08em;
  text-transform: uppercase;
}

.about-heritage strong {
  color: var(--forest);
  font-size: clamp(42px, 5vw, 66px);
  font-weight: 500;
  letter-spacing: -.06em;
  line-height: 1.1;
}

.about-story__copy p {
  margin: 0 0 20px;
}

.about-story__copy p:last-child {
  margin-bottom: 0;
}

.about-story__copy .about-story__lead {
  color: #263e32;
  font-size: 21px;
  line-height: 1.55;
  letter-spacing: -.025em;
}

.about-values__heading {
  margin-bottom: 34px;
}

.about-values__heading h2 {
  color: var(--forest);
}

.about-values {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.about-values article {
  padding: 30px;
  border: 1px solid #e2e9e3;
  border-radius: 20px;
  background: #fff;
}

.about-values__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: #edf4ee;
  color: var(--green);
}

.about-values h3 {
  max-width: 260px;
  margin: 24px 0 12px;
  color: var(--forest);
  font-size: 26px;
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -.04em;
}

.about-values p,
.about-cta p {
  margin: 0;
  color: #5f6c64;
  font-size: 16px;
  line-height: 1.7;
}

.about-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 35px;
}

.about-cta p {
  max-width: 510px;
  margin-top: 20px;
}

.about-cta__actions {
  display: grid;
  justify-items: center;
  flex-shrink: 0;
  gap: 20px;
}

.about-cta .button {
  gap: 10px;
}

@media (max-width: 900px) {
  .about-values {
    grid-template-columns: 1fr;
  }

  .about-values h3 {
    max-width: none;
  }
}

@media (max-width: 750px) {
  .about-story {
    grid-template-columns: 1fr;
    gap: 35px;
  }

  .about-hero {
    min-height: 500px;
    padding-top: 100px;
  }

  .about-hero h1 {
    font-size: clamp(44px, 8vw, 60px);
  }

  .about-heritage {
    margin-top: 28px;
    padding: 24px;
  }

  .about-story__copy .about-story__lead {
    font-size: 20px;
  }

  .about-cta {
    align-items: flex-start;
    flex-direction: column;
  }

  .about-cta__actions {
    justify-items: start;
  }
}
</style>
