<template>
  <div
    :class="[
      'h-lvh overflow-hidden p-4',
      'bg-[length:200%] animate-moving bg-gradient-to-r from-[#FBFBFB] to-[#bfbfbf]',
    ]"
  >
    <nav class="flex pb-2">
      <img src="/assets/logo.svg" />
    </nav>
    <div class="flex w-full h-screen">
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
