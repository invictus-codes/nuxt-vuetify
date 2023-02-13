import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const vuetify = createVuetify({
    components,
    directives,
    ...runtimeConfig.public.vuetify
  })

  // Register Vuetify to Vue
  nuxtApp.vueApp.use(vuetify)

  if (!process.server) {
    // eslint-disable-next-line no-console
    console.log('❤️ Initialized Vuetify 3', vuetify)
  }
})
