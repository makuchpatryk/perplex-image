import { defineNuxtModule } from "@nuxt/kit";
import { join } from "path";
import type { Nuxt } from "@nuxt/schema";

export default defineNuxtModule({
  meta: {
    name: "ui-module",
    configKey: "ui-module",
    compatibility: {
      nuxt: "^3.9.0",
    },
  },
  setup(_options: Record<string, unknown>, nuxt: Nuxt) {
    // Auto register components
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nuxt.hook("components:dirs", (dirs: any) => {
      dirs.push({ path: join(__dirname, "components") });
    });
  },
});
