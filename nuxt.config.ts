// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  nitro: {
    preset: 'cloudflare_module',
    compatibilityDate: '2025-07-15',
    cloudflare: {
      nodeCompat: true
    }
  },
  // 2. Underlying Vite protection fix (clean domain string only)
  vite: {
    server: {
      allowedHosts: ['sylphish-snowiest-willian.ngrok-free.dev']
    }
  }
})
