// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-06-07",

  runtimeConfig: {
    pexelsApiKey: process.env.PEXELS_API_KEY ?? "",
  },

  app: {
    head: {
      title: "Perplex Image",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ name: "description", content: "Perplex Image" }],
      link: [
        {
          rel: "preconnect",
          href: "https://fonts.googleapis.com",
        },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap",
        },
      ],
    },
  },

  modules: [
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-icon",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
  },

  vite: {
    server: {
      hmr: {
        clientPort: 3000,
      },
    },
  },

  eslint: {
    // options here
  },

  routeRules: {
    "/api/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      },
    },
    "/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        "Content-Security-Policy":
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline'; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "img-src 'self' data: blob: https://images.pexels.com https://www.pexels.com; " +
          "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://images.pexels.com ws: wss:; " +
          "font-src 'self' https://fonts.gstatic.com; " +
          "object-src 'none'; " +
          "base-uri 'self'; " +
          "form-action 'self'; " +
          "frame-ancestors 'none';",
      },
    },
  },
});