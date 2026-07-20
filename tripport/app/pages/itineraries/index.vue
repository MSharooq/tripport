<script setup lang="ts">
import { itineraries, packageTypeLabel, type PackageType } from '~/data/itineraries'
useSeoMeta({ title: 'Kerala Itineraries', description: 'Thoughtfully planned Kerala itinerary ideas for every kind of journey.' })
const active = ref<'All' | PackageType>('All')
const packageTypeFilters = computed(() => ['All', ...new Set(itineraries.filter(item => item.status === 'published').map(item => item.packageType))] as Array<'All' | PackageType>)
const filtered = computed(() => active.value === 'All' ? itineraries.filter(i => i.status === 'published') : itineraries.filter(i => i.status === 'published' && i.packageType === active.value))
</script>

<template><div><section class="inner-hero"><div class="page-shell inner-hero__content"><span class="eyebrow">Explore Kerala</span><h1>Itineraries that give you a beautiful place to begin.</h1><p>Every Tripport itinerary is designed around sensible flow, memorable stays and the rhythm of Kerala travel.</p></div></section><section class="section page-shell"><div class="section-heading"><div><span class="eyebrow">Browse routes</span><h2>Find a route that fits your journey.</h2></div><p>Choose an itinerary, send a short enquiry and our team will help with the details.</p></div><div class="filter-row"><button v-for="packageType in packageTypeFilters" :key="packageType" class="filter-button" :class="{'filter-button--active':active===packageType}" @click="active=packageType">{{ packageType === 'All' ? 'All itineraries' : packageTypeLabel(packageType) }}</button></div><div class="itinerary-grid"><ItineraryCard v-for="item in filtered" :key="item.slug" :itinerary="item" /></div></section></div></template>
