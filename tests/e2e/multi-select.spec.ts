import { test, expect } from "./fixtures";
import type { Page } from "@playwright/test";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const pieces = (page: Page) => page.locator(".cursor-grab");

const selected = (page: Page) =>
  page.locator(".cursor-grab").filter({ has: page.locator(".bg-blue-500\\/30") });

async function dragPiece(page: Page, sourceIndex: number, targetIndex: number) {
  const src = pieces(page).nth(sourceIndex);
  const tgt = pieces(page).nth(targetIndex);
  const srcBox = await src.boundingBox();
  const tgtBox = await tgt.boundingBox();
  if (!srcBox || !tgtBox) throw new Error("Brak bounding box");
  await page.mouse.move(srcBox.x + srcBox.width / 2, srcBox.y + srcBox.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(80);
  await page.mouse.move(tgtBox.x + tgtBox.width / 2, tgtBox.y + tgtBox.height / 2, { steps: 15 });
  await page.waitForTimeout(80);
  await page.mouse.up();
  await page.waitForTimeout(400);
}

// ─── Selekcja ─────────────────────────────────────────────────────────────────

test.describe("Multi-selekcja – zaznaczanie klocków", () => {

  test("klik zaznacza, ponowny klik odznacza", async ({ gamePage }) => {
    await pieces(gamePage).nth(0).click();
    await gamePage.waitForTimeout(100);
    await expect(selected(gamePage)).toHaveCount(1);

    await pieces(gamePage).nth(0).click();
    await gamePage.waitForTimeout(100);
    await expect(selected(gamePage)).toHaveCount(0);
  });

  test("Shift+klik buduje selekcję, zwykły klik ją zastępuje", async ({ gamePage }) => {
    await pieces(gamePage).nth(0).click();
    await pieces(gamePage).nth(1).click({ modifiers: ["Shift"] });
    await pieces(gamePage).nth(2).click({ modifiers: ["Shift"] });
    await gamePage.waitForTimeout(100);
    await expect(selected(gamePage)).toHaveCount(3);

    // zwykły klik → zostaje tylko ten jeden
    await pieces(gamePage).nth(5).click();
    await gamePage.waitForTimeout(100);
    await expect(selected(gamePage)).toHaveCount(1);
  });

  test("Ctrl+klik dodaje do istniejącej selekcji", async ({ gamePage }) => {
    await pieces(gamePage).nth(0).click();
    await pieces(gamePage).nth(1).click({ modifiers: ["Control"] });
    await gamePage.waitForTimeout(80);
    await expect(selected(gamePage)).toHaveCount(2);
  });
});

// ─── Czyszczenie selekcji ─────────────────────────────────────────────────────

test.describe("Multi-selekcja – czyszczenie selekcji", () => {

  test("RESTART czyści selekcję", async ({ gamePage }) => {
    await pieces(gamePage).nth(0).click();
    await pieces(gamePage).nth(1).click({ modifiers: ["Shift"] });
    await gamePage.waitForTimeout(100);
    await expect(selected(gamePage)).toHaveCount(2);

    await gamePage.getByRole("button", { name: /RESTART/i }).click();
    await gamePage.waitForTimeout(300);
    await expect(selected(gamePage)).toHaveCount(0);
  });

  test("PAUSE czyści selekcję", async ({ gamePage }) => {
    await pieces(gamePage).nth(0).click();
    await pieces(gamePage).nth(1).click({ modifiers: ["Shift"] });
    await gamePage.waitForTimeout(100);
    await expect(selected(gamePage)).toHaveCount(2);

    await gamePage.getByRole("button", { name: /PAUSE/i }).click();
    await gamePage.waitForTimeout(300);
    await expect(selected(gamePage)).toHaveCount(0);
  });
});

// ─── Drag & Drop ─────────────────────────────────────────────────────────────

test.describe("Drag & Drop – pojedynczy klocek", () => {

  test("swap: moves +1 i klocki zamieniają się backgroundPosition", async ({ gamePage }) => {
    await expect(gamePage.getByText(/0 Move/)).toBeVisible();

    const bg0 = await pieces(gamePage).nth(0).locator("div[draggable]").evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );
    const bg5 = await pieces(gamePage).nth(5).locator("div[draggable]").evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );

    await dragPiece(gamePage, 0, 5);

    await expect(gamePage.getByText(/1 Move/)).toBeVisible();
    const bg0After = await pieces(gamePage).nth(0).locator("div[draggable]").evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );
    const bg5After = await pieces(gamePage).nth(5).locator("div[draggable]").evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );
    expect(bg0After).toBe(bg5);
    expect(bg5After).toBe(bg0);
  });

  test("upuszczenie na to samo miejsce nie zmienia moves", async ({ gamePage }) => {
    await expect(gamePage.getByText(/0 Move/)).toBeVisible();
    await dragPiece(gamePage, 3, 3);
    await expect(gamePage.getByText(/0 Move/)).toBeVisible();
  });

  test("kilka swapów NIE kończy gry (naprawiony bug)", async ({ gamePage }) => {
    await dragPiece(gamePage, 0, 7);
    await dragPiece(gamePage, 2, 9);
    await dragPiece(gamePage, 4, 11);

    // Modal końca gry NIE powinien się pojawić
    await expect(gamePage.locator("div.fixed")).not.toBeVisible();
    expect(await pieces(gamePage).count()).toBeGreaterThan(0);
  });
});

test.describe("Drag & Drop – grupowy ruch", () => {

  test("grupowy drag: moves rośnie, liczba klocków niezmieniona", async ({ gamePage }) => {
    const total = await pieces(gamePage).count();
    expect(total).toBeGreaterThanOrEqual(6);

    await pieces(gamePage).nth(0).click();
    await pieces(gamePage).nth(1).click({ modifiers: ["Shift"] });
    await gamePage.waitForTimeout(150);
    await expect(selected(gamePage)).toHaveCount(2);

    const movesBefore = await gamePage.getByText(/\d+ Move/).textContent();
    await dragPiece(gamePage, 0, 5);

    await expect(pieces(gamePage)).toHaveCount(total);
    const movesAfter = await gamePage.getByText(/\d+ Move/).textContent();
    expect(movesAfter).not.toBe(movesBefore);
  });

});
