// demo, common, uniqm.com, uniqm.net
let webVersion = 'demo'

// publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  link: [
    { rel: 'stylesheet', type: 'text/css', href: 'https://unpkg.com/swiper@8/swiper-bundle.css'}
  ],
  script: [
    {
      type: 'text/javascript',
      src: 'https://unpkg.com/swiper@8/swiper-bundle.js'
    }
  ],
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
