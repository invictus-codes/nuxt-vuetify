export default defineNuxtConfig({
  modules: ['../src/module'],
  app: {
    baseURL: process.env.BASE_URL || '/',
  },
  ssr: true,
  vuetify: {
    moduleOptions: {
      styles: { configFile: '/main.scss' },
      treeshaking: true,
      useIconCDN: true,
      useVuetifyLabs: true
    },
  }
})
