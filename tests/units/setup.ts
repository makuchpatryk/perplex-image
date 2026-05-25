import { vi } from "vitest";

// Nuxt auto-imports are already declared in .nuxt/types/imports.d.ts
// Only stub composables that are used but not auto-imported in tests
(globalThis as Record<string, unknown>).useStopwatch = vi.fn();
(globalThis as Record<string, unknown>).useImage = vi.fn();
