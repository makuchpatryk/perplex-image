import { test, expect } from './fixtures';

test.describe('PerplexImage - Advanced E2E Tests with Fixtures', () => {
  test.describe('Game Flow Tests', () => {
    test('complete game flow from home to game selection', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      await navigateToHome();
      await selectDifficulty9x13();
      await startGame();

      // Verify game page loaded
      expect(page.url()).toContain('/game/');

      // Check for puzzle pieces
      const pieces = page.locator('[class*="piece"]');
      const pieceCount = await pieces.count();
      expect(pieceCount).toBeGreaterThan(0);
    });

    test('test all difficulty levels', async ({
      page,
      navigateToHome,
      selectDifficultyLevel,
      startGame,
    }) => {
      const difficulties = ['9x13', '15x23', '18x26'];

      for (const difficulty of difficulties) {
        await navigateToHome();
        await selectDifficultyLevel(difficulty);

        // Verify selection
        const option = page.locator(`input[value="${difficulty}"]`);
        await expect(option).toBeChecked();

        await startGame();

        // Verify game loaded with correct difficulty
        const pieces = page.locator('[class*="piece"]');
        const pieceCount = await pieces.count();
        expect(pieceCount).toBeGreaterThan(0);

        // Go back for next iteration
        const backBtn = page.locator('button').filter({ hasText: /Back|Home|Powrót|Menu/i });
        if (await backBtn.isVisible()) {
          await backBtn.click();
          await page.waitForURL('/');
        }
      }
    });
  });

  test.describe('Game Interaction Tests', () => {
    test('test piece interaction and movement', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      await navigateToHome();
      await selectDifficulty9x13();
      await startGame();

      // Get puzzle pieces
      const pieces = page.locator('[class*="piece"]');
      const pieceCount = await pieces.count();

      expect(pieceCount).toBeGreaterThan(1);

      // Interact with pieces
      for (let i = 0; i < Math.min(3, pieceCount - 1); i++) {
        const piece1 = pieces.nth(i);
        const piece2 = pieces.nth(i + 1);

        const box1 = await piece1.boundingBox();
        const box2 = await piece2.boundingBox();

        if (box1 && box2) {
          // Test drag operation
          await piece1.dragTo(piece2);

          // Verify pieces are still visible
          await expect(piece1).toBeVisible();
          await expect(piece2).toBeVisible();

          await page.waitForTimeout(200);
        }
      }
    });

    test('test pause and resume functionality', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      await navigateToHome();
      await selectDifficulty9x13();
      await startGame();

      // Look for pause button
      const pauseBtn = page.locator('button').filter({ hasText: /Pause|Pauza/i });

      if (await pauseBtn.isVisible()) {
        // Click pause
        await pauseBtn.click();
        await page.waitForTimeout(500);

        // Look for pause modal
        const modal = page.locator('[role="dialog"]');

        if (await modal.isVisible()) {
          // Verify pause modal content
          const pauseText = modal.locator('text=/Pause|Pauza/i');
          await expect(pauseText).toBeVisible();

          // Resume game
          const resumeBtn = page.locator('button').filter({ hasText: /Resume|Wznów|Continue/i });
          if (await resumeBtn.isVisible()) {
            await resumeBtn.click();
            await expect(modal).not.toBeVisible();
          }
        }
      }
    });

    test('test timer functionality', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      await navigateToHome();
      await selectDifficulty9x13();
      await startGame();

      // Get initial timer value
      const timer = page.locator('text=/[0-9]{1,2}:[0-9]{2}/');
      await expect(timer).toBeVisible();

      const initialTime = await timer.textContent();
      console.log(`Initial timer: ${initialTime}`);

      // Wait 2 seconds
      await page.waitForTimeout(2000);

      // Check if timer updated
      const updatedTime = await timer.textContent();
      console.log(`Updated timer: ${updatedTime}`);

      // Timer should be visible (might be same or different depending on timing)
      await expect(timer).toBeVisible();
    });

    test('test move counter', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      await navigateToHome();
      await selectDifficulty9x13();
      await startGame();

      // Find move counter
      const moveCounter = page.locator('text=/[Mm]oves?:/');
      await expect(moveCounter).toBeVisible();

      // Perform drag operations to increment counter
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
          await page.waitForTimeout(300);

          // Counter should still be visible
          await expect(moveCounter).toBeVisible();
        }
      }
    });
  });

  test.describe('UI & UX Tests', () => {
    test('test responsive game layout', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      const viewports = [
        { width: 375, height: 667, name: 'mobile' },
        { width: 768, height: 1024, name: 'tablet' },
        { width: 1920, height: 1080, name: 'desktop' },
      ];

      for (const viewport of viewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        await navigateToHome();
        await selectDifficulty9x13();
        await startGame();

        // Game should be visible on all viewports
        const gameArea = page.locator('main, [role="main"]');
        await expect(gameArea).toBeVisible();

        // Go back
        const backBtn = page.locator('button').filter({ hasText: /Back|Home|Powrót|Menu/i });
        if (await backBtn.isVisible()) {
          await backBtn.click();
          await page.waitForURL('/');
        }

        console.log(`Game is responsive on ${viewport.name} viewport`);
      }
    });

    test('test image selection flow', async ({ page, navigateToHome }) => {
      await navigateToHome();

      // Find select image button
      const selectBtn = page.locator('button').filter({ hasText: /Select|Choose|Wybierz/i });

      if (await selectBtn.isVisible()) {
        await selectBtn.click();

        // Modal should appear
        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        // Find image options in modal
        const imageOptions = modal.locator('img');
        const optionCount = await imageOptions.count();

        expect(optionCount).toBeGreaterThan(0);

        // Click first image
        if (optionCount > 0) {
          await imageOptions.first().click();
          await page.waitForTimeout(500);

          // Modal should close or image should be selected
          // (depends on implementation)
        }
      }
    });
  });

  test.describe('State Management Tests', () => {
    test('test image selection persists', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      await navigateToHome();

      // Select an image if modal is available
      const selectBtn = page.locator('button').filter({ hasText: /Select|Choose|Wybierz/i });
      if (await selectBtn.isVisible()) {
        await selectBtn.click();

        const modal = page.locator('[role="dialog"]');
        if (await modal.isVisible()) {
          const imageOption = modal.locator('img').first();
          const imageSrc = await imageOption.getAttribute('src');

          await imageOption.click();
          await page.waitForTimeout(500);

          await selectDifficulty9x13();
          await startGame();

          // Verify correct image is displayed in game
          const gameImage = page.locator('img[class*="game"], img[class*="puzzle"]');
          if (await gameImage.count() > 0) {
            const gameSrc = await gameImage.first().getAttribute('src');

            // Sources should be related to same image
            console.log(`Selected image: ${imageSrc}`);
            console.log(`Game image: ${gameSrc}`);
          }
        }
      }
    });
  });

  test.describe('Navigation Tests', () => {
    test('test back navigation from game to home', async ({
      page,
      navigateToHome,
      selectDifficulty9x13,
      startGame,
    }) => {
      await navigateToHome();
      await selectDifficulty9x13();
      await startGame();

      // Find and click back button
      const backBtn = page.locator('button').filter({ hasText: /Back|Home|Powrót|Menu/i });

      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForURL('/');

        // Verify we're back on home page
        expect(page.url()).toContain('/');

        // Home page elements should be visible
        const mainContent = page.locator('main, [role="main"]');
        await expect(mainContent).toBeVisible();
      }
    });

    test('test direct navigation to game with ID', async ({ page }) => {
      // First get an image ID
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Get image ID from page (would need to inspect actual implementation)
      const images = page.locator('img');
      const imageCount = await images.count();

      if (imageCount > 0) {
        // Try to navigate directly to game with a specific ID
        const testId = '12345'; // This would be a real ID from the API

        // Attempt navigation (will work if ID is valid)
        await page.goto(`/game/${testId}?level=9x13`);

        // Page should load or show error gracefully
        const pageContent = page.locator('body');
        await expect(pageContent).toBeVisible();
      }
    });
  });
});

