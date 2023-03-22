import { defineNuxtPlugin } from '#imports';
import { createVuetify } from 'vuetify'

const isDev = process.env.NODE_ENV === "development"
const options = JSON.parse('<%= JSON.stringify(options) %>')

'<% if (!options.treeshaking) { %>'
import components from 'vuetify/components'
import directives from 'vuetify/directives'

options.components = components
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