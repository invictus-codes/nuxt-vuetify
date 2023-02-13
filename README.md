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
- 🌳 &nbsp;Treeshaking built-in (vite, off by default)

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
    // @TODO: list all vuetify options
    
    /* nuxt-vuetify module options */
    treeshaking: true | false, 
      
    /* vite-plugin-vuetify options */
    // only available if treeshaking is enabled:
    autoImport: true | false,
    // only available if treeshaking is enabled:
    styles: true | 'none' | 'expose' | 'sass' | { configFile: string },
  }
})
```

That's it! You can now use Nuxt Vuetify in your Nuxt app ✨

## Development

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
