<template>
  <article class="overflow-hidden rounded-3xl border border-mist-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-mist">
    <NuxtLink :to="`/blog/${post.slug}`">
      <img class="aspect-[16/10] w-full object-cover" :src="post.coverImage" :alt="post.title" loading="lazy">
    </NuxtLink>
    <div class="p-5">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">{{ post.category }} · {{ post.readTime }}</p>
      <NuxtLink :to="`/blog/${post.slug}`">
        <h3 class="mt-3 font-display text-xl font-bold leading-7 text-forest-950">{{ post.title }}</h3>
      </NuxtLink>
      <p class="mt-3 line-clamp-3 text-sm leading-6 text-mist-700">{{ post.excerpt }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    title: string
    slug: string
    excerpt: string
    category: string
    coverImage: string
    readTime: string
  }
}>()
</script>
