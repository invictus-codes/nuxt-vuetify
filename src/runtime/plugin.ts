import { defineNuxtPlugin } from '#app'
// import { h } from 'vue'
import { createVuetify } from 'vuetify'

const isDev = process.env.NODE_ENV === 'development'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig()
  const options = config.public.vuetify
  console.log({
    ...options,
    // test: () => h('div', { innerHTML: 'hi' }),
  })
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
