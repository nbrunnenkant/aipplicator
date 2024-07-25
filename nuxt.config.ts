// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    runtimeConfig: {
        public: {
            openAiApiKey: ''
        },
    },
    future: {
        compatibilityVersion: 4,
    },

    devtools: { enabled: true },
    modules: ["@nuxtjs/tailwindcss", '@pinia/nuxt'],
    tailwindcss: {
        config: {
            plugins: [require('daisyui')],
            theme: {
                fontFamily: {
                    sans: ['"CommitMono"'],
                    mono: ['"CommitMono"'],
                }
            }
        }
    }
})
