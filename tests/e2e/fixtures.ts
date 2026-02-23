import { test as base, expect } from '@playwright/test';

type TestFixtures = {
  navigateToHome: () => Promise<void>;
  selectDifficultyLevel: (level: string) => Promise<void>;
  startGame: () => Promise<void>;
  selectDifficulty9x13: () => Promise<void>;
  selectDifficulty15x23: () => Promise<void>;
  selectDifficulty18x26: () => Promise<void>;
};

export const test = base.extend<TestFixtures>({
  navigateToHome: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
    });
  },

  selectDifficultyLevel: async ({ page }, use) => {
    await use(async (level: string) => {
      // input jest invisible – klikamy powiązany label
      const label = page.locator(`label[for="${level}"]`);
      await label.click();
      const option = page.locator(`input[value="${level}"]`);
      await expect(option).toBeChecked();
      await page.waitForTimeout(300);
    });
  },

  startGame: async ({ page }, use) => {
    await use(async () => {
      const startBtn = page.locator('button').filter({ hasText: /Start|Play|Begin|Graj/i });

      if (await startBtn.isVisible()) {
        await startBtn.click();
        await page.waitForURL(/\/game\//);
        await page.waitForLoadState('networkidle');
      }
    });
  },

  selectDifficulty9x13: async ({ selectDifficultyLevel }, use) => {
    await use(async () => {
      await selectDifficultyLevel('9x13');
    });
  },

  selectDifficulty15x23: async ({ selectDifficultyLevel }, use) => {
    await use(async () => {
      await selectDifficultyLevel('15x23');
    });
  },

  selectDifficulty18x26: async ({ selectDifficultyLevel }, use) => {
    await use(async () => {
      await selectDifficultyLevel('18x26');
    });
  },
});

export { expect };

