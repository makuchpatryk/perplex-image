// @ts-expect-error Nuxt types not required for auto-discovery
import { defineNuxtModule } from "@nuxt/kit";
import { resolve, join } from "path";
// @ts-expect-error Nuxt schema types
import type { Nuxt } from "@nuxt/schema";

export default defineNuxtModule({
  meta: {
    name: "core-module",
    configKey: "core-module",
    compatibility: {
      nuxt: "^3.9.0",
    },
  },
  setup(_options: Record<string, unknown>, nuxt: Nuxt) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nuxt.hook("components:dirs", (dirs: any) => {
      dirs.push({
        path: join(__dirname, "components"),
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nuxt.hook("imports:dirs", (dirs: any) => {
      dirs.push(resolve(__dirname, "./composables"));
    });
  },
});
