// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  plugins: [],
  tailwindcss: {},
  typescript: {
    typeCheck: false
  },
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
      apiBaseUrl: '/api'
    }
  }
},)
