<script setup lang="ts">
import { useImagesStore } from "~/modules/core/store/images";

const route = useRoute();

const { getImage } = useImagesStore();

getImage({ id: route.params.id });
</script>

<template>
  <Game :level="$route.query.level" />
</template>
