<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useImagesStore } from "~/modules/core/store/images";
import type { LevelsKeys } from "~/modules/core/constants";

const route = useRoute();
const { getImage } = useImagesStore();
getImage({ id: route.params.id });
const { selectedImage } = storeToRefs(useImagesStore());

const level = computed(() => {
  const queryLevel = route.query.level;
  return (
    ((Array.isArray(queryLevel) ? queryLevel[0] : queryLevel) as LevelsKeys) ||
    ("9x13" as LevelsKeys)
  );
});

definePageMeta({
  layout: "game",
});
</script>

<template>
  <GameView
    v-if="selectedImage"
    :level="level"
    :selectedImage="selectedImage"
  />
</template>
