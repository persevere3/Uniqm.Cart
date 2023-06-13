// demo, common, uniqm.com, uniqm.net
let webVersion = 'demo'

// publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
  ],
  nitro: {
    devProxy: {
      "/api": {
        target: "https://demo.uniqcarttest.com",
        changeOrigin: true,
      },
    },
  },
})
