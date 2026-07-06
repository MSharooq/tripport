<template>
  <article class="px-5 pb-24 pt-28 sm:px-8">
    <div class="mx-auto max-w-5xl">
      <img class="max-h-[560px] w-full rounded-[2rem] object-cover shadow-mist" :src="post.coverImage" :alt="post.title">
      <div class="mx-auto mt-10 max-w-3xl">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ post.category }} · {{ post.readTime }} · {{ post.publishedDate }}</p>
        <h1 class="mt-4 font-display text-4xl font-bold leading-tight text-forest-950 sm:text-6xl">{{ post.title }}</h1>
        <p class="mt-5 text-lg leading-8 text-mist-700">{{ post.excerpt }}</p>
        <div class="mt-10 space-y-10">
          <ContentBlock v-for="block in post.content" :key="block.heading" :title="block.heading">
            <p>{{ block.body }}</p>
          </ContentBlock>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import posts from '../../../data/blogs.json'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const post = posts.find((item) => item.slug === slug)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Blog not found' })
}

useSeoMeta({
  title: post.seo.title,
  description: post.seo.description,
  ogTitle: post.seo.title,
  ogDescription: post.seo.description,
  ogImage: post.coverImage
})
</script>
