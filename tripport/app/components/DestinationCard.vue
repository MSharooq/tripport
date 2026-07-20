<script setup lang="ts">
import type { Destination } from '~/data/itineraries'
defineProps<{ destination: Destination }>()
</script>

<template>
  <NuxtLink class="destination-card" :to="`/destinations/${destination.slug}`">
    <img :src="`/images/${destination.image}`" :alt="destination.name">
    <span class="destination-card__overlay" />
    <span class="destination-card__content"><small>{{ destination.region }}</small><strong>{{ destination.name }}</strong><span>{{ destination.idealNights }}</span></span>
  </NuxtLink>
</template>
