<script setup lang="ts">
defineProps<{ error: { statusCode?: number; statusMessage?: string } }>()
</script>

<template><main class="error-page"><div><span class="eyebrow">Tripport</span><h1>{{ error.statusCode === 404 ? 'This route is still being planned.' : 'Something took a wrong turn.' }}</h1><p>{{ error.statusMessage || 'Let’s guide you back to Kerala.' }}</p><NuxtLink class="button button--dark" to="/">Go to homepage</NuxtLink></div></main></template>

<style scoped>.error-page{display:grid;min-height:100vh;place-items:center;padding:30px;background:#f3f5f3;text-align:center}.error-page h1{max-width:700px;margin:15px 0;font-size:clamp(44px,6vw,80px);line-height:.96;letter-spacing:-.07em}.error-page p{margin:0 0 25px;color:#666}</style>
