import { defineNuxtPlugin } from '#app'
import { createVuetify } from 'vuetify'

const isDev = process.env.NODE_ENV === "development"
const options = JSON.parse('<%= JSON.stringify(options) %>')

'<% if (!options.treeshaking) { %>'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

  '<% if (options.importLabComponents) { %>'
    import * as labs from 'vuetify/labs/components'
    options.components = {...components,...labs}
  '<% } else { %>'
    options.components = components
  '<% } %>'

options.directives = directives
'<% } %>'

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify(options)
  nuxtApp.vueApp.use(vuetify)

  if (!process.server && isDev) {
    // eslint-disable-next-line no-console
    console.log('💚 Initialized Vuetify 3', vuetify)
  }

  return {
    provide: {
      vuetify
    }
  }
})
