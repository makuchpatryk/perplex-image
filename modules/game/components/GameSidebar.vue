<script setup lang="ts">
interface Props {
  imgSrc: string;
  displayTime: string;
}

withDefaults(defineProps<Props>(), {
  imgSrc: "",
  displayTime: "",
});
</script>

<template>
  <img :src="imgSrc" width="400px" class="ml-2 right" />
  <span v-text="displayTime" />
</template>
