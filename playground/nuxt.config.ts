export default defineNuxtConfig({
  modules: ['../src/module'],
  vuetify: {
    ssr: process.server
  }
})
