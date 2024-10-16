// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: "Perplex Image",
      charset: "utf-16",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "description", content: "Perplex Image" }],
    },
  },
  modules: ["@vueuse/nuxt", "@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-icon"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    server: {
      hmr: {
        clientPort: 3000,
      },
    },
  },
});
