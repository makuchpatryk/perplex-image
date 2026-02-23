<script setup lang="ts">
import type { ImagePieces, PexelPhoto } from "~/modules/core/types";
import { LevelsKeys, WIDTH_GAME } from "~/modules/core/constants";

export interface GameProps {
  selectedImage: PexelPhoto;
  level: LevelsKeys;
}
export interface GameData {
  height: number;
  width: number;
  url: string;
  imgSrc: string;
  isFinishedModalOpened: boolean;
  isPauseModalOpened: boolean;
  shuffledPieces: ImagePieces[] | undefined;
  highlight: number | string;
  heightScreen: number;
  moves: number;
  selectedPositions: number[];
}

const props = withDefaults(defineProps<GameProps>(), {
  level: LevelsKeys["9x13"],
});

const { t } = useI18n();
const enlargePreview = ref(false)

const { imageToBase64 } = await useImage();

const data = reactive<GameData>({
  height: 1,
  width: 1,
  url: "",
  imgSrc: "",
  isFinishedModalOpened: false,
  isPauseModalOpened: false,
  shuffledPieces: void 0,
  highlight: "",
  heightScreen: 0,
  moves: 0,
  selectedPositions: [],
});

function openModal() {
  data.isFinishedModalOpened = true;
}
function closeModal() {
  data.isFinishedModalOpened = false;
}

async function onSubmitHandler() {
  await navigateTo({
    path: `/`,
  });
}

const { shufflePieces } = await useShuffle(props, data);
const {
  displayTime,
  startStopwatch,
  stopStopwatch,
  resetStopwatch,
  onSwap,
  onDragEnter,
  toggleSelection,
  clearSelection,
} = await useEventGame(props, data, {
  openModal,
});

const displayMoves = computed(() => {
  return `${data.moves} ${t("Move")}${data.moves > 1 ? "s" : ""}`;
});
function onPause() {
  data.isPauseModalOpened = true;
  stopStopwatch();
  clearSelection();
}
function onReset() {
  data.moves = 0;
  data.shuffledPieces = shufflePieces();
  resetStopwatch();
  startStopwatch();
  clearSelection();
}
function onContinue() {
  data.isPauseModalOpened = false;
  startStopwatch();
}

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
  <PauseModal :isModalOpened="data.isPauseModalOpened" @continue="onContinue" />
  <FinishModal
    :isModalOpened="data.isFinishedModalOpened"
    :time="displayTime"
    :level="level"
    :moves="data.moves"
    @close="closeModal"
    @submit="onSubmitHandler"
  />
  <div class="items-center flex mx-auto w-[700px] flex-col mt-10">
    <div class="mb-10 h-[66px]">
      <img
          :src="data.imgSrc"
          :class="['transition duration-300 ease-in-out cursor-pointer', enlargePreview ? 'scale-150' : 'w-[100px] backdrop-blur-[5%] shadow-[0px_0px_23.9px_8px_#0000001A]  hover:opacity-70']"
          @click="() => {
          enlargePreview = !enlargePreview;
        }"
       alt=""/>
    </div>
    <div
      :class="['flex justify-start backdrop-blur-[5%] shadow-[0px_0px_23.9px_8px_#0000001A]']"
    >
      <div
        :style="{
          height: `${data.heightScreen + 2}px`,
          width: `${WIDTH_GAME}px`,
        }"
      >
        <div
          class="flex flex-wrap "
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
            :is-selected="data.selectedPositions.includes(item.position)"
            :selected-positions="data.selectedPositions"
            @swap="onSwap"
            @drag-enter="onDragEnter"
            @select="({ position, multi }) => toggleSelection(position, multi)"
          />
        </div>
      </div>
    </div>
    <div class="mt-10 flex justify-between w-full items-center">
      <UiButton type="outline" @click="onReset">{{ $t("RESTART") }}</UiButton>
      <UiButton type="outline" @click="onPause">{{ $t("PAUSE") }}</UiButton>
      <div class="text-[#303030] text-2xl">
        {{ displayMoves }}
      </div>
      <div class="text-[#303030] text-2xl">{{ displayTime }}</div>
    </div>
    <!-- Pasek selekcji grupowej -->
    <div
      v-if="data.selectedPositions.length > 0"
      class="mt-4 flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg w-full"
    >
      <span class="text-blue-700 text-sm font-medium">
        {{ data.selectedPositions.length }} {{ data.selectedPositions.length === 1 ? 'klocek zaznaczony' : 'klocki zaznaczone' }} — przeciągnij grupę w nowe miejsce
      </span>
      <button
        class="ml-auto text-xs text-blue-500 underline hover:text-blue-700"
        @click="clearSelection"
      >
        Odznacz wszystko
      </button>
    </div>
  </div>
</template>
