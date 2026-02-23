<script setup lang="ts">
import { LevelsKeys, WIDTH_GAME } from "~/modules/core/constants";
import type { GameProps, GameData } from "../types";

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
  <Teleport to="body">
    <Transition name="preview-overlay">
      <div
        v-if="enlargePreview"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer"
        @click.self="enlargePreview = false"
      >
        <div class="relative flex flex-col items-center gap-3 pointer-events-none">
          <span aria-hidden="true" class="pointer-events-none select-none bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md border border-white/30">
            {{ $t("Preview") }}
          </span>
          <img
            :src="data.imgSrc"
            :alt="$t('Preview')"
            class="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl pointer-events-none select-none"
          />
          <button
            :aria-label="$t('Close preview')"
            class="pointer-events-auto absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition backdrop-blur-md border border-white/30 text-sm font-bold"
            @click="enlargePreview = false"
          >✕</button>
        </div>
      </div>
    </Transition>
  </Teleport>
  <div class="items-center flex mx-auto w-[700px] flex-col mt-10">
    <div class="mb-10 h-[66px]">
      <img
        :src="data.imgSrc"
        class="w-[100px] h-full object-cover rounded cursor-pointer shadow-[0px_0px_23.9px_8px_#0000001A] hover:opacity-70 hover:scale-105 transition duration-200 ease-in-out"
        :title="$t('Preview')"
        @click="enlargePreview = true"
        alt=""
      />
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
    <!-- Podpowiedź multi-select -->
    <p class="mt-3 text-xs text-[#aaa] text-center w-full select-none">
      Przytrzymaj <kbd class="font-sans bg-[#f0f0f0] text-[#555] border border-[#ccc] rounded px-1 py-0.5 text-[10px]">Ctrl</kbd> lub <kbd class="font-sans bg-[#f0f0f0] text-[#555] border border-[#ccc] rounded px-1 py-0.5 text-[10px]">Shift</kbd> i klikaj klocki, aby zaznaczyć kilka i przeciągnąć grupę
    </p>
  </div>
</template>

<style scoped>
.preview-overlay-enter-active,
.preview-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.preview-overlay-enter-active .relative,
.preview-overlay-leave-active .relative {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.preview-overlay-enter-from,
.preview-overlay-leave-to {
  opacity: 0;
}
.preview-overlay-enter-from .relative {
  transform: scale(0.85);
  opacity: 0;
}
.preview-overlay-leave-to .relative {
  transform: scale(0.85);
  opacity: 0;
}
</style>
