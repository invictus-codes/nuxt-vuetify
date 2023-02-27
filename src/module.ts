import { addPlugin, createResolver, defineNuxtModule, getNuxtVersion, isNuxt3, useLogger } from '@nuxt/kit'
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
    })
    nuxt.options.css ??= []
    nuxt.options.runtimeConfig.public.vuetify = vuetifyOptions

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
    } else if (!treeshaking && typeof styles === 'object' && styles?.configFile && typeof styles.configFile === 'string') {
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

    // If icon.defaultSet is 'FontAwesomeIcon' or 'font-awesome-icon'
    // @TODO: this should be fixed for SSR purposes
    if (['font-awesome-icon', 'FontAwesomeIcon'].includes(vuetifyOptions.icons?.defaultSet || '')) {
      if (vuetifyOptions.icons?.sets && Object.keys(vuetifyOptions.icons.sets)?.length) {
        logger.warn('Did not expect sets to be set. Please open an let me know your use case through the nuxt-vuetify issue list => https://github.com/invictus-codes/nuxt-vuetify/issues/new/choose')
      }
      //   addComponent({
      //     name: 'FontAwesomeIcon',
      //     export: 'FontAwesomeIcon',
      //     filePath: '@fortawesome/vue-fontawesome',
      //   })
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

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `pnpm run prepack`
    addPlugin(resolver.resolve(runtimeDir, 'plugin'), { append: true })
  },
})
