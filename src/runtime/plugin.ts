import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
  })

  // Register Vuetify to Vue
  nuxtApp.vueApp.use(vuetify)

  if (!process.server) console.log('❤️ Initialized Vuetify 3', vuetify)
})
