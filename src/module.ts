import { addPlugin, createResolver, defineNuxtModule, getNuxtVersion, isNuxt3, useLogger } from '@nuxt/kit'
import { VuetifyOptions } from 'vuetify/lib/framework.mjs'
import { name, version } from '../package.json'

const logger = useLogger('nuxt:vuetify')

export interface ModuleOptions extends VuetifyOptions {
}

export default defineNuxtModule<ModuleOptions>({
  // Default configuration options of the Nuxt module
  defaults: {},
  meta: {
    name,
    version,
    configKey: 'vuetify',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  setup (options, nuxt) {
    if (!isNuxt3(nuxt)) {
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)
    }

    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')

    nuxt.options.runtimeConfig.public.vuetify = options

    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('vuetify')

    nuxt.options.css ??= []
    nuxt.options.css.push('vuetify/styles')
    nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve(runtimeDir, 'plugin'))
  }
})
