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
  tailwindcss: {
    config: {
      theme: {
        extend: {
          animation: {
            moving: "moving 5s ease infinite",
          },
        },
        keyframes: {
          moving: {
            "0%, 100%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
          },
        },
      },
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
