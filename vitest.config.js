import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/units/setup.ts"],
    include: ["tests/units/**/*.test.ts"],
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
      {
        find: "~core",
        replacement: fileURLToPath(new URL("./modules/core", import.meta.url)),
      },
      {
        find: "~",
        replacement: fileURLToPath(new URL(".", import.meta.url)),
      },
    ],
  },
});
