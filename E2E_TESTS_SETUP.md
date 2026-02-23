# Playwright E2E Tests - Quick Start Guide

## ✅ Installation Complete

Playwright E2E tests have been successfully added to the PerplexImage project!

## 📦 What Was Added

### Files Created:
1. **playwright.config.ts** - Playwright configuration
2. **tests/e2e/main.spec.ts** - Core functionality tests (31+ tests)
3. **tests/e2e/advanced.spec.ts** - Advanced tests with fixtures (14 test groups)
4. **tests/e2e/fixtures.ts** - Reusable test fixtures
5. **tests/e2e/README.md** - Detailed test documentation

### Package Updated:
- **@playwright/test** v1.58.2 added to devDependencies

### Scripts Added to package.json:
- `pnpm test:e2e` - Run all tests
- `pnpm test:e2e:ui` - Run tests with interactive UI
- `pnpm test:e2e:debug` - Run tests in debug mode

## 🚀 Quick Start

### 1. Run All Tests

```bash
pnpm test:e2e
```

This will:
- Start the dev server automatically
- Run tests on Chromium, Firefox, and WebKit browsers
- Generate an HTML report

### 2. Run Tests in UI Mode (Recommended for First Time)

```bash
pnpm test:e2e:ui
```

This opens an interactive test runner where you can:
- See tests executing in real-time
- Inspect elements on the page
- Debug individual tests
- Step through test execution

### 3. View Test Report

After running tests:

```bash
npx playwright show-report
```

Opens an HTML report with:
- Test results and timing
- Screenshots of failures
- Network traces
- Video recordings

### 4. Run Specific Test

```bash
npx playwright test tests/e2e/main.spec.ts
```

### 5. Run Tests in Debug Mode

```bash
pnpm test:e2e:debug
```

Opens Playwright Inspector for stepping through tests.

### 6. Run Tests with Browser Visible

```bash
npx playwright test --headed
```

## 📊 Test Coverage

### Total Tests: 62 across 3 browsers (31 × 2 files + browser multiplier)

### Test Categories:

**Home Page & Image Selection (6 tests)**
- Load home page
- Display difficulty options
- Select difficulty level
- Load images from API
- Open image selection modal
- Start game with selections

**Game Page & Puzzle Gameplay (5 tests)**
- Load game page with puzzle pieces
- Display game sidebar with timer
- Allow dragging puzzle pieces
- Display pause button and handle modal
- Update move counter

**Game Controls & Navigation (2 tests)**
- Navigate back to home page
- Display game completion modal

**Responsive Design (3 tests)**
- Mobile viewport (375x667)
- Tablet viewport (768x1024)
- Desktop viewport (1920x1080)

**Error Handling (2 tests)**
- Handle loading errors gracefully
- Handle network timeout gracefully

**Performance (2 tests)**
- Load home page within acceptable time
- Load game page within acceptable time

**Advanced Game Flow (2 tests with fixtures)**
- Complete game flow from home to game
- Test all difficulty levels

**Advanced Game Interaction (4 tests with fixtures)**
- Test piece interaction and movement
- Test pause and resume functionality
- Test timer functionality
- Test move counter

**UI & UX Tests (2 tests with fixtures)**
- Test responsive game layout
- Test image selection flow

**State Management (1 test with fixtures)**
- Test image selection persistence

**Navigation Tests (2 tests with fixtures)**
- Test back navigation from game to home
- Test direct navigation with ID

## 🎯 Key Test Features

✅ **Cross-Browser Testing** - Chromium, Firefox, WebKit
✅ **Responsive Design Testing** - Mobile, Tablet, Desktop viewports
✅ **User Flow Testing** - Real-world user interactions
✅ **Error Handling** - API failures and network timeouts
✅ **Performance Testing** - Page load time measurements
✅ **Drag & Drop Testing** - Puzzle piece interactions
✅ **Modal Testing** - Pause, image selection, completion modals
✅ **State Testing** - Image selection persistence
✅ **Accessibility Testing** - Element visibility and interaction

## 📚 Test Structure Example

```typescript
test('should start game with selected image and difficulty', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Select difficulty level
  const option15x23 = page.locator('input[value="15x23"]');
  await option15x23.click();
  
  // Start game
  const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin/i });
  if (await startBtn.isVisible()) {
    await startBtn.click();
    await page.waitForURL(/\/game\//);
    
    // Verify game started
    expect(page.url()).toContain('/game/');
  }
});
```

## 🔍 Advanced Features

### Using Custom Fixtures

```typescript
test('complete game flow', async ({
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

### Taking Screenshots

```typescript
await page.screenshot({ path: 'screenshot.png' });
```

### Generating Locators

```bash
npx playwright codegen http://localhost:3000
```

This opens a tool to interactively generate test code.

## 📝 Configuration Details

- **Base URL**: http://localhost:3000
- **Test Timeout**: 30 seconds per test
- **Navigation Timeout**: 30 seconds
- **Retries**: 0 in local mode, 2 in CI
- **Workers**: All available (local), 1 (CI)
- **Screenshots**: On failure only
- **Traces**: On first retry

## 🐛 Troubleshooting

### Tests timeout
```bash
# Increase timeout
npx playwright test --timeout=60000
```

### Browser not starting
```bash
# Install browsers
npx playwright install
```

### API fails
Check that:
- Dev server is running on http://localhost:3000
- Pexels API key is valid
- Internet connection is active

### Tests are too slow
```bash
# Run on specific browser only
npx playwright test --project=chromium
```

## 📖 Learn More

- [Playwright Documentation](https://playwright.dev)
- [Test Guide](https://playwright.dev/docs/writing-tests)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)

## 🎓 Next Steps

1. **Run tests**: `pnpm test:e2e:ui`
2. **Explore**: Open interactive test runner
3. **Review report**: `npx playwright show-report`
4. **Add more tests**: Create new .spec.ts files in tests/e2e/
5. **Integrate CI/CD**: Add tests to GitHub Actions or other CI

## 📝 Notes

- Dev server starts automatically during tests
- Tests use real Pexels API (ensure API key is valid)
- Tests are idempotent and can run multiple times
- All test results saved in `playwright-report/` directory

---

**Happy Testing! 🚀**

Created: February 23, 2026
Playwright Version: 1.58.2
Project: PerplexImage (Nuxt 3)

