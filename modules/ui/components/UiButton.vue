<script setup lang="ts">
interface Props {
  type?: "default" | "outline";
}

withDefaults(defineProps<Props>(), {
  type: "default",
});
</script>

<template>
  <button
    :class="[
      ' rounded-[20px] text-2xl font-normal text-[#303030] px-[12px] pt-[8px] pb-[6px] flex items-center',
      'transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200',
      {
        'bg-[#FFFFFF66] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040]':
          type === 'default',
        'border-[2px] border-[#303030] shadow-none': type === 'outline',
      },
    ]"
    type="button"
    v-bind="$attrs"
  >
    <slot></slot>
  </button>
</template>
