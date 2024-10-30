import type { GameData, GameProps } from "../views/GameView.vue";

export interface Options {
  openModal: () => void;
}

async function useEventGame(
  props: GameProps,
  data: GameData,
  { openModal }: Options
) {
  const { startStopwatch, stopStopwatch, resetStopwatch, displayTime } =
    await useStopwatch();

  function checkIfIsCorrect() {
    return data.shuffledPieces?.every((i, k) => {
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
      (item) => item.position == position
    );
    const item2 = data.shuffledPieces?.find(
      (item) => item.position == positionCurrent
    );

    if (item1 && item2) {
      data.shuffledPieces = data.shuffledPieces?.map((i) => {
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

export { useEventGame };
