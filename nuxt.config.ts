// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    devProxy: {
      "/api": {
        target: "https://demo.uniqcarttest.tk",
        changeOrigin: true,
      },
    },
  },
})
