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
      isHighlight && !isSelected && 'opacity-50',
      isSelected
        ? 'ring-2 ring-blue-500 ring-inset z-10 brightness-110'
        : '',
    ]"
    class="cursor-grab hover:opacity-80 m-[1px] relative select-none"
    @click="onPieceClick($event, item.position)"
  >
    <!-- Nakładka informująca o selekcji -->
    <div
      v-if="isSelected"
      class="absolute inset-0 bg-blue-400/20 pointer-events-none z-10"
    />
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
