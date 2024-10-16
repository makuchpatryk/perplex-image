import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "@core",
        replacement: fileURLToPath(new URL("./modules/core", import.meta.url)),
      },
      {
        find: "@ui",
        replacement: fileURLToPath(new URL("./modules/ui", import.meta.url)),
      },
      {
        find: "@game",
        replacement: fileURLToPath(new URL("./modules/game", import.meta.url)),
      },
    ],
  },
});
