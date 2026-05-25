# Plan: Unit Tests for All Composables

## Context

The project has zero unit tests — all coverage is Playwright E2E only. The goal is to add Vitest unit tests covering all 4 composables:

- `modules/core/composables/useStopwatch.ts`
- `modules/core/composables/useImage.ts`
- `modules/game/composables/useShuffle.ts`
- `modules/game/composables/useEventGame.ts`

## Core Challenge: Nuxt Auto-Imports & Async/Await Removal

All composables use `ref`, `computed`, `$fetch`, `useStopwatch`, `useImage` as implicit globals (Nuxt auto-imports). Vitest has no Nuxt runtime, so these must be stubbed via a setup file.

**Prerequisite:** Remove redundant `async/await` from all 4 composables:

- `useStopwatch.ts`: Change `export async function useStopwatch()` → `export function useStopwatch()`
- `useImage.ts`: Change `export async function useImage()` → `export function useImage()`
- `useShuffle.ts`: Change `async function useShuffle(...)` → `function useShuffle(...)`
- `useEventGame.ts`: Change `export async function useEventGame(...)` → `export function useEventGame(...)` and remove `await` from `const { ... } = useStopwatch()` and `const { shuffle } = useImage()`

These functions don't return promises, so async/await is redundant. Removing them clarifies unit test mocking.

---

## Step 1 — Fix `vitest.config.js`

Three changes:

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url"; // 1. ADD: was used but never imported

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/units/setup.ts"], // 2. ADD: global stub setup (CHANGED: units not unit)
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
      }, // 3. ADD
      { find: "~", replacement: fileURLToPath(new URL(".", import.meta.url)) }, // 3. ADD (must be after ~core)
    ],
  },
});
```

**Critical**: `~core` alias must appear before `~` — Vite uses first-match-wins.

---

## Step 2 — Create `tests/units/setup.ts`

```ts
import { ref, computed, reactive } from "vue";
import { vi } from "vitest";

// Stub Vue auto-imports
globalThis.ref = ref;
globalThis.computed = computed;
globalThis.reactive = reactive;

// Stub Nuxt's $fetch
globalThis.$fetch = vi.fn();

// Stub composable auto-imports used inside game composables
globalThis.useStopwatch = vi.fn();
globalThis.useImage = vi.fn();
```

---

## Step 3 — Test Files Structure

```
tests/
  e2e/
    ...
  units/
    setup.ts                          # Global stubs (ref, computed, $fetch, etc.)
    mocks/
      fixtures.ts                     # Shared test factories
    useStopwatch.test.ts
    useImage.test.ts
    useShuffle.test.ts
    useEventGame.test.ts
```

---

## Step 4 — Test Cases Per Composable

### `useStopwatch.test.ts`

Use `vi.useFakeTimers()` + `vi.setSystemTime()` in `beforeEach`, `vi.useRealTimers()` in `afterEach`.

| #   | Test                                                                         |
| --- | ---------------------------------------------------------------------------- |
| 1   | Initial `displayTime` is `"00:00:00"`                                        |
| 2   | After `startStopwatch` + 1s advance → `"00:00:01"`                           |
| 3   | After 65s → `"00:01:05"`                                                     |
| 4   | After 3600s → `"01:00:00"`                                                   |
| 5   | `startStopwatch` is idempotent (calling twice doesn't double-tick)           |
| 6   | `stopStopwatch` freezes display — advancing time after stop has no effect    |
| 7   | Pause/resume: 3s elapsed → stop → 10s idle → resume → 2s more → `"00:00:05"` |
| 8   | `resetStopwatch` resets `displayTime` to `"00:00:00"`                        |
| 9   | After reset, a new `startStopwatch` counts from zero                         |
| 10  | `updateStopwatch` called manually reflects current elapsed time              |

### `useImage.test.ts`

`shuffle`:

- Returns same array instance (in-place mutation)
- Elements are preserved (same set, possibly different order)
- Deterministic with `vi.spyOn(Math, 'random').mockReturnValue(0)`
- Handles empty array without throwing
- Handles single-element array

`imageToBase64`:

- Calls `$fetch` with the provided URL
- Passes base64 result to callback via FileReader mock
- Passes `null` to callback when FileReader result is null

**FileReader strategy**: Replace `globalThis.FileReader` constructor with a vi mock that calls `onloadend` asynchronously (via `nextTick()`) inside `readAsDataURL`. This matches real FileReader timing and tests async behavior correctly.

### `useShuffle.test.ts`

Mock `globalThis.useImage` in `beforeEach` to return `{ shuffle: arr => arr }` (identity — no reorder) for predictable piece ordering.

| #   | Test                                                                                       |
| --- | ------------------------------------------------------------------------------------------ |
| 1   | Piece count for `9x13` with 800×1200 image → 54 (cols=9, rows=round(0.667×9)=6)            |
| 2   | Piece count for `15x23` → 150 (cols=15, rows=10)                                           |
| 3   | Piece count for `18x26` → 216 (cols=18, rows=12)                                           |
| 4   | Every `originalIndex` equals its creation index (0..N-1)                                   |
| 5   | With identity shuffle: `position === originalIndex` for all pieces                         |
| 6   | `piece.width` equals `(1000 - cols*2) / cols` px                                           |
| 7   | `piece.height` equals aspect-ratio-derived value px                                        |
| 8   | `backgroundPosition` format: `-{col*w}px -{row*h}px`                                       |
| 9   | With reverse shuffle: `position` equals index in returned array (re-indexed after shuffle) |
| 10  | With reverse shuffle: positions are a permutation of 0..N-1                                |
| 11  | With reverse shuffle: `originalIndex` is NOT re-assigned (piece[0].originalIndex = N-1)    |

### `useEventGame.test.ts`

In `beforeEach`, configure mocks:

```ts
const mockStopwatchApi = {
  startStopwatch: vi.fn(),
  stopStopwatch: vi.fn(),
  resetStopwatch: vi.fn(),
  displayTime: ref("00:00:00"),
};
globalThis.useStopwatch.mockReturnValue(mockStopwatchApi);
globalThis.useImage.mockReturnValue({ shuffle: (arr) => arr }); // identity shuffle
```

**Initialization:**

- Calls `useStopwatch` (no await — it's now sync)
- Exposes stopwatch API passthrough (displayTime, start, stop, reset)

**`toggleSelection`:**

- Without multi: selects unselected position
- Without multi: deselects already-selected position
- Without multi: replaces existing multi-selection with single position
- With multi: adds to selection
- With multi: removes already-selected position

**`clearSelection` / `clearHighlight`:**

- Each empties the respective array on `data`

**`onSwap` → single path (no `selectedPositions` or only 1):**

- Swaps `position` fields between the two pieces by slot lookup
- Increments `data.moves` by 1
- Does nothing when `position === positionCurrent`
- Calls `openModal` + `stopStopwatch` when puzzle becomes solved
- Does NOT call `openModal` when puzzle is still unsolved

**`onSwap` → group path (`selectedPositions.length > 1` and dragged piece is in selection):**

- Moves all selected pieces by offset (targetPos - draggedPos)
- Displaced pieces go to freed source slots
- Updates `data.selectedPositions` to new target slots
- Increments `data.moves` by 1

**`onDragEnd`:**

- Clears `data.highlightPositions`

---

## Step 5 — Mocking Strategy for Game Composable Globals

- `globalThis.useStopwatch` and `globalThis.useImage` are installed as `vi.fn()` once in setup.ts
- In `beforeEach`, call `.mockReturnValue(...)` on these stubs with plain objects (after removing async/await, they are no longer promises)
- Do NOT reassign `globalThis.useStopwatch = vi.fn()` — the composable captures the global reference at parse time
- Fresh `ref()` instances in each `beforeEach` prevents reactive state bleed between tests

---

## Step 6 — Key Gotchas

- **`onDragEnter` uses `setTimeout(..., 0)`**: Test it with real timers by awaiting `new Promise(r => setTimeout(r, 10))` after calling `onDragEnter`, then assert state changes. This ensures the timeout fires and matches real-world behavior.
- **`onSingleSwap` looks up pieces by `position` field** (not array index). Test fixtures must have `position` set correctly.
- **`onGroupSwap` validates via `isGroupMoveValid`** before mutating — invalid moves clear highlight and return early without changing pieces or moves.
- **Level enum**: `LevelsKeys["9x13"]`, `["15x23"]`, `["18x26"]` with cols 9, 15, 18 respectively.

---

## Step 7 — Shared Test Fixtures (`tests/units/mocks/fixtures.ts`)

Create a factory function for building test pieces/game data:

```ts
import type { ImagePieces, GameData } from "~core/types";

/**
 * Create test pieces array. Each piece has position, originalIndex, and other required fields.
 * @param count Total number of pieces
 * @returns Array of pieces with position === originalIndex (solved state)
 */
export function createTestPieces(count: number): ImagePieces[] {
  return Array.from({ length: count }, (_, i) => ({
    position: i,
    originalIndex: i,
    width: "100px",
    height: "100px",
    backgroundPosition: `0px 0px`,
  }));
}

/**
 * Create game data object with default/empty state.
 */
export function createTestGameData(
  shuffledPieces: ImagePieces[] = []
): GameData {
  return {
    shuffledPieces,
    selectedPositions: [],
    highlightPositions: [],
    moves: 0,
    height: 1200,
    width: 800,
  };
}

/**
 * Create a reverse-order shuffle: last piece goes first, etc.
 */
export function createReverseShuffle(pieces: ImagePieces[]): ImagePieces[] {
  const reversed = [...pieces].reverse();
  return reversed.map((piece, idx) => ({
    ...piece,
    position: idx,
  }));
}
```

Each test imports only the factories it needs.

---

## Step 8 — Verification

```bash
pnpm test                          # run all unit tests
pnpm test tests/unit/useStopwatch  # single file
pnpm test --coverage               # with V8 coverage
```

---

## Critical Files

| Action                            | Path                                                               |
| --------------------------------- | ------------------------------------------------------------------ |
| Modify                            | `vitest.config.js`                                                 |
| Modify                            | `modules/core/composables/useStopwatch.ts` (remove async/await)    |
| Modify                            | `modules/core/composables/useImage.ts` (remove async/await)        |
| Modify                            | `modules/game/composables/useShuffle.ts` (remove async/await)      |
| Modify                            | `modules/game/composables/useEventGame.ts` (remove async/await)    |
| Create                            | `tests/units/setup.ts`                                             |
| Create                            | `tests/units/mocks/fixtures.ts`                                    |
| Create                            | `tests/units/useStopwatch.test.ts`                                 |
| /`tests/units/useShuffle.test.ts` |
| Create                            | `tests/units/useEventGame.test.ts`                                 |
| Reference                         | `modules/core/constants/index.ts` (WIDTH_GAME, Levels, LevelsKeys) |
| Reference                         | `modules/core/types/index.ts` (ImagePieces, GameData, etc.)        |
