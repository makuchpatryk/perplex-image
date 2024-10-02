<script setup lang="ts">
import { useImagesStore } from "../stores/images";
import { storeToRefs } from "pinia";
import { WIDTH_GAME } from "../constants";

interface Props {
  level: string;
}

const props = withDefaults(defineProps<Props>(), {
  level: "1",
});

const { seletedImage, images } = storeToRefs(useImagesStore());
const { shuffle, imageToBase64 } = await useImage();

const {
  height,
  width,
  src: { large: url },
} = seletedImage.value;

let isModalOpened = ref<boolean>(false);
let shuffledPieces = ref<ImagePieces[]>([]);
let highlight = ref<number | string>("");
let imgSrc = ref<string | ArrayBuffer | null>("");

const {
  startStopwatch,
  stopStopwatch,
  resetStopwatch,
  updateStopwatch,
  displayTime,
} = await useStopwatch();

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
const onCloseModal = () => {
  closeModal();
};

const onSubmitHandler = () => {
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
          console.log("item1", item1);
          return {
            ...item1,
          };
        }
        if (i.position === item1.position) {
          console.log("item2", item2);

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
    stopStopwatch();
  }
};

onMounted(() => {
  imageToBase64(url, (s: string | ArrayBuffer | null) => {
    imgSrc.value = s;
  });

  const pieces: ImagePieces[] = [];
  const widthElement = WIDTH_GAME / Number(props.level);
  const heightElement =
    ((height / width) * WIDTH_GAME) /
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
  <FinishModal
    :isModalOpened="isModalOpened"
    :time="displayTime"
    :level="level"
    @close="onCloseModal"
    @submit="onSubmitHandler"
  />
  <div class="flex mx-6 my-12 w-full justify-between">
    <div class="flex justify-start overflow-auto">
      <div
        :style="{
          height: `${heightScreen}px`,
          width: `${WIDTH_GAME}px`,
        }"
      >
        <div
          class="flex flex-wrap"
          :style="{
            minWidth: `${WIDTH_GAME}px`,
          }"
        >
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
    </div>
    <div>
      <GameSidebar :imgSrc="imgSrc" :displayTime="displayTime" />
    </div>
  </div>
</template>

<style scoped></style>
