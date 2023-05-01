export default defineNuxtConfig({
  ssr: false,
  modules: ['@invictus.codes/nuxt-vuetify'],
  css: ['@fortawesome/fontawesome-svg-core/styles.css'],
  vuetify: {
    moduleOptions: {
      treeshaking: true,
      useIconCDN: false,
      autoImport: true,
    },
    vuetifyOptions: {
      test() {
        console.log('hi')
      }
    }
  },
})
