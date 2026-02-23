import { Levels, WIDTH_GAME } from "~/modules/core/constants";
import type { ImagePieces } from "~/modules/core/types";
import type { GameData, GameProps } from "../views/GameView.vue";

async function useShuffle(props: GameProps, data: GameData) {
  const { shuffle } = await useImage();

  const heightElement = computed<number>(
    () =>
      ((data.height / data.width) *
        (WIDTH_GAME - Number(Levels[props.level]) * 2)) /
      Math.round((data.height / data.width) * Number(Levels[props.level]))
  );

  const widthElement = computed<number>(
    () =>
      (WIDTH_GAME - Number(Levels[props.level]) * 2) /
      Number(Levels[props.level])
  );

  function shufflePieces() {
    const pieces: ImagePieces[] = [];

    for (
      let i = 0;
      i <
      Number(Levels[props.level]) *
        Math.round((data.height / data.width) * Number(Levels[props.level]));
      i++
    ) {
      pieces[i] = {
        position: i,
        originalIndex: i,
        backgroundPosition: `-${
          widthElement.value * Math.round(i % Number(Levels[props.level]))
        }px -${
          heightElement.value * Math.floor(i / Number(Levels[props.level]))
        }px`,
        width: `${widthElement.value}px`,
        height: `${heightElement.value}px`,
      };
    }
    const shuffled = shuffle([...pieces]);
    // Zaktualizuj `position` (slot wizualny) do nowej kolejności po przetasowaniu
    // `originalIndex` pozostaje niezmieniony — to docelowe miejsce klocka
    return shuffled.map((piece: ImagePieces, idx: number) => ({
      ...piece,
      position: idx,
    }));
  }
  return { shufflePieces };
}

export { useShuffle };
