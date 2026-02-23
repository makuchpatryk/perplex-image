/**
 * Testy E2E dla multi-selekcji i drag & drop klocków.
 *
 * Pokrycie:
 * – zaznaczanie pojedynczego klocka (klik)
 * – odznaczanie (ponowny klik)
 * – multi-selekcja: Shift+klik, Ctrl+klik
 * – klik bez modyfikatora zastępuje selekcję
 * – drag&drop jednego klocka: zamiana miejsc, licznik moves +1
 * – drag&drop jednego klocka NIE kończy gry natychmiast (główny naprawiony bug)
 * – drag&drop grupy klocków: licznik moves rośnie, klocki nadal widoczne
 * – drag&drop grupy klocków poza granicę planszy: licznik moves NIE rośnie
 * – RESTART czyści selekcję
 * – PAUSE czyści selekcję
 */

import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

// ─── Helper ──────────────────────────────────────────────────────────────────

async function startEasyGame(
  navigateToHome: () => Promise<void>,
  selectDifficulty9x13: () => Promise<void>,
  startGame: () => Promise<void>,
  page: Page
) {
  await navigateToHome();
  await selectDifficulty9x13();
  await startGame();
  // Czekaj aż klocki będą wyrenderowane
  await page.waitForSelector('.cursor-grab', { state: 'visible', timeout: 15_000 });
  await page.waitForTimeout(500);
}

/** Zwraca liczbę zaznaczonych klocków (mają klasę ring-\[3px\]) */
function selectedPieces(page: Page) {
  return page.locator('.cursor-grab').filter({ has: page.locator('.bg-blue-500\\/30') });
}

/** Wykonuje drag klocka A na klocek B przez HTML5 drag events */
async function dragPiece(page: Page, sourceIndex: number, targetIndex: number) {
  const pieces = page.locator('.cursor-grab');
  const src = pieces.nth(sourceIndex);
  const tgt = pieces.nth(targetIndex);

  const srcBox = await src.boundingBox();
  const tgtBox = await tgt.boundingBox();
  if (!srcBox || !tgtBox) throw new Error('Brak bounding box');

  const sx = srcBox.x + srcBox.width / 2;
  const sy = srcBox.y + srcBox.height / 2;
  const tx = tgtBox.x + tgtBox.width / 2;
  const ty = tgtBox.y + tgtBox.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.waitForTimeout(80);
  // Poruszaj się małymi krokami żeby zdarzenia dragenter/dragover były wyzwalane
  await page.mouse.move(tx, ty, { steps: 15 });
  await page.waitForTimeout(80);
  await page.mouse.up();
  await page.waitForTimeout(400);
}

// ─── Testy ───────────────────────────────────────────────────────────────────

test.describe('Multi-selekcja i Drag & Drop', () => {

  // ── 1. Kliknięcie zaznacza klocek ────────────────────────────────────────
  test('kliknięcie klocka zaznacza go', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await page.waitForTimeout(150);

    // Zaznaczony klocek ma nakładkę bg-blue-500/30
    await expect(selectedPieces(page)).toHaveCount(1);
  });

  // ── 2. Ponowne kliknięcie odznacza ───────────────────────────────────────
  test('ponowne kliknięcie zaznaczonego klocka odznacza go', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(1);

    await pieces.nth(0).click();
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(0);
  });

  // ── 3. Shift+klik dodaje do selekcji ─────────────────────────────────────
  test('Shift+klik dodaje kolejny klocek do selekcji', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await page.waitForTimeout(100);
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);

    await expect(selectedPieces(page)).toHaveCount(2);
  });

  // ── 4. Ctrl+klik dodaje do selekcji ──────────────────────────────────────
  test('Ctrl+klik dodaje trzeci klocek do selekcji', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await page.waitForTimeout(80);
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(80);
    await pieces.nth(2).click({ modifiers: ['Control'] });
    await page.waitForTimeout(80);

    await expect(selectedPieces(page)).toHaveCount(3);
  });

  // ── 5. Shift+klik na zaznaczonym usuwa go ────────────────────────────────
  test('Shift+klik na zaznaczonym klocku usuwa go z selekcji', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(2);

    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(1);
  });

  // ── 6. Klik bez modyfikatora zastępuje selekcję ───────────────────────────
  test('klik bez modyfikatora na inny klocek zastępuje całą selekcję', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await pieces.nth(2).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(3);

    // Zwykły klik na inny klocek → zostaje tylko on
    await pieces.nth(5).click();
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(1);
  });

  // ── 7. RESTART czyści selekcję ────────────────────────────────────────────
  test('RESTART czyści selekcję', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(2);

    await page.locator('button').filter({ hasText: /RESTART/i }).click();
    await page.waitForTimeout(300);

    await expect(selectedPieces(page)).toHaveCount(0);
  });

  // ── 8. PAUSE czyści selekcję ──────────────────────────────────────────────
  test('PAUSE czyści selekcję', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await expect(selectedPieces(page)).toHaveCount(2);

    await page.locator('button').filter({ hasText: /PAUSE/i }).click();
    await page.waitForTimeout(300);

    await expect(selectedPieces(page)).toHaveCount(0);
  });

  // ── 9. Drag&drop pojedynczego klocka: licznik moves +1 ───────────────────
  test('drag&drop jednego klocka zwiększa moves o 1', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    await expect(page.locator('text=/0 Move/')).toBeVisible();

    await dragPiece(page, 0, 5);

    await expect(page.locator('text=/1 Move/')).toBeVisible();
  });

  // ── 10. Drag&drop NIE kończy gry natychmiast (kluczowy naprawiony bug) ────
  test('drag&drop jednego klocka nie wywołuje ekranu końca gry', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    // Wykonaj kilka losowych swapów
    await dragPiece(page, 0, 7);
    await dragPiece(page, 2, 9);
    await dragPiece(page, 4, 11);

    // Modal końca gry NIE powinien się pojawić
    const finishModal = page.locator('[data-testid="finish-modal"]')
      .or(page.locator('text=/Brawo|Congratulations|You win|Ukończyłeś/i'));
    await expect(finishModal).toHaveCount(0);

    // Klocki nadal widoczne
    const pieces = page.locator('.cursor-grab');
    const count = await pieces.count();
    expect(count).toBeGreaterThan(0);
  });

  // ── 11. Drag&drop zamienia dwa klocki miejscami ───────────────────────────
  test('drag&drop zamienia dwa klocki miejscami', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    const totalBefore = await pieces.count();

    // Pobierz backgroundPosition obu klocków przed swapem
    const bgBefore0 = await pieces.nth(0).locator('div[draggable]').evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );
    const bgBefore5 = await pieces.nth(5).locator('div[draggable]').evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );

    await dragPiece(page, 0, 5);

    // Po swapie backgroundPosition klocków powinny się zamienić
    const bgAfter0 = await pieces.nth(0).locator('div[draggable]').evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );
    const bgAfter5 = await pieces.nth(5).locator('div[draggable]').evaluate(
      (el) => (el as HTMLElement).style.backgroundPosition
    );

    expect(bgAfter0).toBe(bgBefore5);
    expect(bgAfter5).toBe(bgBefore0);

    // Liczba klocków niezmieniona
    await expect(pieces).toHaveCount(totalBefore);
  });

  // ── 12. Drag&drop grupy: moves rośnie, klocki nadal istnieją ─────────────
  test('drag&drop grupy 2 klocków zwiększa moves i zachowuje klocki', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    const totalBefore = await pieces.count();
    expect(totalBefore).toBeGreaterThanOrEqual(6);

    // Zaznacz 2 klocki
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(selectedPieces(page)).toHaveCount(2);

    // Odczytaj licznik przed
    const movesBefore = await page.locator('text=/\\d+ Move/').textContent();

    // Przeciągnij zaznaczony klocek na odległy slot
    await dragPiece(page, 0, 5);

    // Klocki nadal widoczne w tej samej liczbie
    await expect(pieces).toHaveCount(totalBefore);

    // Licznik moves wzrósł
    const movesAfter = await page.locator('text=/\\d+ Move/').textContent();
    expect(movesAfter).not.toBe(movesBefore);
  });

  // ── 13. Drag&drop na to samo miejsce nie zmienia moves ───────────────────
  test('upuszczenie klocka na to samo miejsce nie zwiększa moves', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    await expect(page.locator('text=/0 Move/')).toBeVisible();

    // Drag klocka na siebie samego
    await dragPiece(page, 3, 3);

    // Licznik wciąż 0
    await expect(page.locator('text=/0 Move/')).toBeVisible();
  });

  // ── 14. Badge z liczbą pokazuje się na zaznaczonych przy grupie ───────────
  test('przy zaznaczeniu >1 klocka badge z liczbą jest widoczny', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await pieces.nth(2).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);

    // Badge z liczbą "3" widoczny na zaznaczonych klockach
    const badge = page.locator('.cursor-grab .bg-blue-500.text-white');
    await expect(badge.first()).toBeVisible();
    await expect(badge.first()).toContainText('3');
  });

  // ── 15. Podpowiedź o Ctrl/Shift widoczna pod planszą ─────────────────────
  test('podpowiedź o multi-select jest widoczna pod planszą', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const hint = page.locator('p').filter({ hasText: /klocki|zazna/i });
    await expect(hint).toBeVisible();
    const hintText = await hint.textContent();
    expect(hintText).toMatch(/Ctrl|Shift/);
  });

  // ── 16. Grupowy drag poza granicę planszy: moves NIE rośnie ───────────────
  test('grupowy drag poza granicę planszy nie zwiększa moves', async ({
    page, navigateToHome, selectDifficulty9x13, startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    await expect(page.locator('text=/0 Move/')).toBeVisible();

    const pieces = page.locator('.cursor-grab');

    // Zaznacz dwa pierwsze klocki (pozycje 0 i 1)
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(selectedPieces(page)).toHaveCount(2);

    // Przeciągnij klocek 1 → klocek 0 (offset = –1).
    // isGroupMoveValid odrzuci ten ruch, bo klocek 0 musiałby trafić na pozycję –1.
    await dragPiece(page, 1, 0);

    // Ruch jest nieprawidłowy → licznik moves wciąż 0
    await expect(page.locator('text=/0 Move/')).toBeVisible();
  });

});
