<script setup lang="ts">
import type { Levels } from "~/modules/core/constants";

interface Props {
  isModalOpened: boolean;
  time: string;
  level: Levels;
}

withDefaults(defineProps<Props>(), {
  isModalOpened: false,
  time: "",
  level: "9x13" as unknown as Levels,
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
    <template #header>Summary</template>
    <template #content>
      <span>
        <h2>Time</h2>
        <p v-text="time"></p>
      </span>
      <span>
        <h2>Level</h2>
        <p v-text="level"></p>
      </span>
    </template>
  </UiModal>
</template>
