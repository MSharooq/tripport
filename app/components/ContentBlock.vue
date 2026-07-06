<template>
  <section>
    <h2 class="font-display text-2xl font-bold text-forest-950">{{ title }}</h2>
    <div class="mt-4 text-base leading-7 text-mist-700">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
