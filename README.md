# 🧩 Perplex Image

> A beautiful, browser-based image puzzle game powered by Nuxt 3 and the Pexels photo API.

Perplex Image challenges you to reassemble a real photograph by dragging and swapping shuffled tiles. Choose your difficulty, race the clock, and put the picture back together — one piece at a time.

---

## ✨ Features

- 🖼️ **Real photos** — puzzles are generated from stunning images sourced via the [Pexels](https://www.pexels.com/) API
- 🎯 **Three difficulty levels** — 9 × 13, 15 × 23, or 18 × 26 tile grids
- 🖱️ **Drag & swap mechanics** — click and drag individual pieces or select multiple pieces and move them as a group
- ⏱️ **Stopwatch & move counter** — track how long it takes and how many moves you need
- ⏸️ **Pause / Resume** — take a break without losing your progress
- 🌍 **Internationalization** — i18n-ready for multiple languages
- 📱 **Responsive design** — works on desktop and tablet

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com/) (Vue 3) |
| State management | [Pinia](https://pinia.vuejs.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Icons | [nuxt-icon](https://github.com/nuxt-modules/icon) |
| i18n | [@nuxtjs/i18n](https://i18n.nuxtjs.org/) |
| Unit tests | [Vitest](https://vitest.dev/) + [Vue Test Utils](https://test-utils.vuejs.org/) |
| E2E tests | [Playwright](https://playwright.dev/) |
| Linting | ESLint + Prettier |
| Package manager | [pnpm](https://pnpm.io/) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** ≥ 8 (`npm install -g pnpm`)
- A free **Pexels API key** — get one at <https://www.pexels.com/api/>

### Installation

```bash
# Clone the repository
git clone https://github.com/makuchpatryk/perplex-image.git
cd perplex-image

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PEXELS_API_KEY=your_pexels_api_key_here
```

### Start the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 How to Play

1. **Home screen** — browse the photo gallery and click a picture you want to puzzle.
2. **Choose difficulty** — pick a grid size (easy → hard: 9 × 13, 15 × 23, 18 × 26).
3. **Solve the puzzle** — drag tiles to swap them back into their correct positions.
   - Hold **Shift** (or use the multi-select mode) to pick several tiles at once and move them as a group.
4. **Win!** — once every tile is in place the finish screen shows your time and move count.

---

## 📁 Project Structure

```
perplex-image/
├── modules/
│   ├── core/              # Shared composables, store, types & constants
│   │   ├── components/    # Core UI components
│   │   ├── composables/   # useImage, useStopwatch
│   │   ├── constants/     # Difficulty level definitions
│   │   ├── store/         # Pinia stores (images, pieces)
│   │   └── types/         # TypeScript interfaces
│   ├── game/              # Puzzle game module
│   │   ├── components/    # Piece, GameSidebar, PauseModal, FinishModal
│   │   ├── composables/   # useEventGame, useShuffle
│   │   ├── pages/         # Game route
│   │   └── views/         # MainView, GameView
│   └── ui/                # Generic UI primitives (Button, Modal, Select)
├── server/api/            # Nuxt server routes proxying the Pexels API
├── layouts/               # Nuxt layouts
├── assets/                # Global styles & images
├── public/                # Static assets
└── tests/                 # Unit & E2E test suites
```

---

## 🔌 API Endpoints

The app proxies all Pexels requests through two server-side routes so the API key is never exposed to the browser.

| Route | Method | Description |
|---|---|---|
| `/api/get-images?per_page=N` | GET | Returns a collection of photos (default 100) |
| `/api/get-image?id=ID` | GET | Returns a single photo by its Pexels ID |

---

## 🧪 Testing

```bash
# Run unit tests (Vitest)
pnpm test

# Run E2E tests (Playwright, headless)
pnpm test:e2e

# Run E2E tests with the interactive Playwright UI
pnpm test:e2e:ui

# Debug E2E tests step-by-step
pnpm test:e2e:debug
```

---

## 🧹 Code Quality

```bash
# Lint the codebase
pnpm lint

# Auto-fix linting & formatting issues
pnpm lintfix
```

---

## 📦 Building for Production

```bash
# Build the application
pnpm build

# Preview the production build locally
pnpm preview
```

For deployment options (Node server, static hosting, edge, etc.) see the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment).

---

## 📄 License

This project is open-source. See the [LICENSE](LICENSE) file for details.
