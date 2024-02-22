<script setup lang="ts">
import { useImagesStore } from "../stores/images";

interface Props {
  number: number;
}

const props = withDefaults(defineProps<Props>(), {
  number: 0,
});

let isModalOpened = ref<boolean>(false);
let shuffledPieces = ref<ImagePieces[]>([]);
const COLUMNS = 13;
const WIDTH_GAME = 1000;
let highlight = ref<number | string>("");
let imgSrc = ref<string | number>("");
let rand = Math.round(Math.random() * 9);

const { shuffle, imageToBase64, url, width, height } = await useImage(
  props.number
);

const heightScreen = ref<number>(Math.round((height / width) * WIDTH_GAME));

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
  const widthElement = WIDTH_GAME / COLUMNS;
  const heightElement =
    ((height / width) * WIDTH_GAME) / Math.round((height / width) * COLUMNS);

  for (let i = 0; i < COLUMNS * Math.round((height / width) * COLUMNS); i++) {
    pieces[i] = {
      position: i,
      backgroundPosition: `-${widthElement * Math.round(i % COLUMNS)}px -${
        heightElement * Math.floor(i / COLUMNS)
      }px`,
      width: `${widthElement}px`,
      height: `${heightElement}px`,
    };
  }
  shuffledPieces.value = shuffle(pieces);
});
</script>

<template>
  <div
    :style="{
      height: `${heightScreen + (COLUMNS - 1)}px`,
      width: `${WIDTH_GAME + (COLUMNS - 1)}px`,
    }"
  >
    <Modal
      :isOpen="isModalOpened"
      @modal-close="closeModal"
      @submit="submitHandler"
      name="first-modal"
    >
      <template #header>You won!!!!</template>
    </Modal>
    <img :src="imgSrc" width="400px" class="m-2 right" />
    <div class="flex flex-wrap gap-px">
      <Piece
        v-for="(item, key) in shuffledPieces"
        :item="item"
        :key="item.position"
        :img-src="imgSrc"
        :is-highlight="highlight === item.position"
        @swap="onSwap"
        @drag-enter="onDragEnter"
      />
    </div>
  </div>
</template>

<style scoped></style>
