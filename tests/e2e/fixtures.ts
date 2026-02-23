import { test as base, type Page } from "@playwright/test";

/** A minimal PexelPhoto fixture served via the local dev-server image. */
export const mockPhoto = {
  id: 1,
  alt: "Test photo",
  avg_color: "#808080",
  height: 800,
  width: 1200,
  liked: false,
  photographer: "Test Photographer",
  photographer_id: 1,
  photographer_url: "https://www.pexels.com/@test",
  src: {
    landscape: "http://localhost:3000/img/img.jpeg",
    large: "http://localhost:3000/img/img.jpeg",
    large2x: "http://localhost:3000/img/img.jpeg",
    medium: "http://localhost:3000/img/img.jpeg",
    original: "http://localhost:3000/img/img.jpeg",
    portrait: "http://localhost:3000/img/img.jpeg",
    small: "http://localhost:3000/img/img.jpeg",
    tiny: "http://localhost:3000/img/img.jpeg",
    url: "http://localhost:3000/img/img.jpeg",
  },
  url: "https://www.pexels.com/photo/1",
};

export const mockPhotosResponse = {
  id: "dyck2i1",
  media: [mockPhoto],
  page: 1,
  per_page: 1,
  total_results: 1,
};

/**
 * Intercept the Pexels API proxy routes so tests never call the real API.
 *
 * IMPORTANT: register the more-specific `get-image` route FIRST (lower priority)
 * and `get-images` LAST (higher priority), because Playwright's last-registered
 * route wins when multiple patterns match the same URL.
 * `**\/api\/get-image**` would otherwise also match `get-images` requests.
 */
export async function mockApiRoutes(page: Page) {
  // Lower priority – matches /api/get-image?id=... only when get-images does not match
  await page.route("**/api/get-image**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockPhoto),
    })
  );
  // Higher priority – must be registered LAST so it takes precedence over get-image
  await page.route("**/api/get-images**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockPhotosResponse),
    })
  );
}

type Fixtures = {
  homePage: Page;
  gamePage: Page;
  navigateToHome: () => Promise<void>;
  selectDifficulty9x13: () => Promise<void>;
  startGame: () => Promise<void>;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await mockApiRoutes(page);
    // Register the response waiter BEFORE navigating to catch the onMounted fetch
    const getImagesResponse = page.waitForResponse("**/api/get-images**", {
      timeout: 30_000,
    });
    await page.goto("/");
    // Wait for the getImages() API call to be fulfilled by the mock
    await getImagesResponse;
    // Wait for loading to complete: the shimmer disappears and the image appears
    await page.waitForSelector("img.w-full", { timeout: 15_000 });
    await use(page);
  },

  gamePage: async ({ page }, use) => {
    await mockApiRoutes(page);
    await page.goto(`/game/${mockPhoto.id}?level=9x13`);
    // Wait for at least one puzzle piece to be rendered
    await page.waitForSelector("[draggable='true']", { timeout: 15_000 });
    await use(page);
  },

  navigateToHome: async ({ page }, use) => {
    await use(async () => {
      await mockApiRoutes(page);
      const getImagesResponse = page.waitForResponse("**/api/get-images**", {
        timeout: 30_000,
      });
      await page.goto("/");
      await getImagesResponse;
      await page.waitForSelector("img.w-full", { timeout: 15_000 });
    });
  },

  selectDifficulty9x13: async ({ page }, use) => {
    await use(async () => {
      // 9x13 is the default; explicitly click the label to ensure it is selected
      await page.locator("label[for='9x13']").click();
    });
  },

  startGame: async ({ page }, use) => {
    await use(async () => {
      await page.getByRole("button", { name: /Play/i }).click();
      // Wait for puzzle pieces to be rendered on the game page
      await page.waitForSelector("[draggable='true']", { timeout: 15_000 });
    });
  },
});

export { expect } from "@playwright/test";
