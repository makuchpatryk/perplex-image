import type { GameData, GameProps } from "../views/GameView.vue";
import type { TODO } from "~core/types";
import { Levels } from "~/modules/core/constants";

export interface Options {
  openModal: () => void;
}

export async function useEventGame(
  props: GameProps,
  data: GameData,
  { openModal }: Options
) {
  const { startStopwatch, stopStopwatch, resetStopwatch, displayTime } =
    await useStopwatch();

  /** Liczba kolumn na podstawie wybranego poziomu */
  const cols = computed(() => Number(Levels[props.level]));

  /** Całkowita liczba klocków */
  const totalPieces = computed(() => data.shuffledPieces?.length ?? 0);

  function checkIfIsCorrect() {
    return data.shuffledPieces?.every((i: TODO, k: TODO) => {
      return i.position === k;
    });
  }

  // ─── Selekcja ────────────────────────────────────────────────────────────

  function toggleSelection(position: number, multi: boolean) {
    if (!multi) {
      // Klik bez modyfikatora → odznaczamy wszystko i ewentualnie zaznaczamy ten klocek
      if (data.selectedPositions.includes(position)) {
        data.selectedPositions = [];
      } else {
        data.selectedPositions = [position];
      }
    } else {
      // Klik z Shift/Ctrl → toggle jednego elementu
      if (data.selectedPositions.includes(position)) {
        data.selectedPositions = data.selectedPositions.filter(
          (p: number) => p !== position
        );
      } else {
        data.selectedPositions = [...data.selectedPositions, position];
      }
    }
  }

  function clearSelection() {
    data.selectedPositions = [];
  }

  // ─── Drag highlight ───────────────────────────────────────────────────────

  let time: ReturnType<typeof setTimeout>;
  function onDragEnter({ position }: { position: number | string }) {
    clearTimeout(time);
    time = setTimeout(() => {
      data.highlight = position;
    }, 0);
  }

  // ─── Walidacja granic grupowego przesunięcia ──────────────────────────────

  /**
   * Sprawdza, czy przesunięcie grupy klocków o `offset` pozycji jest legalne:
   * – żaden klocek nie wychodzi poza tablicę
   * – żaden klocek nie „zawija" przez granicę wiersza
   */
  function isGroupMoveValid(
    draggedOriginalPos: number,
    targetPos: number,
    selectedSlots: number[]
  ): boolean {
    const offset = targetPos - draggedOriginalPos;
    const c = cols.value;
    const total = totalPieces.value;

    for (const pos of selectedSlots) {
      const newPos = pos + offset;
      if (newPos < 0 || newPos >= total) return false;

      // Sprawdzenie zawijania w wierszu
      const oldRow = Math.floor(pos / c);
      const newRow = Math.floor(newPos / c);
      const rowDiff = newRow - oldRow;
      const expectedRowDiff = Math.floor((draggedOriginalPos + offset) / c) - Math.floor(draggedOriginalPos / c);
      if (rowDiff !== expectedRowDiff) return false;
    }
    return true;
  }

  // ─── Pojedynczy swap ──────────────────────────────────────────────────────

  function onSwap({
    position,
    positionCurrent,
    selectedPositions,
  }: {
    position: number | string;
    positionCurrent: number | string;
    selectedPositions?: number[];
  }) {
    const draggedOriginalPos = Number(position);
    const targetPos = Number(positionCurrent);

    // Jeśli ciągniemy z grupy i jest więcej niż 1 zaznaczony element
    const isGroupDrag =
      selectedPositions &&
      selectedPositions.length > 1 &&
      selectedPositions.includes(draggedOriginalPos);

    if (isGroupDrag && selectedPositions) {
      onGroupSwap(draggedOriginalPos, targetPos, selectedPositions);
    } else {
      onSingleSwap(draggedOriginalPos, targetPos);
    }
  }

  function onSingleSwap(pos1: number, pos2: number) {
    const pieces = data.shuffledPieces;
    if (!pieces) return;

    // Znajdź klocek, który aktualnie leży na slocie pos1 i pos2
    const idx1 = pieces.findIndex((item: TODO) => item.position === pos1);
    const idx2 = pieces.findIndex((item: TODO) => item.position === pos2);

    if (idx1 === -1 || idx2 === -1) return;

    const newPieces = [...pieces];
    // Zamień pozycje (sloty) między klockami
    const tmp = newPieces[idx1].position;
    newPieces[idx1] = { ...newPieces[idx1], position: newPieces[idx2].position };
    newPieces[idx2] = { ...newPieces[idx2], position: tmp };

    // Posortuj według slotu aby siatka renderowała się w porządku
    data.shuffledPieces = [...newPieces].sort((a, b) => a.position - b.position);
    data.highlight = "";
    data.moves = data.moves + 1;
    clearSelection();
    if (checkIfIsCorrect()) {
      openModal();
      stopStopwatch();
    }
  }

  function onGroupSwap(
    draggedOriginalPos: number,
    targetPos: number,
    selectedSlots: number[]
  ) {
    const pieces = data.shuffledPieces;
    if (!pieces) return;

    if (!isGroupMoveValid(draggedOriginalPos, targetPos, selectedSlots)) {
      data.highlight = "";
      return;
    }

    const offset = targetPos - draggedOriginalPos;

    const targetSlots = selectedSlots.map((s) => s + offset);

    // Klocki, które są w strefie docelowej ale NIE są częścią zaznaczenia
    const displacedPieces = pieces.filter((p: TODO) =>
      targetSlots.includes(p.position) && !selectedSlots.includes(p.position)
    );

    // Klocki na wolnych slotach źródłowych (zwolnione przez grupę)
    const freeSourceSlots = selectedSlots.filter(
      (s) => !targetSlots.includes(s)
    );

    // Przypisz przemieszczonym klockom wolne sloty źródłowe
    const displacedMapping = displacedPieces.map((p: TODO, i: number) => ({
      piece: p,
      newSlot: freeSourceSlots[i],
    }));

    const newPieces = pieces.map((p: TODO) => {
      // Klocek z zaznaczonej grupy → przesuń o offset
      if (selectedSlots.includes(p.position)) {
        return { ...p, position: p.position + offset };
      }
      // Przemieszczony klocek → dostaje wolny slot
      const displaced = displacedMapping.find((d: { piece: TODO; newSlot: number }) => d.piece.position === p.position);
      if (displaced) {
        return { ...p, position: displaced.newSlot };
      }
      return p;
    });

    data.shuffledPieces = [...newPieces].sort((a, b) => a.position - b.position);
    data.highlight = "";
    data.moves = data.moves + 1;
    // Po ruchu grupowym aktualizuj selectedPositions do nowych slotów
    data.selectedPositions = targetSlots;

    if (checkIfIsCorrect()) {
      openModal();
      stopStopwatch();
    }
  }

  return {
    displayTime,
    startStopwatch,
    stopStopwatch,
    resetStopwatch,
    onDragEnter,
    onSwap,
    toggleSelection,
    clearSelection,
  };
}
