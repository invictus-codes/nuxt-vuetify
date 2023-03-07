import aliases from './src/helpers/fontawesome/aliases'

export default defineNuxtConfig({
    modules: ['@invictus.codes/nuxt-vuetify'],
    app: {
        baseURL: process.env.BASE_URL || '/',
    },
    ssr: true,
    vuetify: {
        vuetifyOptions: {
            icons: {
                defaultSet: 'FontAwesomeIcon',
                aliases,
                sets: {}
            },
        },
        moduleOptions: {
            treeshaking: true,
            useIconCDN: true,
        },
    },
})
