# PerplexImage E2E Tests Documentation

## 📋 Overview

Comprehensive end-to-end testing suite for PerplexImage using Playwright. Tests cover all major user flows, game interactions, responsive design, and error handling.

## 🚀 Getting Started

### Installation

All dependencies are already installed as part of project setup:

```bash
pnpm install
```

If Playwright is not installed, run:

```bash
pnpm add -D @playwright/test
```

### Configuration

The Playwright configuration is defined in `playwright.config.ts`:

- **Test Directory**: `tests/e2e`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit
- **Screenshots**: Captured on failures only
- **Traces**: Recorded on first retry
- **Auto-start Dev Server**: Yes (via `pnpm dev`)

## 📝 Test Files

### 1. `main.spec.ts` - Core Functionality Tests

Main test suite covering essential features:

#### Home Page & Image Selection
- ✅ Load home page and verify title
- ✅ Display difficulty level options
- ✅ Select difficulty level
- ✅ Load images from API
- ✅ Open image selection modal
- ✅ Start game with selected image and difficulty

#### Game Page & Puzzle Gameplay
- ✅ Load game page with puzzle pieces
- ✅ Display game sidebar with timer
- ✅ Allow dragging puzzle pieces
- ✅ Display pause button and handle pause modal
- ✅ Update move counter when pieces are swapped

#### Game Controls & Navigation
- ✅ Navigate back to home page
- ✅ Display game completion modal

#### Responsive Design
- ✅ Mobile viewport (375x667)
- ✅ Tablet viewport (768x1024)
- ✅ Desktop viewport (1920x1080)

#### Error Handling
- ✅ Handle loading errors gracefully
- ✅ Handle network timeout gracefully

#### Performance
- ✅ Load home page within acceptable time
- ✅ Load game page within acceptable time

### 2. `advanced.spec.ts` - Advanced Tests with Fixtures

Advanced test suite using custom fixtures for cleaner code:

#### Game Flow Tests
- ✅ Complete game flow from home to game
- ✅ Test all difficulty levels

#### Game Interaction Tests
- ✅ Test piece interaction and movement
- ✅ Test pause and resume functionality
- ✅ Test timer functionality
- ✅ Test move counter

#### UI & UX Tests
- ✅ Test responsive game layout
- ✅ Test image selection flow

#### State Management Tests
- ✅ Test image selection persistence

#### Navigation Tests
- ✅ Test back navigation
- ✅ Test direct navigation with ID

### 3. `fixtures.ts` - Custom Test Fixtures

Reusable fixtures for common operations:

- `navigateToHome()` - Navigate to home page
- `selectDifficultyLevel(level)` - Select difficulty level
- `startGame()` - Start game
- `selectDifficulty9x13()` - Select 9x13 level
- `selectDifficulty15x23()` - Select 15x23 level
- `selectDifficulty18x26()` - Select 18x26 level

## ▶️ Running Tests

### Run all tests

```bash
pnpm test:e2e
```

### Run tests in UI mode (interactive)

```bash
pnpm test:e2e:ui
```

This opens the Playwright Inspector UI where you can:
- See test execution step-by-step
- Pick elements on the page
- View test logs and traces
- Debug individual tests

### Run tests in debug mode

```bash
pnpm test:e2e:debug
```

### Run specific test file

```bash
npx playwright test tests/e2e/main.spec.ts
```

### Run tests matching a pattern

```bash
npx playwright test -g "Home Page"
```

### Run tests in headless mode (default)

```bash
pnpm test:e2e
```

### Run tests with visible browser

```bash
npx playwright test --headed
```

### Run tests on specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Generate test report

After tests run:

```bash
npx playwright show-report
```

This opens an interactive HTML report with test results, screenshots, and traces.

## 🔍 Test Structure

### Basic Test Example

```typescript
test('should load home page', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  const title = page.locator('text=Perplex Image');
  await expect(title).toBeVisible();
});
```

### Test with Fixtures Example

```typescript
test('test game flow', async ({
  page,
  navigateToHome,
  selectDifficulty9x13,
  startGame,
}) => {
  await navigateToHome();
  await selectDifficulty9x13();
  await startGame();
  
  expect(page.url()).toContain('/game/');
});
```

## 📊 Test Metrics

### Total Test Count
- **main.spec.ts**: 13 test groups
- **advanced.spec.ts**: 14 test groups
- **Total**: 27+ comprehensive tests

### Coverage Areas
1. ✅ Home page functionality
2. ✅ Image selection
3. ✅ Game initialization
4. ✅ Puzzle interaction
5. ✅ Timer tracking
6. ✅ Move counting
7. ✅ Pause/Resume
8. ✅ Navigation
9. ✅ Responsive design
10. ✅ Error handling
11. ✅ Performance

## 🎯 Key Testing Strategies

### 1. **User Flow Testing**
Tests simulate actual user journeys from home page through game completion.

### 2. **Interaction Testing**
Tests verify drag-and-drop, button clicks, and form inputs work correctly.

### 3. **Responsive Testing**
Tests run on multiple viewport sizes to ensure mobile, tablet, and desktop compatibility.

### 4. **Performance Testing**
Tests measure page load times and ensure acceptable performance.

### 5. **Error Handling**
Tests verify application handles API failures and network timeouts gracefully.

### 6. **State Management**
Tests verify selected images and game state persist across navigation.

## 🛠️ Debugging Tests

### Enable trace recording

```bash
npx playwright test --trace on
```

Traces capture network activity, DOM snapshots, and console logs.

### View traces

```bash
npx playwright show-trace trace.zip
```

### Take screenshots during tests

Screenshots are automatically taken on failures. Enable for all tests:

```typescript
use: {
  screenshot: 'on',  // 'on', 'only-on-failure', or 'off'
}
```

### Use Playwright Inspector

```bash
PWDEBUG=1 pnpm test:e2e
```

This launches Playwright Inspector allowing you to step through tests.

## 📱 Browser Support

Tests run on:
- **Chromium** - Desktop Chrome/Edge compatible
- **Firefox** - Desktop Firefox compatible
- **WebKit** - Safari compatible

Each browser is tested independently, ensuring cross-browser compatibility.

## ⚙️ Configuration Details

### Timeouts
- **Navigation**: 30 seconds
- **API Calls**: 30 seconds
- **Default Action**: 5 seconds

### Retries
- **CI Environment**: 2 retries
- **Local Development**: 0 retries (fail fast)

### Parallelization
- **Local**: All workers available
- **CI**: 1 worker (slower but more stable)

## 📚 Locator Strategies

Tests use various locator strategies:

```typescript
// By text content
page.locator('text=Perplex Image')

// By role
page.locator('[role="dialog"]')

// By CSS class
page.locator('[class*="piece"]')

// By attribute
page.locator('input[value="9x13"]')

// Combined
page.locator('button').filter({ hasText: /Start|Play/i })
```

## 🐛 Troubleshooting

### Tests timeout
- Increase `navigationTimeout` in config
- Check if dev server is running on port 3000
- Check network connectivity

### Selectors not found
- Use `npx playwright codegen` to generate locators
- Use `--ui` mode to inspect elements
- Check if element is visible before interacting

### API fails
- Ensure Pexels API key is valid in `server/api/get-images.ts`
- Check internet connection
- API rate limiting might occur

### Tests fail on CI
- Ensure dev server starts properly
- Add longer waits for slower environments
- Check for timezone-dependent tests

## 🔐 CI/CD Integration

To run tests in CI pipeline:

```yaml
# Example GitHub Actions
- name: Run E2E tests
  run: pnpm test:e2e
```

Tests automatically:
- Start dev server
- Run on all browsers
- Retry on failure
- Generate HTML report

## 📖 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Performance Testing](https://playwright.dev/docs/api/class-browserconsumeoptions)

## 📝 Notes

- Tests require dev server running on `http://localhost:3000`
- Tests use real Pexels API (ensure API key is valid)
- Tests are idempotent and can run multiple times
- Screenshots and traces are stored in `test-results/` directory

## 🎓 Learning Path

1. **Start**: Run `pnpm test:e2e:ui` to see tests visually
2. **Explore**: Open HTML report with `npx playwright show-report`
3. **Debug**: Run specific test with `--debug` flag
4. **Modify**: Edit tests to match your application flow
5. **Extend**: Add new tests for additional features

---

Created: February 23, 2026
Framework: Playwright v1.58.2
Project: PerplexImage (Nuxt 3)

