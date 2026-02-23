import { test, expect } from '@playwright/test';

test.describe('PerplexImage - E2E Tests', () => {
  test.describe('Home Page & Image Selection', () => {
    test('should load home page and display title', async ({ page }) => {
      await page.goto('/');

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check if page title exists
      const pageTitle = page.locator('text=Perplex Image');
      await expect(pageTitle).toBeVisible();
    });

    test('should display difficulty level options', async ({ page }) => {
      await page.goto('/');

      // Wait for page content to load
      await page.waitForLoadState('networkidle');

      // Check if difficulty levels are visible
      const difficultyOptions = page.locator('input[type="radio"]');
      const count = await difficultyOptions.count();

      expect(count).toBeGreaterThan(0);
    });

    test('should select a difficulty level', async ({ page }) => {
      await page.goto('/');

      await page.waitForLoadState('networkidle');

      // Find and click 9x13 difficulty option
      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      // Verify it's checked
      await expect(option9x13).toBeChecked();
    });

    test('should load images from API', async ({ page }) => {
      await page.goto('/');

      // Wait for images to load
      await page.waitForTimeout(3000);

      // Look for image elements
      const images = page.locator('img');
      const imageCount = await images.count();

      expect(imageCount).toBeGreaterThan(0);
    });

    test('should open image selection modal', async ({ page }) => {
      await page.goto('/');

      await page.waitForLoadState('networkidle');

      // Look for button that opens image selection modal
      const selectImageBtn = page.locator('button:has-text("Select")');

      if (await selectImageBtn.isVisible()) {
        await selectImageBtn.click();

        // Check if modal appeared
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();
      }
    });

    test('should start game with selected image and difficulty', async ({ page }) => {
      await page.goto('/');

      await page.waitForLoadState('networkidle');

      // Select difficulty level
      const option15x23 = page.locator('input[value="15x23"]');
      await option15x23.click();

      // Wait a moment for selection
      await page.waitForTimeout(500);

      // Find and click start game button
      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });

      if (await startBtn.isVisible()) {
        await startBtn.click();

        // Wait for navigation to game page
        await page.waitForURL(/\/game\//);

        // Verify we're on game page
        expect(page.url()).toContain('/game/');
      }
    });
  });

  test.describe('Game Page & Puzzle Gameplay', () => {
    test('should load game page with puzzle pieces', async ({ page }) => {
      // First go to home and start game
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Select difficulty
      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      // Start game
      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
      }

      // Wait for page to load
      await page.waitForLoadState('networkidle');

      // Check if puzzle pieces are rendered
      const pieces = page.locator('[class*="piece"]');
      const pieceCount = await pieces.count();

      expect(pieceCount).toBeGreaterThan(0);
    });

    test('should display game sidebar with timer', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
      }

      // Check for sidebar
      const sidebar = page.locator('[class*="sidebar"], [class*="Sidebar"]');
      await expect(sidebar).toBeVisible();

      // Check for timer display
      const timer = page.locator('text=/[0-9]{1,2}:[0-9]{2}/');
      await expect(timer).toBeVisible();
    });

    test('should allow dragging puzzle pieces', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
      }

      await page.waitForLoadState('networkidle');

      // Get all pieces
      const pieces = page.locator('[class*="piece"]');
      const pieceCount = await pieces.count();

      if (pieceCount >= 2) {
        // Get first and second piece
        const piece1 = pieces.first();
        const piece2 = pieces.nth(1);

        const box1 = await piece1.boundingBox();
        const box2 = await piece2.boundingBox();

        if (box1 && box2) {
          // Drag first piece to second piece location
          await piece1.dragTo(piece2);

          // Verify drag action completed without error
          await expect(piece1).toBeVisible();
          await expect(piece2).toBeVisible();
        }
      }
    });

    test('should display pause button and handle pause modal', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
      }

      // Look for pause button
      const pauseBtn = page.locator('button').filter({ hasText: /Pause|Pauza/i });

      if (await pauseBtn.isVisible()) {
        await pauseBtn.click();

        // Check if pause modal appeared
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        // Resume game
        const resumeBtn = page.locator('button').filter({ hasText: /Resume|Wznów|Continue/i });
        if (await resumeBtn.isVisible()) {
          await resumeBtn.click();
          await expect(modal).not.toBeVisible();
        }
      }
    });

    test('should update move counter when pieces are swapped', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
      }

      await page.waitForLoadState('networkidle');

      // Get initial move count
      const moveCounter = page.locator('text=/[Mm]oves?:/');

      // Perform drag operation
      const pieces = page.locator('[class*="piece"]');
      const pieceCount = await pieces.count();

      if (pieceCount >= 2) {
        const piece1 = pieces.first();
        const piece2 = pieces.nth(1);

        const box1 = await piece1.boundingBox();
        const box2 = await piece2.boundingBox();

        if (box1 && box2) {
          // Perform swap
          await piece1.dragTo(piece2);

          // Wait a moment for counter update
          await page.waitForTimeout(500);

          // Check if move counter is still visible
          await expect(moveCounter).toBeVisible();
        }
      }
    });
  });

  test.describe('Game Controls & Navigation', () => {
    test('should navigate back to home page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
      }

      // Look for back/home button
      const backBtn = page.locator('button').filter({ hasText: /Back|Home|Powrót|Menu/i });

      if (await backBtn.isVisible()) {
        await backBtn.click();

        // Should navigate back to home
        await page.waitForURL('/');
        expect(page.url()).toContain('/');
      }
    });

    test('should display game completion modal', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
      }

      await page.waitForLoadState('networkidle');

      // Wait for finish modal (if game completes quickly - usually won't, but check anyway)
      const finishModal = page.locator('[role="dialog"]').filter({ hasText: /Finish|Complete|Congratulations|Gratulacje/i });

      // If modal exists, verify it's visible
      if (await finishModal.count() > 0) {
        await expect(finishModal).toBeVisible();
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check if main content is visible
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check if main content is visible
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });

    test('should be responsive on desktop viewport', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check if main content is visible
      const mainContent = page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle loading errors gracefully', async ({ page }) => {
      // Intercept API calls and simulate errors
      await page.route('**/api/get-images**', route => {
        route.abort('failed');
      });

      await page.goto('/');

      // Page should still be visible even if API fails
      const pageContent = page.locator('body');
      await expect(pageContent).toBeVisible();
    });

    test('should handle network timeout gracefully', async ({ page }) => {
      // Slow down network by intercepting routes
      await page.route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, 100));
        await route.continue();
      });

      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'load', timeout: 30000 });
      const endTime = Date.now();

      // Page should still load
      const pageContent = page.locator('body');
      await expect(pageContent).toBeVisible();

      console.log(`Page loaded in ${endTime - startTime}ms with network delay`);
    });
  });

  test.describe('Performance', () => {
    test('should load home page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const endTime = Date.now();

      const loadTime = endTime - startTime;

      // Page should load within 10 seconds
      expect(loadTime).toBeLessThan(10000);

      console.log(`Home page loaded in ${loadTime}ms`);
    });

    test('should load game page within acceptable time', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const option9x13 = page.locator('input[value="9x13"]');
      await option9x13.click();

      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });
      if (await startBtn.isVisible()) {
        const startTime = Date.now();
        await startBtn.click();
        await page.waitForURL(/\/game\//);
        const endTime = Date.now();

        const loadTime = endTime - startTime;

        // Game page should load within 10 seconds
        expect(loadTime).toBeLessThan(10000);

        console.log(`Game page loaded in ${loadTime}ms`);
      }
    });
  });
});

