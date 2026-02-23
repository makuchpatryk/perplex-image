import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "path";
import type { Nuxt } from "@nuxt/schema";

export default defineNuxtModule({
  meta: {
    name: "game-module",
    configKey: "game-module",
    compatibility: {
      nuxt: "^3.9.0",
    },
  },
  setup(_options: Record<string, unknown>, nuxt: Nuxt) {
    // Auto register components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nuxt.hook("components:dirs", (dirs: any) => {
      dirs.push({ path: join(__dirname, "components") });
      dirs.push({ path: join(__dirname, "views") });
    });

    // Auto register composables
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nuxt.hook("imports:dirs", (dirs: any) => {
      dirs.push(resolve(__dirname, "./composables"));
    });

    // Auto register pages
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nuxt.hook("pages:extend", (pages: any) => {
      pages.push({
        name: "index",
        path: "/",
        file: resolve(__dirname, "./pages/index.vue"),
      });
      pages.push({
        name: "game",
        path: "/game/:id",
        file: resolve(__dirname, "./pages/game/[...id].vue"),
      });
    });
  },
});
