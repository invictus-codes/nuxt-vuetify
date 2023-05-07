import {
  addPluginTemplate,
  createResolver,
  defineNuxtModule,
  getNuxtVersion,
  isNuxt3,
  useLogger,
} from '@nuxt/kit'
import defu from 'defu'
import vuetify from 'vite-plugin-vuetify'
import type { VuetifyOptions } from 'vuetify'
import { name, version } from '../package.json'

const CONFIG_KEY = 'vuetify'
const logger = useLogger('nuxt:vuetify')

export type TVuetifyOptions = Partial<VuetifyOptions> & { ssr: boolean; treeshaking: boolean }

export interface ModuleOptions {
  moduleOptions: {
    useIconCDN?: boolean
    treeshaking?: boolean
    autoImport?: boolean
    importLabComponents?: boolean
    styles?: true | 'none' | 'expose' | 'sass' | {
      configFile: string
    }
  }
  vuetifyOptions?: VuetifyOptions
}

export default defineNuxtModule<ModuleOptions>({
  // Default configuration options of the Nuxt module
  defaults: {
    moduleOptions: {
      // Nuxt-Vuetify module
      useIconCDN: true,
      treeshaking: false,
      importLabComponents: false,
      // Vite-plugin-vuetify
      styles: true,
      autoImport: true,
    },
    vuetifyOptions: undefined,
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
    moduleOptions,
        vuetifyOptions: _vuetifyOptions,
  }, nuxt) {
    if (!isNuxt3(nuxt)) {
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)
    }

    const {
      styles,
      autoImport,
      useIconCDN,
      treeshaking,
    } = moduleOptions

    // Prepare options for the runtime plugin
    const isSSR = nuxt.options.ssr
    const vuetifyOptions = <TVuetifyOptions>defu(_vuetifyOptions, {
      ssr: isSSR,
      treeshaking,
      importLabComponents: moduleOptions.importLabComponents
    })

    // Module: Transpile the runtime and vuetify package
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(CONFIG_KEY)

    // Vuetify: add vuetify styles to the nuxtApp css
    // @TODO: this is not SSR friendly (styles are added twice.
    //        also can't do this in plugin with dynamic import (all styles are included).
    nuxt.options.css ??= []
    if (typeof styles === 'string' && ['sass', 'expose'].includes(styles)) {
      nuxt.options.css.unshift('vuetify/styles/main.sass')
    } else if (styles === true) {
      nuxt.options.css.unshift('vuetify/styles')
    } else if (isSSR && !treeshaking && typeof styles === 'object' && styles?.configFile && typeof styles.configFile === 'string') {
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
        href: iconCDNs.get(vuetifyOptions.icons?.defaultSet || 'mdi'),
      })
    }

    // Module: use vite-plugin-vuetify for treeshaking and includes autoImport and styles
    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps = defu(config.optimizeDeps, { exclude: ['vuetify'] })

      if (treeshaking) {
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

    addPluginTemplate({
      src: resolver.resolve(runtimeDir, 'templates/plugin.mts'),
      options: vuetifyOptions,
    })
  },
})
