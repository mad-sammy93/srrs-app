// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'pinia-plugin-persistedstate'],
  css: ["@syncfusion/ej2-base/styles/material.css"],
  plugins: ['~/plugins/syncfusion'],
  components: true, // Enable auto-importing of components
  tailwindcss: {},
  typescript: {
    typeCheck: false
  },
  // css: ["@syncfusion/ej2-base/styles/material.css"],
  nitro: {
    devProxy: {
      '/api': {
        target: 'https://rr.dev.deploy.nl/v1',
        changeOrigin: true,
        // logLevel: 'debug'  // Enable detailed proxy logs
      }
    }
  },
  runtimeConfig: {
    public: {
      // apiBase: process.env.API_BASE_URL,
      apiBaseUrl: '/api',
      syncfusionApiKey: process.env.SYNC_FUSION_API_KEY
    }
  }
},)
