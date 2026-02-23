import { test, expect, mockPhoto } from "./fixtures";

test.describe("Home page", () => {
  test("has correct page title", async ({ homePage }) => {
    await expect(homePage).toHaveTitle(/Perplex Image/i);
  });

  test("displays tagline heading", async ({ homePage }) => {
    await expect(
      homePage.getByText("A tile-sliding picture game.")
    ).toBeVisible();
  });

  test("displays subtitle", async ({ homePage }) => {
    await expect(
      homePage.getByText("Rearrange tiles by dragging to put the image together.")
    ).toBeVisible();
  });

  test("displays selected image preview", async ({ homePage }) => {
    // Image appears once loading is false and selectedImage is set
    await expect(homePage.locator("img.w-full")).toBeVisible({ timeout: 15_000 });
  });

  test("displays Shuffle picture button", async ({ homePage }) => {
    await expect(
      homePage.getByRole("button", { name: /Shuffle picture/i })
    ).toBeVisible();
  });

  test("displays Choose manually button", async ({ homePage }) => {
    await expect(
      homePage.getByRole("button", { name: /Choose manually/i })
    ).toBeVisible();
  });

  test("displays Play button", async ({ homePage }) => {
    await expect(
      homePage.getByRole("button", { name: /Play/i })
    ).toBeVisible();
  });

  test("displays three level options", async ({ homePage }) => {
    await expect(homePage.locator("label[for='9x13']")).toBeVisible();
    await expect(homePage.locator("label[for='15x23']")).toBeVisible();
    await expect(homePage.locator("label[for='18x26']")).toBeVisible();
  });

  test("9x13 level is selected by default", async ({ homePage }) => {
    const radio = homePage.locator("input[value='9x13']");
    await expect(radio).toBeChecked();
  });

  test("level can be changed to 15x23", async ({ homePage }) => {
    await homePage.locator("label[for='15x23']").click();
    await expect(homePage.locator("input[value='15x23']")).toBeChecked();
  });

  test("level can be changed to 18x26", async ({ homePage }) => {
    // Use dispatchEvent to avoid interaction with the Shuffle icon that visually
    // overlaps the label center due to CSS rotate transform
    await homePage.locator("label[for='18x26']").dispatchEvent("click");
    await expect(homePage.locator("input[value='18x26']")).toBeChecked();
  });
});

test.describe("Home page – Select image modal", () => {
  test("opens when Choose manually is clicked", async ({ homePage }) => {
    await homePage.getByRole("button", { name: /Choose manually/i }).click();
    // UiModal renders as div.fixed.top-0.left-0
    await expect(homePage.locator("div.fixed")).toBeVisible();
  });

  test("closes when clicking outside the modal", async ({ homePage }) => {
    await homePage.getByRole("button", { name: /Choose manually/i }).click();
    const modal = homePage.locator("div.fixed");
    await expect(modal).toBeVisible();
    // Click at the top-left corner, outside the centered modal container
    await homePage.mouse.click(10, 10);
    await expect(modal).not.toBeVisible();
  });
});

test.describe("Navigation – Play button", () => {
  test("navigates to game page when Play is clicked", async ({ homePage }) => {
    await homePage.getByRole("button", { name: /Play/i }).click();
    await expect(homePage).toHaveURL(
      new RegExp(`/game/${mockPhoto.id}`)
    );
  });
});
