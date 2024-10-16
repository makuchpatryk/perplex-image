import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "path";
import type { Nuxt } from "@nuxt/schema";

export default defineNuxtModule({
  meta: {
    // Usually the npm package name of your module - in this case a local modal
    name: "core-module",
    // The key in `nuxt.config` that holds the
    configKey: "core-module",
    // Compatibility constraints
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: "^3.9.0",
    },
  },
  setup(options: any, nuxt: Nuxt) {
    nuxt.hook("components:dirs", (dirs) => {
      dirs.push({
        path: join(__dirname, "components"),
      });
    });

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "./composables"));
    });
  },
});
