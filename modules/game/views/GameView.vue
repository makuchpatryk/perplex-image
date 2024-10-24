<script setup lang="ts">
import type { ImagePieces, PexelPhoto } from "~/modules/core/types";
import { Levels, WIDTH_GAME } from "~/modules/core/constants";

export interface GameProps {
  selectedImage: PexelPhoto;
  level: Levels;
}
export interface GameData {
  height: number;
  width: number;
  url: string;
  imgSrc: string;
  isModalOpened: boolean;
  shuffledPieces: ImagePieces[] | undefined;
  highlight: number | string;
  heightScreen: number | undefined;
}

const props = withDefaults(defineProps<GameProps>(), {
  level: Levels["9x13"],
});

const { imageToBase64 } = await useImage();

const data = reactive<GameData>({
  height: 1,
  width: 1,
  url: "",
  imgSrc: "",
  isModalOpened: false,
  shuffledPieces: void 0,
  highlight: "",
  heightScreen: void 0,
});

function openModal() {
  data.isModalOpened = true;
}
function closeModal() {
  data.isModalOpened = false;
}

function onSubmitHandler() {
  console.log("onSubmitHandler");
  //here you do whatever
}

const { shufflePieces } = await useShuffle(props, data);
const { displayTime, startStopwatch, onSwap, onDragEnter } = await useEventGame(
  props,
  data,
  {
    openModal,
  }
);

watch(
  () => props.selectedImage,
  (value) => {
    data.height = value.height;
    data.width = value.width;
    data.url = value.src.large;
    data.heightScreen = Math.round((value.height / value.width) * WIDTH_GAME);
  },
  {
    immediate: true,
  }
);

watch(
  () => data.url,
  (value) => {
    return imageToBase64(value, (s: unknown) => {
      if (typeof s === "string") {
        data.imgSrc = s;
      }
    });
  },
  {
    immediate: true,
    deep: true,
  }
);

onMounted(() => {
  data.shuffledPieces = shufflePieces();
  startStopwatch();
});
</script>

<template>
  <FinishModal
    :isModalOpened="data.isModalOpened"
    :time="displayTime"
    :level="level"
    @close="closeModal"
  />
  <div class="flex mx-6 my-12 w-full justify-between">
    <div class="flex justify-start overflow-auto">
      <div
        :style="{
          height: `${data.heightScreen}px`,
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
            v-for="item in data.shuffledPieces"
            :item="item"
            :key="item.position"
            :imgSrc="data.imgSrc"
            :is-highlight="data.highlight === item.position"
            @swap="onSwap"
            @drag-enter="onDragEnter"
          />
        </div>
      </div>
    </div>
    <div>
      <GameSidebar :imgSrc="data.imgSrc" :displayTime="displayTime" />
    </div>
  </div>
</template>
