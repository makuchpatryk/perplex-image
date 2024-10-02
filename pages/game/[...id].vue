<script setup lang="ts">
const route = useRoute();
import { useImagesStore } from "../../stores/images";

const { getImage } = useImagesStore();

getImage({ id: route.params.id });
</script>

<template>
  <Game :level="$route.query.level" />
</template>
