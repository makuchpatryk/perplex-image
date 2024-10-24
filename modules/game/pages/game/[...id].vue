<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useImagesStore } from "~/modules/core/store/images";

const route = useRoute();
const { getImage } = useImagesStore();
getImage({ id: route.params.id });
const { selectedImage } = storeToRefs(useImagesStore());
</script>

<template>
  <GameView
    v-if="selectedImage"
    :level="route.query.level"
    :selectedImage="selectedImage"
  />
</template>
