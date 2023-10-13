// demo, common, uniqm.com, uniqm.net
let webVersion = 'demo'

// publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    webVersion.indexOf('uniqm') < 0 
      ? '@/assets/scss/_all.scss'
      : '@/assets/scss/_uniqm_all.scss'
    ,
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: webVersion.indexOf('uniqm') < 0
            ? ` @import "@/assets/scss/mixin/_common.scss";
                @import "@/assets/scss/_variable.scss";
            `
            : ` @import "@/assets/scss/mixin/_common.scss";
                @import "@/assets/scss/_uniqm_variable.scss"; 
            `
          },
      },
    },
  },
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
