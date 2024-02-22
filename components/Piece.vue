<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useImagesStore } from "../stores/images";

const { shuffledPieces } = storeToRefs(useImagesStore());

interface Props {
  item: ImagePieces;
  isHighlight: boolean;
  imgSrc: string;
}

const props = withDefaults(defineProps<Props>(), {
  isHighlight: false,
});

const emit = defineEmits(["swap", "drag-enter"]);

const startDrag = (evt, position: number | string) => {
  evt.dataTransfer.dropEffect = "move";
  evt.dataTransfer.effectAllowed = "move";
  evt.dataTransfer.setData("position", position);
};
const onDragEnter = (evt, position: number | string) => {
  evt.preventDefault();
  evt.stopPropagation();

  emit("drag-enter", {
    position,
  });
};

const onDrop = (evt, positionCurrent: number | string) => {
  const position = evt.dataTransfer.getData("position");

  emit("swap", {
    position,
    positionCurrent,
  });
};
</script>

<template>
  <div
    @drop="onDrop($event, item.position)"
    @dragover.prevent
    @dragenter="onDragEnter($event, item.position)"
    :key="item.position"
    :class="isHighlight && 'opacity-50'"
  >
    <div
      draggable="true"
      class="overflow-hidden"
      @dragstart="startDrag($event, item.position)"
      :style="{
        backgroundPosition: item.backgroundPosition,
        width: item.width,
        height: item.height,
        backgroundImage: `url(${imgSrc})`,
        backgroundSize: '1000px auto',
      }"
    />
  </div>
</template>
