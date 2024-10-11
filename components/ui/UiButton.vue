<script setup lang="ts"></script>

<template>
  <button
    :class="[
      'bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-2xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] py-[9px] flex items-center',
      'transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200',
    ]"
    type="button"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>
