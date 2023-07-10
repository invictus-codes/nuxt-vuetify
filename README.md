<!--
Get your module up and running quickly.

Find and replace all on all files (CMD+SHIFT+F):
- Name: Nuxt Vuetify
- Package name: @invictus.codes/nuxt-vuetify
- Description: Add Vuetify 3 to your Nuxt application in seconds.
-->

# Nuxt Vuetify

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]

> Add Vuetify 3 to your Nuxt application in seconds.

- [✨ &nbsp;Release Notes](/CHANGELOG.md)

<!-- - [📖 &nbsp;Documentation](https://example.com) -->

## Features

<!-- Highlight some of the features your module provide here -->

- 👌 &nbsp;Zero configuration to start
- 🌳 &nbsp;Treeshaking built-in (vite, disabled by default)
- ⚡️ &nbsp;Icon fonts loaded via CDN (enabled by default, mdi)
- 📊 &nbsp;Automatic Nuxt SSR detection
- ⚙️ &nbsp;Vuetify styles configurable (precompiled css by default)

## Features not yet supported

- Vuetify labs with treeshaking
- [Material Design Blueprints](https://vuetifyjs.com/en/features/blueprints/)
- [Icon fonts](https://vuetifyjs.com/en/features/icon-fonts/)


## Quick Setup

1. Add `@invictus.codes/nuxt-vuetify` dependency to your project

```bash
# Using pnpm
pnpm add -D @invictus.codes/nuxt-vuetify

# Using yarn
yarn add --dev @invictus.codes/nuxt-vuetify

# Using npm
npm install --save-dev @invictus.codes/nuxt-vuetify
```

2. Add `@invictus.codes/nuxt-vuetify` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: [
    '@invictus.codes/nuxt-vuetify'
  ],
  vuetify: {
    /* vuetify options */
    vuetifyOptions: {
      // @TODO: list all vuetify options
    },

    moduleOptions: {
      /* nuxt-vuetify module options */
      treeshaking: true | false,
      useIconCDN: true | false,

      /* vite-plugin-vuetify options */
      styles: true | 'none' | 'expose' | 'sass' | { configFile: string },
      autoImport: true | false,
      useVuetifyLabs: true | false, 
    }
  }
})
```

That's it! You can now use Nuxt Vuetify in your Nuxt app ✨

## Nuxt-Vuetify options

| Scope          | Property name       | Accepted values                                                                                                         | Description                                                                                                                                                                                                       | Default | Origin                                                                                                                                                                                 |
|----------------|---------------------|-------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| moduleOptions  | treeshaking         | true, false                                                                                                             | Treeshaking enables you to drastically lower your build size by only including the components you actually use in the final bundle                                                                                | false   | Module                                                                                                                                                                                 |
| moduleOptions  | useIconCDN          | true, false                                                                                                             | Use a CDN to load the icons (only available for defaultSet '**mdi**', '**md**' and '**fa**')                                                                                                                      | true    | Module                                                                                                                                                                                 |
| moduleOptions  | styles              | true, <br/>'none', <br/>'expose', <br/>'sass', <br/>{ configFile: string }<br/><br/>Also refer to Vuetify documentation | - true: precompiled vuetify css<br/>- none: no styles are loaded<br/>- sass: sass styles are used<br/>- expose: sass styles are used<br/>- { configFile: '<your sass/scss-file here>' }: use your own styles file | true    | [Vuetify sass variables](https://vuetifyjs.com/en/features/sass-variables/)<br/><br/>[vite-plugin-vuetify](https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin) |
| moduleOptions  | autoImport          | true, false                                                                                                             | Auto imports the Vuetify components (only available with treeshaking)                                                                                                                                             | true    | [Nuxt 3 auto imports](https://nuxt.com/docs/guide/concepts/auto-imports)<br/><br/>[vite-plugin-vuetify](https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin)    |
| moduleOptions  | useVuetifyLabs      | true, false (does not work with treeshaking)                                                                            | Auto imports the Vuetify components (only available with treeshaking)                                                                                                                                             | true    | [Nuxt 3 auto imports](https://nuxt.com/docs/guide/concepts/auto-imports)<br/><br/>[vite-plugin-vuetify](https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin)    |
| vuetifyOptions | icons               | Refer to Vuetify documentation                                                                                          |                                                                                                                                                                                                                   |         | [Vuetify icon fonts](https://vuetifyjs.com/en/features/icon-fonts/)                                                                                                                    |

## Development

Make sure to be logged in with `gh auth login`, otherwise changelogen won't work.

```bash
# Install dependencies
npm install

# Generate type stubs
npm run dev:prepare

# Develop with the playground
npm run dev

# Build the playground
npm run dev:build

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Release new version
npm run release
```

## License

[MIT License](./LICENSE)

Copyright (c) Invictus.codes

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@invictus.codes/nuxt-vuetify/latest.svg?style=flat&colorA=18181B&colorB=28CF8D

[npm-version-href]: https://npmjs.com/package/@invictus.codes/nuxt-vuetify

[npm-downloads-src]: https://img.shields.io/npm/dm/@invictus.codes/nuxt-vuetify.svg?style=flat&colorA=18181B&colorB=28CF8D

[npm-downloads-href]: https://npmjs.com/package/@invictus.codes/nuxt-vuetify

[license-src]: https://img.shields.io/npm/l/@invictus.codes/nuxt-vuetify.svg?style=flat&colorA=18181B&colorB=28CF8D

[license-href]: https://npmjs.com/package/@invictus.codes/nuxt-vuetify
