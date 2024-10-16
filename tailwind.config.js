/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./modules/**/*.{js,vue,ts}",
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./nuxt.config.{js,ts}",
  ],
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
  plugins: [],
};
