<script setup lang="ts">
import { destinations } from '~/data/itineraries'
useSeoMeta({ title: 'Kerala Destinations', description: 'Explore Kerala destinations and understand how each stop fits into a travel itinerary.' })
</script>

<template><div><section class="inner-hero"><div class="page-shell inner-hero__content"><span class="eyebrow">Kerala, one stop at a time</span><h1>Destinations that belong together.</h1><p>Explore the places that shape Tripport itineraries—from the hills of Munnar to the slower rhythm of the backwaters and coast.</p></div></section><section class="section page-shell"><div class="section-heading"><div><span class="eyebrow">Where to go</span><h2>Choose the moments that define the trip.</h2></div><p>Each destination page offers the essential planning context. You can later swap in your own detailed copy, experiences and photographs.</p></div><div class="destination-grid destination-grid--full"><DestinationCard v-for="destination in destinations" :key="destination.slug" :destination="destination" /></div></section></div></template>

<style scoped>.destination-grid--full{grid-template-columns:repeat(5,1fr)}@media(max-width:1050px){.destination-grid--full{grid-template-columns:repeat(3,1fr)}}@media(max-width:720px){.destination-grid--full{grid-template-columns:1fr 1fr}}</style>
