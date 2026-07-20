// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["nitro-cloudflare-dev"],
  devtools: { enabled: true },
  compatibilityDate: '2024-04-03',

  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev'],
    }
  },

  nitro: {
    preset: "cloudflare_module",

    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    }
  }
})
