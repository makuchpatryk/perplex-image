<script setup lang="ts">
import { vOnClickOutside } from "@vueuse/components";
const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close"]);

const onClickOutside = () => {
  emit("modal-close");
};
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed top-0 left-0 w-full h-full z-50">
      <div
        class="w-[1200px] h-[820px] absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] bg-[#DDDDDDEE] rounded-[40px] backdrop-blur-[5%] shadow-[0px_0px_23.9px_8px_#0000001A] p-10"
      >
        <div class="h-full w-full" v-on-click-outside="onClickOutside">
          <div>
            <slot name="header"></slot>
          </div>
          <div class="h-full w-full">
            <slot name="content"> default content </slot>
          </div>
          <div>
            <slot name="footer">
              <div>
                <button
                  class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
                  @click.stop="emit('modal-close')"
                  v-text="'Submit'"
                />
              </div>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
