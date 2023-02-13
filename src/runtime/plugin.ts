import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createVuetify, VuetifyOptions } from 'vuetify'

export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const {
    treeshaking,
    ...vuetifyConfig
  } = runtimeConfig.public.vuetify

  let components: VuetifyOptions['components']
  let directives: VuetifyOptions['directives']
  if (!treeshaking) {
    components = await import('vuetify/components')
    directives = await import('vuetify/directives')
  }

  const vuetify = createVuetify({
    components,
    directives,
    ...vuetifyConfig
  })

  // Register Vuetify to Vue
  nuxtApp.vueApp.use(vuetify)

  if (!process.server) {
    // eslint-disable-next-line no-console
    console.log('❤️ Initialized Vuetify 3', vuetify)
  }
})
