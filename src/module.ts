import { addPlugin, createResolver, defineNuxtModule, getNuxtVersion, isNuxt3, useLogger } from '@nuxt/kit'
import defu from 'defu'
import vuetify from 'vite-plugin-vuetify'
import { VuetifyOptions } from 'vuetify'
import { name, version } from '../package.json'

const CONFIG_KEY = 'vuetify'
const logger = useLogger('nuxt:vuetify')

export interface ModuleOptions extends VuetifyOptions {
  treeshaking?: boolean;
  autoImport?: boolean;
  styles?: true | 'none' | 'expose' | 'sass' | {
    configFile: string;
  };
}

export default defineNuxtModule<ModuleOptions>({
  // Default configuration options of the Nuxt module
  defaults: {
    treeshaking: false,
    styles: true,
    autoImport: true
  },
  meta: {
    name,
    version,
    configKey: CONFIG_KEY,
    compatibility: {
      nuxt: '^3.0.0'
    }
  },
  setup ({
    styles,
    autoImport,
    ..._options
  }, nuxt) {
    if (!isNuxt3(nuxt)) {
      logger.error(`Cannot support nuxt version: ${getNuxtVersion(nuxt)}`)
    }
    const isSSR = nuxt.options.ssr
    const options = defu(_options, { ssr: isSSR })

    nuxt.options.css ??= []
    // @ts-ignore public.vuetify doesn't include VuetifyOptions
    nuxt.options.runtimeConfig.public.vuetify = options

    // Module: Transpile the runtime and vuetify package
    const resolver = createResolver(import.meta.url)
    const runtimeDir = resolver.resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push(CONFIG_KEY)

    // Vuetify: add vuetify styles to the nuxtApp css
    // @TODO: this is not SSR friendly (styles are added twice.
    //        also can't do this in plugin, as rollup then injects the styles
    if (typeof styles === 'string' && ['sass', 'expose'].includes(styles)) {
      nuxt.options.css.unshift('vuetify/styles/main.sass')
    } else if (styles === true || typeof styles === 'object') {
      nuxt.options.css.unshift('vuetify/styles')
    }

    // Vuetify: default icons css
    nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')

    // Module: use vite-plugin-vuetify for treeshaking and includes autoImport and styles
    nuxt.hook('vite:extendConfig', (config) => {
      config.optimizeDeps = defu(config.optimizeDeps, { exclude: ['vuetify'] })

      if (options.treeshaking) {
        config.plugins = [
          ...(Array.isArray(config.plugins) ? config.plugins : []),
          vuetify({
            styles,
            autoImport
          })
        ]
      }

      config.ssr ||= {}
      config.ssr.noExternal = [
        ...(Array.isArray(config.ssr.noExternal) ? config.ssr.noExternal : []),
        CONFIG_KEY
      ]
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve(runtimeDir, 'plugin'))
  }
})
