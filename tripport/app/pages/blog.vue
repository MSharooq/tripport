<script setup lang="ts">
useSeoMeta({ title: 'Tripport Journal', description: 'Kerala travel inspiration and itinerary ideas from Tripport.' })
const posts = [
  { title: 'What makes a Kerala route feel well-paced?', category: 'Route notes', date: 'Coming soon', image: 'munnar-wide.jpg' },
  { title: 'Backwaters beyond the houseboat: planning a slower Kerala stay', category: 'Experiences', date: 'Coming soon', image: 'hero.jpg' },
  { title: 'Why slower Kerala journeys leave the strongest memories', category: 'Travel notes', date: 'Coming soon', image: 'kochi.jpg' },
]
</script>

<template><div><section class="inner-hero"><div class="page-shell inner-hero__content"><span class="eyebrow">Tripport journal</span><h1>Stories, routes and Kerala notes.</h1><p>Thoughtful travel content for curious people who want to understand Kerala a little better.</p></div></section><section class="section page-shell"><div class="blog-grid"><article v-for="post in posts" :key="post.title" class="blog-card"><img :src="`/images/${post.image}`" :alt="post.title"><div><span>{{ post.category }} · {{ post.date }}</span><h2>{{ post.title }}</h2><p>Article placeholders are ready for your first original Tripport stories.</p><NuxtLink to="/contact">Request a topic <MaterialIcon name="arrow_forward" :size="16" /></NuxtLink></div></article></div></section></div></template>

<style scoped>.blog-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.blog-card img{height:250px;border-radius:20px;object-fit:cover}.blog-card div{padding:18px 4px}.blog-card span{color:#777;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.blog-card h2{margin:9px 0;font-size:28px;line-height:1.08;letter-spacing:-.045em}.blog-card p{color:#6e6e6e;font-size:15px;line-height:1.55}.blog-card a{color:#0f7355;font-size:14px;font-weight:800}@media(max-width:750px){.blog-grid{grid-template-columns:1fr}}</style>
