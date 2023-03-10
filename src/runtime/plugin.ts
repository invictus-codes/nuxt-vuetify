import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { VuetifyOptions } from 'vuetify'
import { createVuetify } from 'vuetify'
import type { TVuetifyOptions } from '../module'
import { iconset } from './fontawesome'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()
  const {
    treeshaking,
    ...options
  } = <TVuetifyOptions>runtimeConfig.public.vuetify

  if (['font-awesome-icon', 'FontAwesomeIcon'].includes(options.icons?.defaultSet || '') && options.icons?.aliases) {
    library.add(...Object.values(options.icons.aliases))
    nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
    options.icons.sets = {
      [options.icons.defaultSet]: iconset,
      ...options.icons.sets,
    }
  }

  let components: VuetifyOptions['components']
  let directives: VuetifyOptions['directives']
  if (!treeshaking) {
    components = await import('vuetify/components')
    directives = await import('vuetify/directives')
  }

  const vuetify = createVuetify({
    components,
    directives,
    ...options,
  })

  // Register Vuetify to Vue
  nuxtApp.vueApp.use(vuetify)

  if (!process.server) {
    // eslint-disable-next-line no-console
    console.log('💚 Initialized Vuetify 3', vuetify)
  }
})
