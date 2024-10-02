<template>
  <div
    class="bg-gray-50 h-lvh overflow-hidden p-4 bg-gradient-to-r from-[#FBFBFB] from-10% via-[#FBFBFB] via-50% to-[#999896] to-100%"
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
