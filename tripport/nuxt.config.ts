// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nitro-cloudflare-dev"],
  devtools: { enabled: true },
  compatibilityDate: '2026-07-20',

  runtimeConfig: {
    public: {
      supabaseUrl: '',
      supabasePublishableKey: '',
    },
  },

  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev'],
    }
  },

  nitro: {
    preset: "cloudflare-module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }
})
