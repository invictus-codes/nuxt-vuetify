export default defineNuxtConfig({
  modules: ['@invictus.codes/nuxt-vuetify'],
  ssr: true,
  vuetify: {
    moduleOptions: {
      treeshaking: true,
    },
  },
})
