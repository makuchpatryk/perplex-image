<script setup lang="ts">
import type { LevelsKeys } from "~/modules/core/constants";

interface Props {
  isModalOpened: boolean;
  moves: number;
  time: string;
  level: LevelsKeys;
}

withDefaults(defineProps<Props>(), {
  isModalOpened: false,
  time: "",
  moves: 0,
  level: "9x13" as LevelsKeys,
});
const emit = defineEmits(["submit", "close"]);

const closeModal = () => {
  emit("close");
};
const submitHandler = () => {
  emit("submit");
};
</script>

<template>
  <UiModal
    :isOpen="isModalOpened"
    @modal-close="closeModal"
    @submit="submitHandler"
  >
    <template #content>
      <div class="h-full flex flex-col items-center justify-center">
        <div class="text-7xl mb-6">{{ $t("Puzzle Complete!") }}</div>
        <div class="mt-4 mb-6">
          <div class="flex justify-between w-[200px]">
            <h2 class="font-semibold">Time</h2>
            <p v-text="time"></p>
          </div>
          <div class="flex justify-between w-[200px]">
            <h2 class="font-semibold">Level</h2>
            <p v-text="level"></p>
          </div>
          <div class="flex justify-between w-[200px]">
            <h2 class="font-semibold">Moves</h2>
            <p v-text="moves"></p>
          </div>
        </div>
        <UiButton @click.stop="submitHandler">
          {{ $t("Back to menu") }}
        </UiButton>
      </div>
    </template>
  </UiModal>
</template>
