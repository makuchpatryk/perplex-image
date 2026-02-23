<script setup lang="ts">
import { WIDTH_GAME } from "../../core/constants";
import type { ImagePieces } from "~/modules/core/types";

interface Props {
  item: ImagePieces;
  isHighlight: boolean;
  isSelected: boolean;
  imgSrc: string;
  selectedPositions: number[];
}

withDefaults(defineProps<Props>(), {
  isHighlight: false,
  isSelected: false,
  selectedPositions: () => [],
});

const emit = defineEmits(["swap", "drag-enter", "select"]);

const startDrag = (
  evt: DragEvent & { dataTransfer?: DataTransfer },
  position: string,
  selectedPositions: number[]
) => {
  if (!evt.dataTransfer) return;
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("position", position);
  // Przekaż listę zaznaczonych slotów, żeby drop wiedział o grupie
  evt.dataTransfer.setData("selectedPositions", JSON.stringify(selectedPositions));

  // Customowy ghost image gdy przeciągamy grupę
  if (selectedPositions.length > 1) {
    const ghost = document.createElement("div");
    ghost.style.cssText =
      "position:fixed;top:-200px;left:-200px;display:flex;align-items:center;justify-content:center;background:rgba(59,130,246,0.9);color:white;font-weight:bold;font-size:16px;border-radius:10px;padding:8px 16px;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,0.3);gap:6px;";
    ghost.innerHTML = `<span style="font-size:18px;">✕${selectedPositions.length}</span><span style="font-size:12px;opacity:0.9;">klocki</span>`;
    document.body.appendChild(ghost);
    evt.dataTransfer.setDragImage(ghost, ghost.offsetWidth / 2, ghost.offsetHeight / 2);
    setTimeout(() => {
      if (document.body.contains(ghost)) document.body.removeChild(ghost);
    }, 0);
  }
};

const onDragEnter = (evt: DragEvent, position: number | string) => {
  evt.preventDefault();
  evt.stopPropagation();
  emit("drag-enter", { position });
};

const onDrop = (
  evt: DragEvent & { dataTransfer?: DataTransfer },
  positionCurrent: number
) => {
  if (!evt.dataTransfer) return;
  const position = evt.dataTransfer.getData("position");
  const raw = evt.dataTransfer.getData("selectedPositions");
  let selectedPositions: number[];
  try {
    selectedPositions = JSON.parse(raw);
  } catch {
    selectedPositions = [];
  }
  emit("swap", { position, positionCurrent, selectedPositions });
};

const onPieceClick = (evt: MouseEvent, position: number) => {
  const multi = evt.shiftKey || evt.ctrlKey || evt.metaKey;
  emit("select", { position, multi });
};
</script>

<template>
  <div
    @drop="onDrop($event, item.position)"
    @dragover.prevent
    @dragenter="onDragEnter($event, item.position)"
    :key="item.position"
    :class="[
      isHighlight && !isSelected && 'opacity-40',
      isSelected
        ? 'ring-[3px] ring-blue-400 ring-inset z-10 scale-[0.93] shadow-[0_0_0_3px_rgba(96,165,250,0.5)]'
        : 'hover:opacity-80',
    ]"
    class="cursor-grab m-[1px] relative select-none transition-transform duration-100"
    @click="onPieceClick($event, item.position)"
  >
    <!-- Nakładka zaznaczenia -->
    <div
      v-if="isSelected"
      class="absolute inset-0 bg-blue-500/30 pointer-events-none z-10 mix-blend-multiply"
    />
    <!-- Znacznik liczby w rogu gdy zaznaczono grupę -->
    <div
      v-if="isSelected && selectedPositions.length > 1"
      class="absolute top-0.5 right-0.5 z-20 bg-blue-500 text-white text-[9px] font-bold leading-none rounded-sm px-1 py-0.5 pointer-events-none"
    >
      {{ selectedPositions.length }}
    </div>
    <div
      draggable="true"
      class="overflow-hidden"
      @dragstart="startDrag($event, String(item.position), selectedPositions)"
      :style="{
        backgroundPosition: item.backgroundPosition,
        width: item.width,
        height: item.height,
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: `${WIDTH_GAME}px auto`,
      }"
    />
  </div>
</template>
