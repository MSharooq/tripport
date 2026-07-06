<template>
  <div class="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
    <NuxtLink
      v-if="featured"
      class="group overflow-hidden rounded-[2rem] bg-white shadow-mist"
      :to="`/blog/${featured.slug}`"
    >
      <img class="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.03]" :src="featured.coverImage" :alt="featured.title" loading="lazy">
      <div class="p-6 sm:p-8">
        <p class="text-xs font-bold uppercase tracking-[0.18em] text-sage-600">{{ featured.category }} · {{ featured.readTime }}</p>
        <h3 class="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight text-forest-950 sm:text-4xl">{{ featured.title }}</h3>
        <p class="mt-4 max-w-2xl text-base leading-7 text-mist-700">{{ featured.excerpt }}</p>
      </div>
    </NuxtLink>

    <div class="rounded-[2rem] border border-mist-200 bg-white p-4 shadow-soft sm:p-6">
      <NuxtLink
        v-for="post in sidePosts"
        :key="post.slug"
        class="group flex gap-4 border-b border-mist-200 py-5 first:pt-0 last:border-b-0 last:pb-0"
        :to="`/blog/${post.slug}`"
      >
        <div class="grid size-12 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-950">
          <BookOpen class="size-5" aria-hidden="true" />
        </div>
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-sage-600">{{ post.category }} · {{ post.readTime }}</p>
          <h3 class="mt-2 font-display text-xl font-bold leading-7 text-forest-950 transition group-hover:text-sage-600">{{ post.title }}</h3>
          <p class="mt-2 line-clamp-2 text-sm leading-6 text-mist-700">{{ post.excerpt }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'

interface Post {
  title: string
  slug: string
  excerpt: string
  category: string
  coverImage: string
  readTime: string
}

const props = defineProps<{ posts: Post[] }>()
const featured = computed(() => props.posts[0])
const sidePosts = computed(() => props.posts.slice(1, 5))
</script>
