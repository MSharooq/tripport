<script setup lang="ts">
const { isEnquiryOpen, selectedItinerary } = useEnquiry()
</script>

<template>
  <div class="site-frame">
    <SiteHeader />
    <main><slot /></main>
    <SiteFooter />
    <EnquiryModal v-model="isEnquiryOpen" :selected-itinerary-title="selectedItinerary" />
  </div>
</template>
