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
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-icon"],
  plugins: [{ src: "~/plugins/directive", mode: "all" }],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
