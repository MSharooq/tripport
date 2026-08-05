<script setup lang="ts">
import "~/assets/css/main.css";

const requestUrl = useRequestURL();
const siteUrl = requestUrl.origin;

useSeoMeta({
  titleTemplate: (title) =>
    title ? `${title} · Tripport` : "Tripport · Thoughtful Kerala Journeys",
  description:
    "Discover thoughtfully planned Kerala journeys, from a Kochi-based team with more than fifteen years of travel experience.",
  ogSiteName: "Tripport",
  ogType: "website",
  ogImage: `${siteUrl}/og.png`,
  twitterCard: "summary_large_image",
  twitterImage: `${siteUrl}/og.png`,
});

useHead({
  htmlAttrs: { lang: "en" },
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/images/tripport_favicon.svg",
    },
  ],
});
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
