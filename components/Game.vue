<script setup lang="ts">
import { useImagesStore } from "../stores/images";

interface Props {
  number: string;
  level: string;
  widthGame: number;
}

const props = withDefaults(defineProps<Props>(), {
  number: "1",
  level: "1",
  widthGame: 1000,
});

let isModalOpened = ref<boolean>(false);
let shuffledPieces = ref<ImagePieces[]>([]);
let highlight = ref<number | string>("");
let imgSrc = ref<string | ArrayBuffer | null>("");

const { shuffle, imageToBase64, url, width, height } = await useImage(
  props.number
);
const {
  startStopwatch,
  stopStopwatch,
  resetStopwatch,
  updateStopwatch,
  displayTime,
} = await useStopwatch();

const heightScreen = ref<number>(
  Math.round((height / width) * props.widthGame)
);

const checkIfIsCorrect = () => {
  return shuffledPieces.value.every((i, k) => {
    return i.position === k;
  });
};

const openModal = () => {
  isModalOpened.value = true;
};
const closeModal = () => {
  isModalOpened.value = false;
};

const submitHandler = () => {
  //here you do whatever
};

let time: ReturnType<typeof setTimeout>;
const onDragEnter = ({ position }: { position: number | string }) => {
  clearTimeout(time);
  time = setTimeout(() => {
    highlight.value = position;
  }, 0);
};

const onSwap = ({
  position,
  positionCurrent,
}: {
  position: number | string;
  positionCurrent: number | string;
}) => {
  const item1 = shuffledPieces.value.find((item) => item.position == position);
  const item2 = shuffledPieces.value.find(
    (item) => item.position == positionCurrent
  );

  if (item1 && item2) {
    shuffledPieces.value = [
      ...shuffledPieces.value.map((i) => {
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
      }),
    ];
  }

  highlight.value = "";

  if (checkIfIsCorrect()) {
    openModal();
  }
};

onMounted(() => {
  imageToBase64(url, (s: string | ArrayBuffer | null) => {
    imgSrc.value = s;
  });

  const pieces: ImagePieces[] = [];
  const widthElement = props.widthGame / Number(props.level);
  const heightElement =
    ((height / width) * props.widthGame) /
    Math.round((height / width) * Number(props.level));

  for (
    let i = 0;
    i <
    Number(props.level) * Math.round((height / width) * Number(props.level));
    i++
  ) {
    pieces[i] = {
      position: i,
      backgroundPosition: `-${
        widthElement * Math.round(i % Number(props.level))
      }px -${heightElement * Math.floor(i / Number(props.level))}px`,
      width: `${widthElement}px`,
      height: `${heightElement}px`,
    };
  }
  shuffledPieces.value = shuffle(pieces);
  startStopwatch();
});
</script>

<template>
  <Modal
    :isOpen="isModalOpened"
    @modal-close="closeModal"
    @submit="submitHandler"
  >
    <template #header>Summary</template>
  </Modal>

  <div class="flex mx-6 my-12 w-full justify-between">
    <div class="flex justify-start overflow-auto">
      <div
        :style="{
          height: `${heightScreen}px`,
          width: `${widthGame}px`,
        }"
      >
        <div
          class="flex flex-wrap"
          :style="{
            minWidth: `${widthGame}px`,
          }"
        >
          <Piece
            v-for="(item, key) in shuffledPieces"
            :item="item"
            :key="item.position"
            :img-src="imgSrc"
            :is-highlight="highlight === item.position"
            :widthGame="widthGame"
            @swap="onSwap"
            @drag-enter="onDragEnter"
          />
        </div>
      </div>
    </div>
    <div>
      <img :src="imgSrc" width="400px" class="ml-2 right" />
      <span v-text="displayTime" />
    </div>
  </div>
</template>

<style scoped></style>
