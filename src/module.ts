import { addPlugin, createResolver, defineNuxtModule, getNuxtVersion, isNuxt3, useLogger } from '@nuxt/kit'
import defu from 'defu'
import { VuetifyOptions } from 'vuetify'
import { Plugin } from 'vite'
import { name, version } from '../package.json'

const CONFIG_KEY = 'vuetify'
const logger = useLogger('nuxt:vuetify')

export interface ModuleOptions extends VuetifyOptions {
  treeshaking: boolean;

  autoImport?: boolean;
  styles?: true | 'none' | 'expose' | 'sass' | {
    configFile: string;
  };
}

export default defineNuxtModule<ModuleOptions>({
  // Default configuration options of the Nuxt module
  defaults: {
    treeshaking: false
  },
  meta: {
    name,
    version,
    configKey: CONFIG_KEY,
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
    nuxt.options.build.transpile.push(CONFIG_KEY)

    nuxt.options.css ??= []
    nuxt.options.css.push('vuetify/styles')
    nuxt.options.css.push('@mdi/font/css/materialdesignicons.css')

    if (options.treeshaking) {
      nuxt.hook('vite:extendConfig', async (config) => {
        config.optimizeDeps = defu(config.optimizeDeps, { exclude: ['vuetify'] })
        const vuetify = await import('vite-plugin-vuetify') as unknown as () => Plugin[]
        config.plugins ??= []
        config.plugins.push(vuetify())
      })
    }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve(runtimeDir, 'plugin'))
  }
})
