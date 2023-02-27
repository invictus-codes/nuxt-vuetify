import { addPlugin, createResolver, defineNuxtModule, getNuxtVersion, isNuxt3, useLogger } from '@nuxt/kit'
import defu from 'defu'
import vuetify from 'vite-plugin-vuetify'
import type { VuetifyOptions } from 'vuetify'
import { name, version } from '../package.json'

const CONFIG_KEY = 'vuetify'
const logger = useLogger('nuxt:vuetify')

export interface ModuleOptions extends VuetifyOptions {
  useIconCDN?: boolean
  treeshaking?: boolean
  autoImport?: boolean
  styles?: true | 'none' | 'expose' | 'sass' | {
    configFile: string
  }
}

export default defineNuxtModule<ModuleOptions>({
  // Default configuration options of the Nuxt module
  defaults: {
    // Nuxt-Vuetify module
    useIconCDN: true,
    treeshaking: false,
    // Vite-plugin-vuetify
    styles: true,
    autoImport: true,
  },
  meta: {
    name,
    version,
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  setup({
    styles,
    autoImport,
    useIconCDN,
    ..._options
  }, nuxt) {
    if (!isNuxt3(nuxt)) {
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)
    }

    const isSSR = nuxt.options.ssr
    const options = defu(_options, { ssr: isSSR })

    nuxt.options.css ??= []
    // @ts-expect-error public.vuetify doesn't include VuetifyOptions
    nuxt.options.runtimeConfig.public.vuetify = options

    // Module: Transpile the runtime and vuetify package
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(CONFIG_KEY)

    // Vuetify: add vuetify styles to the nuxtApp css
    // @TODO: this is not SSR friendly (styles are added twice.
    //        also can't do this in plugin with dynamic import (all styles are included).
    if (typeof styles === 'string' && ['sass', 'expose'].includes(styles)) {
      nuxt.options.css.unshift('vuetify/styles/main.sass')
    } else if (styles === true) {
      nuxt.options.css.unshift('vuetify/styles')
    } else if (!options.treeshaking && typeof styles === 'object' && styles?.configFile && typeof styles.configFile === 'string') {
      nuxt.options.css.unshift(styles.configFile)
    }

    // Icon CDN's
    if (useIconCDN) {
      const iconCDNs = new Map()
      iconCDNs.set('fa', 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@latest/css/all.min.css')
      iconCDNs.set('mdi', 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css')
      iconCDNs.set('md', 'https://fonts.googleapis.com/css?family=Material+Icons')
      nuxt.options.app.head.link ||= []
      nuxt.options.app.head.link.push({
        rel: 'stylesheet',
        type: 'text/css',
        href: iconCDNs.get(options.icons?.defaultSet || 'mdi'),
      })
    }

    // Module: use vite-plugin-vuetify for treeshaking and includes autoImport and styles
    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps = defu(config.optimizeDeps, { exclude: ['vuetify'] })

      if (options.treeshaking) {
        config.plugins = [
          ...(Array.isArray(config.plugins) ? config.plugins : []),
          vuetify({
            styles,
            autoImport,
          }),
        ]
      }

      config.ssr ||= {}
      config.ssr.noExternal = [
        ...(Array.isArray(config.ssr.noExternal) ? config.ssr.noExternal : []),
        CONFIG_KEY,
      ]
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve(runtimeDir, 'plugin'))
  },
})
