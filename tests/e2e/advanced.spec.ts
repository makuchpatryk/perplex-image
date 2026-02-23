import { test, expect, mockPhoto, mockApiRoutes } from "./fixtures";

test.describe("Game page – layout", () => {
  test("renders correct number of pieces and UI controls for 9x13", async ({ gamePage }) => {
    // mockPhoto: height=800, width=1200 → cols=9, rows=round(800/1200*9)=6 → 54 pieces
    await expect(gamePage.locator("[draggable='true']")).toHaveCount(54);
    await expect(gamePage.locator("img[alt='']").first()).toBeVisible();
    await expect(gamePage.getByText(/0 Move/)).toBeVisible();
    await expect(gamePage.getByText("00:00:00")).toBeVisible();
  });

  test("correct piece count for 15x23 and 18x26 levels", async ({ page }) => {
    await mockApiRoutes(page);
    // 15x23: cols=15, rows=round(800/1200*15)=10 → 150 pieces
    await page.goto(`/game/${mockPhoto.id}?level=15x23`);
    await page.waitForSelector("[draggable='true']", { timeout: 15_000 });
    await expect(page.locator("[draggable='true']")).toHaveCount(150);
    // 18x26: cols=18, rows=round(800/1200*18)=12 → 216 pieces
    await page.goto(`/game/${mockPhoto.id}?level=18x26`);
    await page.waitForSelector("[draggable='true']", { timeout: 15_000 });
    await expect(page.locator("[draggable='true']")).toHaveCount(216);
  });
});

test.describe("Game page – pause flow", () => {
  test("pause modal opens, shows Pause label and Continue button, then closes", async ({ gamePage }) => {
    await gamePage.getByRole("button", { name: /PAUSE/i }).click();
    await expect(gamePage.locator("div.fixed")).toBeVisible();
    await expect(gamePage.locator("div.text-7xl")).toContainText("Pause");
    await gamePage.getByRole("button", { name: /Continue/i }).click();
    await expect(gamePage.locator("div.fixed")).not.toBeVisible();
  });
});

test.describe("Game page – restart", () => {
  test("RESTART resets move counter and stopwatch", async ({ gamePage }) => {
    await gamePage.getByRole("button", { name: /RESTART/i }).click();
    await expect(gamePage.getByText(/0 Move/)).toBeVisible();
    await expect(gamePage.getByText("00:00:00")).toBeVisible();
  });
});

