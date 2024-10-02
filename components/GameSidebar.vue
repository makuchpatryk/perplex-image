<script setup lang="ts">
interface Props {
  imgSrc: string;
  displayTime: string;
}

const props = withDefaults(defineProps<Props>(), {
  imgSrc: "",
  displayTime: "",
});
</script>

<template>
  <img :src="imgSrc" width="400px" class="ml-2 right" />
  <span v-text="displayTime" />
</template>
