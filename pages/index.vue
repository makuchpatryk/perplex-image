<script setup lang="ts">
import { useImagesStore } from "../stores/images";

useImagesStore().getImages();
</script>

<template>
  <StartMenuForm />
</template>
