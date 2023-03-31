export default defineNuxtConfig({
  modules: ['@invictus.codes/nuxt-vuetify'],
  app: {
    baseURL: process.env.BASE_URL || '/',
  },
  ssr: true,
  vuetify: {
    moduleOptions: {
      treeshaking: true,
      useIconCDN: true,
    },
  }
})
