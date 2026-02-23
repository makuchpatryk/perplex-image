import { test, expect, mockPhoto, mockApiRoutes } from "./fixtures";

test.describe("Game page – layout", () => {
  test("displays puzzle pieces", async ({ gamePage }) => {
    const pieces = gamePage.locator("[draggable='true']");
    await expect(pieces.first()).toBeVisible();
  });

  test("displays the correct number of pieces for 9x13 level", async ({
    gamePage,
  }) => {
    // mockPhoto: height=800, width=1200 → cols=9, rows=Math.round(800/1200*9)=6 → 54 pieces
    const pieces = gamePage.locator("[draggable='true']");
    await expect(pieces).toHaveCount(54);
  });

  test("displays the image preview thumbnail", async ({ gamePage }) => {
    const preview = gamePage.locator("img[alt='']").first();
    await expect(preview).toBeVisible();
  });

  test("displays move counter starting at 0", async ({ gamePage }) => {
    await expect(gamePage.getByText(/0 Move/)).toBeVisible();
  });

  test("displays stopwatch starting at 00:00:00", async ({ gamePage }) => {
    await expect(gamePage.getByText("00:00:00")).toBeVisible();
  });

  test("displays RESTART button", async ({ gamePage }) => {
    await expect(
      gamePage.getByRole("button", { name: /RESTART/i })
    ).toBeVisible();
  });

  test("displays PAUSE button", async ({ gamePage }) => {
    await expect(
      gamePage.getByRole("button", { name: /PAUSE/i })
    ).toBeVisible();
  });
});

test.describe("Game page – pause flow", () => {
  test("opens pause modal when PAUSE is clicked", async ({ gamePage }) => {
    await gamePage.getByRole("button", { name: /PAUSE/i }).click();
    await expect(gamePage.locator("div.fixed")).toBeVisible();
    await expect(gamePage.locator("div.text-7xl")).toContainText("Pause");
  });

  test("pause modal shows Continue button", async ({ gamePage }) => {
    await gamePage.getByRole("button", { name: /PAUSE/i }).click();
    await expect(
      gamePage.getByRole("button", { name: /Continue/i })
    ).toBeVisible();
  });

  test("continue button closes pause modal", async ({ gamePage }) => {
    await gamePage.getByRole("button", { name: /PAUSE/i }).click();
    await gamePage.getByRole("button", { name: /Continue/i }).click();
    await expect(gamePage.locator("div.fixed")).not.toBeVisible();
  });
});

test.describe("Game page – restart", () => {
  test("RESTART resets move counter to 0", async ({ gamePage }) => {
    await gamePage.getByRole("button", { name: /RESTART/i }).click();
    await expect(gamePage.getByText(/0 Move/)).toBeVisible();
  });

  test("RESTART resets stopwatch to 00:00:00", async ({ gamePage }) => {
    await gamePage.getByRole("button", { name: /RESTART/i }).click();
    await expect(gamePage.getByText("00:00:00")).toBeVisible();
  });
});

test.describe("Game page – levels", () => {
  test("15x23 level renders correct piece count", async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto(`/game/${mockPhoto.id}?level=15x23`);
    await page.waitForSelector("[draggable='true']", { timeout: 15_000 });
    // mockPhoto: height=800, width=1200 → cols=15, rows=Math.round(800/1200*15)=10 → 150 pieces
    await expect(page.locator("[draggable='true']")).toHaveCount(150);
  });

  test("18x26 level renders correct piece count", async ({ page }) => {
    await mockApiRoutes(page);
    await page.goto(`/game/${mockPhoto.id}?level=18x26`);
    await page.waitForSelector("[draggable='true']", { timeout: 15_000 });
    // mockPhoto: height=800, width=1200 → cols=18, rows=Math.round(800/1200*18)=12 → 216 pieces
    await expect(page.locator("[draggable='true']")).toHaveCount(216);
  });
});
