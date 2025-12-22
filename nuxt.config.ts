import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  css: ['~/assets/styles/main.scss'],
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  runtimeConfig: {
    ycAccessKeyId: process.env.YC_KEY_ID,
    ycSecretAccessKey: process.env.YC_SECRET,
    ycBucket: process.env.YC_BUCKET,
    zoomToken: process.env.ZOOM_TOKEN,
    dadataToken: process.env.DADATA_TOKEN,
    public: {
      adminEmails: process.env.NUXT_PUBLIC_ADMIN_EMAILS,
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    ['@nuxtjs/google-fonts', {
      families: {
        Montserrat: [100, 200, 300, 400, 500, 600, 700, 800, 900]
      }
    }],
    "@pinia/nuxt",
    '@vite-pwa/nuxt',
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  devServer: {
    port: 3011,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'auto',

    manifest: {
      name: 'Сколько - рекрутинговая платформа',
      short_name: 'Сколько',
      description: 'Nuxt 4 PWA',
      theme_color: '#1e8d99',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      lang: 'ru',
      icons: [
        {
          src: '/pwa-192-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        // {
        //   src: '/pwa-512x512-maskable.png',
        //   sizes: '512x512',
        //   type: 'image/png',
        //   purpose: 'maskable'
        // }
      ]
    },

    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
  },
})
