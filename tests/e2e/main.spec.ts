import { test, expect, mockPhoto } from "./fixtures";

test.describe("Home page", () => {
  test("renders key UI elements and correct title", async ({ homePage }) => {
    await expect(homePage).toHaveTitle(/Perplex Image/i);
    await expect(homePage.getByText("A tile-sliding picture game.")).toBeVisible();
    await expect(homePage.locator("img.w-full")).toBeVisible({ timeout: 15_000 });
    await expect(homePage.getByRole("button", { name: /Shuffle picture/i })).toBeVisible();
    await expect(homePage.getByRole("button", { name: /Choose manually/i })).toBeVisible();
    await expect(homePage.getByRole("button", { name: /Play/i })).toBeVisible();
  });

  test("shows three difficulty levels with 9x13 selected by default", async ({ homePage }) => {
    await expect(homePage.locator("label[for='9x13']")).toBeVisible();
    await expect(homePage.locator("label[for='15x23']")).toBeVisible();
    await expect(homePage.locator("label[for='18x26']")).toBeVisible();
    await expect(homePage.locator("input[value='9x13']")).toBeChecked();
  });

  test("difficulty level can be changed", async ({ homePage }) => {
    await homePage.locator("label[for='15x23']").click();
    await expect(homePage.locator("input[value='15x23']")).toBeChecked();
    // dispatchEvent – obejście nakładki ikony Shuffle na label 18x26
    await homePage.locator("label[for='18x26']").dispatchEvent("click");
    await expect(homePage.locator("input[value='18x26']")).toBeChecked();
  });

  test("Select image modal opens and closes on outside click", async ({ homePage }) => {
    await homePage.getByRole("button", { name: /Choose manually/i }).click();
    const modal = homePage.locator("div.fixed");
    await expect(modal).toBeVisible();
    await homePage.mouse.click(10, 10);
    await expect(modal).not.toBeVisible();
  });

  test("Play button navigates to game page", async ({ homePage }) => {
    await homePage.getByRole("button", { name: /Play/i }).click();
    await expect(homePage).toHaveURL(new RegExp(`/game/${mockPhoto.id}`));
  });
});
