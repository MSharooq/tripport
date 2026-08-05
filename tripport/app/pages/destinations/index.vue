<script setup lang="ts">
import type { Destination } from '~/data/destinations'

useSeoMeta({
  title: 'Kerala Destinations',
  description: 'Explore Kerala destinations and understand how each stop fits into a thoughtful travel itinerary.',
})

const { data: destinationResponse } = await useFetch<Destination[]>('/api/content/destinations', {
  default: () => [],
})

const destinations = computed(() => {
  return destinationResponse.value?.filter(item => item.status === 'published') ?? []
})
</script>

<template>
  <div>
    <section class="inner-hero inner-hero--image destinations-hero">
      <div class="page-shell inner-hero__content">
        <span class="eyebrow">Kerala, one stop at a time</span>
        <h1>Destinations that belong together.</h1>
        <p>Explore the places that shape a Kerala journey—from misty hills and spice country to quiet backwaters and the coast.</p>
      </div>
    </section>

    <section class="section page-shell">
      <div class="section-heading">
        <div><span class="eyebrow">Where to go</span><h2>Choose the moments that define the trip.</h2></div>
        <p>Every destination has its own rhythm, best length of stay and natural route pairings.</p>
      </div>
      <div class="destination-grid destination-grid--full">
        <DestinationCard v-for="destination in destinations" :key="destination.slug" :destination="destination" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.destinations-hero{background-image:url('/images/destinations_mainpage.jpg')}.destination-grid--full{grid-template-columns:repeat(5,1fr)}@media(max-width:1050px){.destination-grid--full{grid-template-columns:repeat(3,1fr)}}@media(max-width:720px){.destination-grid--full{grid-template-columns:1fr 1fr}}
</style>
