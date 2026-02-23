import type { GameData, GameProps } from "../views/GameView.vue";
import type { TODO } from "~core/types";

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

  function checkIfIsCorrect() {
    return data.shuffledPieces?.every((i: TODO, k: TODO) => {
      return i.position === k;
    });
  }
  let time: ReturnType<typeof setTimeout>;
  function onDragEnter({ position }: { position: number | string }) {
    clearTimeout(time);
    time = setTimeout(() => {
      data.highlight = position;
    }, 0);
  }

  function onSwap({
    position,
    positionCurrent,
  }: {
    position: number | string;
    positionCurrent: number | string;
  }) {
    const item1 = data.shuffledPieces?.find(
      (item: TODO) => item.position == position
    );
    const item2 = data.shuffledPieces?.find(
      (item: TODO) => item.position == positionCurrent
    );

    if (item1 && item2) {
      data.shuffledPieces = data.shuffledPieces?.map((i: TODO) => {
        if (i.position === item2.position) {
          return {
            ...item1,
          };
        }
        if (i.position === item1.position) {
          return {
            ...item2,
          };
        }
        return {
          ...i,
        };
      });
    }

    data.highlight = "";
    data.moves = data.moves + 1;
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
  };
}
