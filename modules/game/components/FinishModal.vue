<script setup lang="ts">
interface Props {
  isModalOpened: boolean;
  time: string;
  level: string;
}

const props = withDefaults(defineProps<Props>(), {
  isModalOpened: false,
  time: "",
  level: "",
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
  <Modal
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
  </Modal>
</template>
