<script setup lang="ts">
interface Props {
  isModalOpened: boolean;
}

withDefaults(defineProps<Props>(), {
  isModalOpened: false,
});
const emit = defineEmits(["continue"]);

const onClick = () => {
  emit("continue");
};
</script>

<template>
  <UiModal :isOpen="isModalOpened">
    <template #content>
      <div class="h-full flex flex-col items-center justify-center">
        <div class="text-7xl mb-6">Pause</div>
        <UiButton @click.stop="onClick">{{ $t("Continue") }}</UiButton>
      </div>
    </template>
    <template #footer><div /></template>
  </UiModal>
</template>
