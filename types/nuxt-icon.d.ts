import type { Ref } from "vue";

declare module "#imports" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useAppConfig(): any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function useNuxtApp(): any;
  export function useState<T>(key: string, init?: () => T): Ref<T>;
}
