<template>
  <div
      :class="[
      'min-h-lvh overflow-x-hidden p-4',
      'bg-[length:200%] animate-moving bg-gradient-to-r from-[#FBFBFB] to-[#bfbfbf]',
    ]"
  >
    <nav class="flex pb-2">
      <NuxtLink to="/">
        <img src="/assets/logo.svg" />
      </NuxtLink>
    </nav>
    <div class="flex w-full h-full overflow-y-auto overflow-x-hidden">
      <slot />
    </div>
  </div>
</template>

<style lang="css">

* {
  font-family: "League Spartan", sans-serif;
}
</style>
<script setup lang="ts">
</script>