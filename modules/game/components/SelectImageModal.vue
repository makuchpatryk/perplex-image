<script setup lang="ts">
import type { PexelPhoto } from "~/modules/core/types";

interface Props {
  isModalOpened: boolean;
  photos: PexelPhoto[];
}

withDefaults(defineProps<Props>(), {
  isModalOpened: false,
  photos: () => [],
});
const emit = defineEmits(["submit", "close"]);

const onCloseModal = () => {
  emit("close");
};
const onClick = (data: PexelPhoto) => {
  emit("submit", data);
};
</script>

<template>
  <UiModal :isOpen="isModalOpened" @modal-close="onCloseModal">
    <template #content>
      <div
        class="h-full overflow-auto p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-[linear-gradient(180deg,_#ffffff_0%,_#999999_100%)]"
      >
        <div class="flex flex-row flex-wrap gap-[40px]">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="flex-[1_0_21%] cursor-pointer transition ease-in-out delay-50 bg-blue-500 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-200 max-h-[160px]"
            @click="onClick(photo)"
          >
            <img
              class="object-cover w-full h-full max-h-40"
              :src="photo.src.medium"
             alt="Image"/>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <span></span>
    </template>
  </UiModal>
</template>
