<script setup lang="ts">
import {
  responsiveImageAlt,
  responsiveImageSrc,
  responsiveImageSrcset,
  type ResponsiveImageSource,
} from '~/data/images'

const props = withDefaults(defineProps<{
  /** Preferred prop: a legacy URL, `{ url, alt, variants }`, or a variant map. */
  image?: ResponsiveImageSource
  /** Alias for `image`, useful when replacing a native `<img :src>` call. */
  src?: ResponsiveImageSource
  alt?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
  fetchpriority?: 'high' | 'low' | 'auto'
  decoding?: 'sync' | 'async' | 'auto'
  width?: number | string
  height?: number | string
}>(), {
  loading: 'lazy',
  fetchpriority: 'auto',
  decoding: 'async',
  sizes: '100vw',
})

const imageSource = computed<ResponsiveImageSource>(() => props.image !== undefined ? props.image : props.src)
const resolvedSrc = computed(() => responsiveImageSrc(imageSource.value))
const resolvedSrcset = computed(() => responsiveImageSrcset(imageSource.value))
const resolvedAlt = computed(() => props.alt ?? responsiveImageAlt(imageSource.value))
</script>

<template>
  <img
    v-if="resolvedSrc"
    :src="resolvedSrc"
    :srcset="resolvedSrcset || undefined"
    :sizes="resolvedSrcset ? sizes : undefined"
    :alt="resolvedAlt"
    :loading="loading"
    :fetchpriority="fetchpriority"
    :decoding="decoding"
    :width="width"
    :height="height"
  >
</template>
