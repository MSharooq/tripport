<template>
  <div>
    <HeroCarousel :slides="site.hero.slides" />

    <section id="packages" class="py-24">
      <SectionHeading v-bind="site.sections.featuredPackages" />
      <CardGrid>
        <PackageCard v-for="pkg in featuredPackages" :key="pkg.id" :pkg="pkg" />
      </CardGrid>
    </section>

    <section id="destinations" class="bg-mist-100 py-24">
      <SectionHeading v-bind="site.sections.destinations" />
      <DestinationCinema :destinations="destinations" />
    </section>

    <section class="py-24">
      <SectionHeading v-bind="site.sections.travelGuides" />
      <TravelGuideTabs :guides="guides" />
    </section>

    <section class="bg-mist-100 py-24">
      <SectionHeading v-bind="site.sections.blogs" />
      <BlogEditorial :posts="posts" />
    </section>

    <section class="py-24">
      <SectionHeading v-bind="site.sections.testimonials" />
      <TestimonialRibbon :testimonials="testimonials" />
    </section>

    <WhyTripPort :content="site.sections.whyTripPort" />
    <CTASection :content="site.sections.finalCta" />
  </div>
</template>

<script setup lang="ts">
import site from '../../data/site.json'
import packages from '../../data/packages.json'
import destinations from '../../data/destinations.json'
import guides from '../../data/travel-guides.json'
import posts from '../../data/blogs.json'
import testimonials from '../../data/testimonials.json'

const featuredPackages = packages.slice(0, 6)

useSeoMeta({
  title: site.seo.title,
  description: site.seo.description,
  ogTitle: site.seo.title,
  ogDescription: site.seo.description,
  ogImage: site.seo.ogImage
})
</script>
