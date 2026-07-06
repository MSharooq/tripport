<template>
  <div class="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8" :class="columnsClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ columns?: 'two' | 'three' | 'four' }>(), {
  columns: 'three'
})

const columnsClass = computed(() => {
  if (props.columns === 'two') {
    return 'md:grid-cols-2'
  }

  if (props.columns === 'four') {
    return 'sm:grid-cols-2 lg:grid-cols-4'
  }

  return 'md:grid-cols-2 lg:grid-cols-3'
})
</script>
