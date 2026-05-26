# PerplexImage

Puzzle game built with Nuxt 3. Players complete image puzzles fetched from Pexels API with drag-and-drop gameplay, timers, and move counters.

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Three difficulty levels:** 9×13, 15×23, 20×30 tiles
- **Drag-and-drop gameplay:** Move puzzle pieces to complete the image
- **Real-time stats:** Timer and move counter
- **Responsive design:** Works on mobile, tablet, and desktop
- **Image selection:** Browse and select from Pexels API
- **Game controls:** Pause, reset, and view progress

## Tech Stack

- **Nuxt 3** + Vue 3 Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **Tailwind CSS** for styling
- **Playwright** for E2E testing
- **Vitest** for unit testing
- **Pexels API** for puzzle images

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Interactive test UI
pnpm lint             # Check code quality
pnpm lintfix          # Auto-fix linting issues
pnpm typecheck        # TypeScript validation
```

## Project Structure

```
/modules
  /core        - Shared utilities, store, types
  /game        - Game pages, components, logic
  /ui          - Generic UI components
/tests
  /e2e         - Playwright E2E tests
  /units       - Vitest unit tests
/server/api    - Backend API routes (Pexels proxy)
```

## Environment Setup

Requires `PEXELS_API_KEY` environment variable. Add to `.env`:

```
PEXELS_API_KEY=your_pexels_api_key
```

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed architecture, testing patterns, and development workflow.

## Testing

All changes must pass:

- TypeScript: `pnpm typecheck`
- Unit tests: `pnpm test`
- E2E tests: `pnpm test:e2e`
- Linting: `pnpm lint`

Pre-commit hooks (Husky) enforce linting automatically.
