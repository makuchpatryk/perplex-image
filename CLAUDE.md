# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PerplexImage** is a puzzle game built with Nuxt 3 where players complete image puzzles fetched from the Pexels API. The game supports three difficulty levels (9x13, 15x23, 20x30 tiles) with drag-and-drop gameplay, timers, move counters, and responsive design.

**Tech Stack:**

- **Framework:** Nuxt 3 with Vue 3 Composition API
- **Language:** TypeScript
- **State Management:** Pinia
- **Styling:** Tailwind CSS
- **UI Icons:** nuxt-icon
- **Internationalization:** @nuxtjs/i18n
- **Testing:** Playwright (E2E), Vitest (Unit)
- **API:** Pexels API for puzzle images
- **Code Quality:** ESLint, Prettier
- **Pre-commit Hooks:** Husky + lint-staged

## Common Development Commands

### Setup

```bash
pnpm install              # Install dependencies
pnpm postinstall          # Nuxt prepare (auto-run after install)
```

### Development

```bash
pnpm dev                  # Start dev server (http://localhost:3000)
pnpm build                # Build for production
pnpm preview              # Preview production build locally
```

### Code Quality

```bash
pnpm lint                 # Run ESLint check
pnpm lintfix              # Auto-fix ESLint + Prettier issues
pnpm lint:eslint          # ESLint only
pnpm lint:prettier        # Prettier check only
```

### Testing

```bash
pnpm test                 # Run unit tests (Vitest)
pnpm test:e2e             # Run E2E tests (Playwright)
pnpm test:e2e:ui          # Run E2E tests with interactive UI
pnpm test:e2e:debug       # Run E2E tests in debug mode
```

### Troubleshooting

```bash
# If tests fail due to missing browsers
npx playwright install

# View test report after running tests
npx playwright show-report
```

## Architecture & Module Structure

The project is organized into three core modules under `/modules`:

### `/modules/core` — Shared utilities and state

- **store/** — Pinia store for image management and game state (`useImagesStore`)
- **composables/** — Reusable logic (`useImage`, `useStopwatch`)
- **types/** — TypeScript interfaces and types
- **components/** — Shared UI components
- **constants/** — Application constants

### `/modules/game` — Game-specific features

- **pages/** — Nuxt pages (`index.vue` for home, `game/[...id].vue` for game)
- **views/** — Page-level components (`MainView`, `GameView`)
- **components/** — Game UI components (`Piece`, `GameSidebar`, `SelectImageModal`, `PauseModal`, `FinishModal`)
- **composables/** — Game logic (`useEventGame`, `useShuffle`)
- **types/** — Game-specific types

### `/modules/ui` — Reusable UI components

- **components/** — Generic UI components (`UiButton`, `UiModal`, `UiAdvancedSelect`)

### Other directories

- `/assets` — Images, fonts, and static assets
- `/layouts` — Nuxt layout templates
- `/server/api` — Backend API routes (proxies Pexels API)
- `/tests/e2e` — Playwright E2E tests
- `/public` — Static files served directly

## Key Patterns & Conventions

### State Management (Pinia)

State is centralized in `modules/core/store/images.ts`. Actions handle:

- Fetching images from the API
- Managing selected puzzle image
- Shuffling and storing puzzle pieces

Access the store in components using:

```typescript
const store = useImagesStore();
```

### Composables

- `useImage()` — Image loading and processing
- `useStopwatch()` — Timer functionality
- `useEventGame()` — Game event handling
- `useShuffle()` — Puzzle piece shuffling

### Types

Core types are defined in:

- `modules/core/types/index.ts` — Shared types (`PexelPhoto`, `ImagePieces`, `Difficulty`)
- `modules/game/types/index.ts` — Game-specific types

### API Integration

- API routes are defined in `/server/api` and proxy the Pexels API
- Configured via `PEXELS_API_KEY` environment variable in `nuxt.config.ts`
- Security headers (CSP, X-Frame-Options, etc.) are enforced in `routeRules`

### Styling

- Tailwind CSS is used for all styling
- Components use class-based styling (no scoped CSS)
- Responsive design is tested across mobile (375x667), tablet (768x1024), and desktop (1920x1080) viewports

### Internationalization (i18n)

- Configured in `i18n.config.ts`
- Used in components for multi-language support
- Default language can be set in config

## Testing

### E2E Tests (Playwright)

Located in `/tests/e2e/`:

- `main.spec.ts` — Core functionality tests (31+ tests)
- `advanced.spec.ts` — Advanced tests with fixtures (14 test groups)
- `fixtures.ts` — Reusable test fixtures for common flows

**Test Coverage:**

- Home page interaction and image selection
- Game gameplay (drag/drop, pause, timer)
- Responsive design across viewports
- Error handling and network timeouts
- Performance (page load times)

**Run tests:**

```bash
pnpm test:e2e                    # Headless across all browsers
pnpm test:e2e:ui                 # Interactive test runner
pnpm test:e2e:debug              # Debug mode with inspector
npx playwright test --headed     # Visible browser
npx playwright test --project=chromium  # Single browser
```

### Unit Tests (Vitest)

- Configured in `vitest.config.js`
- Run with `pnpm test`
- Uses jsdom environment

### Pre-commit Hooks

- Husky runs lint-staged before commits
- Only lints files in `/modules/**/*.{ts,vue}`
- Failing lints block commits

## Development Workflow

### Adding Features

1. Create components or logic in the appropriate module
2. Use Pinia store for shared state
3. Extract reusable logic into composables
4. Write E2E tests in `/tests/e2e` to verify user flows
5. Run linting: `pnpm lintfix`
6. Run tests: `pnpm test:e2e:ui`

### Debugging

- Use `pnpm test:e2e:debug` to step through E2E tests
- Use browser DevTools in dev mode (`pnpm dev`)
- Check Playwright test reports: `npx playwright show-report`

### Code Review Checklist

- [ ] TypeScript types are proper (no `any`)
- [ ] Component props are typed
- [ ] Composable return types are explicit
- [ ] No unused imports or variables
- [ ] Linting passes: `pnpm lint`
- [ ] E2E tests pass: `pnpm test:e2e`
- [ ] Responsive design tested on mobile/tablet/desktop

## Environment Variables

Required for development:

```
PEXELS_API_KEY=your_pexels_api_key
```

This is set in `nuxt.config.ts` as `runtimeConfig.pexelsApiKey` and accessed via `$fetch` in API routes.

## Important Notes

- **Module Auto-registration:** Modules under `/modules` are auto-imported via Nuxt conventions. Module `index.ts` files define what's exported.
- **Path Aliases:** Use `@core`, `@ui`, `@game` in imports (configured in `vitest.config.js` and Nuxt defaults)
- **CSS Nesting:** Tailwind is configured with autoprefixer; no need for vendor prefixes
- **Game Logic:** Puzzle piece shuffling and drag-drop interaction is handled in composables, separate from UI components for testability
- **API Proxy:** Backend API routes prevent direct frontend-to-Pexels communication and enforce security headers

## TypeScript Standards

- Every implementation task must pass `pnpm typecheck` before considered done.
- No `any` types allowed. Always use explicit types. If the correct type is unclear, ask — never guess.
- When fixing or implementing features, look for opportunities to improve TypeScript correctness (e.g.
  tighten loose types, replace type assertions with proper narrowing, add missing return types). Apply  
  these if the improvement is clear and safe.
