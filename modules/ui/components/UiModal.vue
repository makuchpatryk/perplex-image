<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close", "submit"]);

const onClickOutside = () => {
  emit("modal-close");
};
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed top-0 left-0 w-full h-full z-50">
      <div
        class="w-[min(90vw,1200px)] h-[min(85vh,820px)] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] bg-[#DDDDDDEE] rounded-[40px] backdrop-blur-[5%] shadow-[0px_0px_23.9px_8px_#0000001A] p-10"
      >
        <div
          class="flex flex-col h-full w-full"
          v-on-click-outside="onClickOutside"
        >
          <div>
            <slot name="header"></slot>
          </div>
          <div class="w-full grow overflow-hidden">
            <slot name="content"> default content </slot>
          </div>
          <div>
            <slot name="footer"> </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
