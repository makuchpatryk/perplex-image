<template>
  <div
      :class="[
      'h-lvh overflow-hidden p-4',
      'bg-[length:200%] animate-moving bg-gradient-to-r from-[#FBFBFB] to-[#bfbfbf]',
    ]"
  >
    <nav class="flex pb-2">
      <NuxtLink to="/">
        <img src="/assets/logo.svg" />
      </NuxtLink>
    </nav>
    <div class="flex w-full h-screen overflow-auto">
      <slot />
    </div>
  </div>
</template>

<style lang="css">
@import url("https://fonts.googleapis.com/css2?family=League+Spartan:wght@100..900&display=swap");

* {
  font-family: "League Spartan", sans-serif;
}
</style>
<script setup lang="ts">
</script>