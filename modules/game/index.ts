import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "path";
import type { Nuxt } from "@nuxt/schema";
import type { TODO } from "../core/types";

export default defineNuxtModule({
  meta: {
    // Usually the npm package name of your module - in this case a local modal
    name: "game-module",
    // The key in `nuxt.config` that holds the
    configKey: "game-module",
    // Compatibility constraints
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: "^3.9.0",
    },
  },
  setup(options: TODO, nuxt: Nuxt) {
    // Auto register components
    nuxt.hook("components:dirs", (dirs: TODO) => {
      dirs.push({
        path: join(__dirname, "components"),
      });
      dirs.push({
        path: join(__dirname, "views"),
      });
    });

    // Auto register composables
    nuxt.hook("imports:dirs", (dirs: TODO) => {
      dirs.push(resolve(__dirname, "./composables"));
    });

    // Auto register pages
    nuxt.hook("pages:extend", (pages: TODO) => {
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
