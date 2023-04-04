// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@element-plus/nuxt'],
  runtimeConfig: {
    public: {
      //backendUri: 'http://10.9.88.41:3001/v1/api',
      backendUri: 'http://127.0.0.1:3001/v1/api',
    },
  },
})
