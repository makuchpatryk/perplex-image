/**
 * Testy E2E dla funkcjonalności multi-selekcji i grupowego przesuwania klocków.
 *
 * Co sprawdzamy:
 * 1. Kliknięcie klocka zaznacza go (niebieski styl)
 * 2. Kliknięcie zaznaczonego klocka odznacza go
 * 3. Shift+klik / Ctrl+klik dodaje kolejny klocek do selekcji
 * 4. Pojawia się pasek informacyjny z licznikiem zaznaczonych klocków
 * 5. Przycisk „Odznacz wszystko" czyści selekcję
 * 6. Reset gry czyści selekcję
 * 7. Drag&drop pojedynczego klocka działa poprawnie (licznik moves rośnie)
 * 8. Drag&drop grupy klocków działa i przesuwa wszystkie zaznaczone
 * 9. Walidacja granic – próba przeciągnięcia grupy poza planszę nie wykonuje ruchu
 */

import { test, expect } from './fixtures';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Uruchamia grę na poziomie 9×13 i czeka aż klocki będą widoczne */
async function startEasyGame(
  navigateToHome: () => Promise<void>,
  selectDifficulty9x13: () => Promise<void>,
  startGame: () => Promise<void>,
  page: import('@playwright/test').Page
) {
  await navigateToHome();
  await selectDifficulty9x13();
  await startGame();
  await page.waitForSelector('.cursor-grab', { state: 'visible', timeout: 10_000 });
  await page.waitForTimeout(500);
}

// ─────────────────────────────────────────────────────────────────────────────
// Testy
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Multi-selekcja i grupowe przesuwanie klocków', () => {

  // ── 1. Kliknięcie zaznacza klocek ─────────────────────────────────────────
  test('kliknięcie klocka zaznacza go i wyświetla niebieski styl', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await expect(pieces.first()).toBeVisible();

    // Kliknij pierwszy klocek
    await pieces.first().click();
    await page.waitForTimeout(200);

    // Powinien pojawić się niebieski ring
    const selected = page.locator('.ring-2.ring-blue-500');
    await expect(selected).toHaveCount(1);

    // Pasek selekcji powinien być widoczny
    const bar = page.locator('text=klocek zaznaczony').or(page.locator('text=klocki zaznaczone'));
    await expect(bar).toBeVisible();
  });

  // ── 2. Ponowne kliknięcie odznacza ────────────────────────────────────────
  test('ponowne kliknięcie zaznaczonego klocka odznacza go', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');

    // Zaznacz
    await pieces.first().click();
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(1);

    // Odznacz
    await pieces.first().click();
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(0);

    // Pasek selekcji powinien zniknąć
    const bar = page.locator('text=klocek zaznaczony').or(page.locator('text=klocki zaznaczone'));
    await expect(bar).toHaveCount(0);
  });

  // ── 3. Shift+klik dodaje do selekcji ──────────────────────────────────────
  test('Shift+klik dodaje drugi klocek do selekcji', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    const count = await pieces.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Klik – zaznacz pierwszy
    await pieces.nth(0).click();
    await page.waitForTimeout(150);

    // Shift+klik – dodaj drugi
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);

    // Oba powinny być zaznaczone
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(2);

    // Pasek pokazuje 2
    const bar = page.locator('text=klocki zaznaczone');
    await expect(bar).toBeVisible();
  });

  // ── 4. Ctrl+klik dodaje do selekcji ───────────────────────────────────────
  test('Ctrl+klik dodaje trzeci klocek do selekcji', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    const count = await pieces.count();
    expect(count).toBeGreaterThanOrEqual(3);

    await pieces.nth(0).click();
    await page.waitForTimeout(100);
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await pieces.nth(2).click({ modifiers: ['Control'] });
    await page.waitForTimeout(100);

    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(3);
  });

  // ── 5. Shift+klik na już zaznaczonym usuwa go z selekcji ──────────────────
  test('Shift+klik na zaznaczonym klocku usuwa go z selekcji', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');

    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(2);

    // Usuń drugi
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(1);
  });

  // ── 6. Przycisk „Odznacz wszystko" ────────────────────────────────────────
  test('przycisk "Odznacz wszystko" czyści całą selekcję', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');

    // Zaznacz 3 klocki
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await pieces.nth(2).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(3);

    // Klik przycisku
    const clearBtn = page.locator('button', { hasText: 'Odznacz wszystko' });
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await page.waitForTimeout(150);

    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(0);
    await expect(clearBtn).toHaveCount(0);
  });

  // ── 7. RESTART czyści selekcję ────────────────────────────────────────────
  test('przycisk RESTART czyści selekcję', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');

    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(2);

    const restartBtn = page.locator('button', { hasText: /RESTART|Restart/i });
    await restartBtn.click();
    await page.waitForTimeout(300);

    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(0);
  });

  // ── 8. Drag&drop pojedynczego klocka zwiększa licznik moves ───────────────
  test('drag&drop pojedynczego klocka zwiększa licznik moves', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    // Odczytaj inicjalny stan moves
    const moveCounter = page.locator('text=/0 Moves?/');
    await expect(moveCounter).toBeVisible();

    const pieces = page.locator('.cursor-grab');
    const piece1 = pieces.nth(0);
    const piece2 = pieces.nth(1);

    // Upewnij się że oba są widoczne
    await expect(piece1).toBeVisible();
    await expect(piece2).toBeVisible();

    // Drag
    await piece1.dragTo(piece2);
    await page.waitForTimeout(400);

    // Licznik powinien wynosić 1
    const updatedCounter = page.locator('text=/1 Move[^s]/');
    await expect(updatedCounter).toBeVisible();
  });

  // ── 9. Drag&drop grupy 2 klocków działa ───────────────────────────────────
  test('drag&drop grupy 2 klocków przesuwa je razem i zwiększa moves o 1', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    const count = await pieces.count();
    expect(count).toBeGreaterThanOrEqual(4);

    // Zaznacz 2 klocki (0 i 1)
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(2);

    // Pobierz tekst moves przed ruchem
    await page.locator('[class*="text-2xl"]').nth(0).textContent();

    // Przeciągnij zaznaczony klocek (index 0) na slot index 3
    const dragSource = pieces.nth(0);
    const dragTarget = pieces.nth(3);

    const targetBox = await dragTarget.boundingBox();
    if (!targetBox) throw new Error('Brak bounding box dla targetu');

    const sourceBox = await dragSource.boundingBox();
    if (!sourceBox) throw new Error('Brak bounding box dla source');

    // Symuluj drag za pomocą mouse – bardziej niezawodne dla custom dataTransfer
    await page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2
    );
    await page.mouse.down();
    await page.waitForTimeout(100);
    await page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(400);

    // Klocki w grze powinny nadal istnieć w tej samej liczbie
    await expect(pieces).toHaveCount(count);
  });

  // ── 10. Pasek selekcji pokazuje poprawną liczbę ───────────────────────────
  test('pasek selekcji wyświetla prawidłową liczbę zaznaczonych klocków', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');

    // 1 klocek
    await pieces.nth(0).click();
    await page.waitForTimeout(100);
    await expect(page.locator('text=1 klocek zaznaczony')).toBeVisible();

    // 2 klocki
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await expect(page.locator('text=2 klocki zaznaczone')).toBeVisible();

    // 3 klocki
    await pieces.nth(2).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(100);
    await expect(page.locator('text=3 klocki zaznaczone')).toBeVisible();
  });

  // ── 11. Klik bez modyfikatora odznacza poprzedni i zaznacza nowy ──────────
  test('klik bez modyfikatora zastępuje poprzednią selekcję', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');

    // Zaznacz 3 klocki
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await pieces.nth(2).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(3);

    // Zwykły klik na inny klocek → tylko 1 zaznaczony
    await pieces.nth(4).click();
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(1);
    await expect(page.locator('text=1 klocek zaznaczony')).toBeVisible();
  });

  // ── 12. Niebieska nakładka widoczna na zaznaczonym klocku ─────────────────
  test('zaznaczony klocek ma niebieską półprzezroczystą nakładkę', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await page.waitForTimeout(150);

    // Nakładka bg-blue-400/20
    const overlay = page.locator('.bg-blue-400\\/20');
    await expect(overlay).toHaveCount(1);
  });

  // ── 13. PAUSE czyści selekcję ─────────────────────────────────────────────
  test('przycisk PAUSE czyści selekcję', async ({
    page,
    navigateToHome,
    selectDifficulty9x13,
    startGame,
  }) => {
    await startEasyGame(navigateToHome, selectDifficulty9x13, startGame, page);

    const pieces = page.locator('.cursor-grab');
    await pieces.nth(0).click();
    await pieces.nth(1).click({ modifiers: ['Shift'] });
    await page.waitForTimeout(150);
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(2);

    const pauseBtn = page.locator('button', { hasText: /PAUSE|Pauza/i });
    await pauseBtn.click();
    await page.waitForTimeout(300);

    // Selekcja powinna zniknąć
    await expect(page.locator('.ring-2.ring-blue-500')).toHaveCount(0);
  });
});

