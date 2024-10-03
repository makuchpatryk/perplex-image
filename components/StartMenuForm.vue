<script setup lang="ts">
import { useImagesStore } from "../stores/images";
import { storeToRefs } from "pinia";

const { photos, selectedImage } = storeToRefs(useImagesStore());

let id = ref<string | number>();
let level = ref<string | number>(5);

const beginGame = async () => {
  await navigateTo({
    path: `/game/${id.value}`,
    query: {
      level: level.value,
    },
  });
};

const onSelectImage = (option: { value: string | number }) => {
  id.value = option.value;
};
const onSelectLevel = (option: { value: string | number }) => {
  level.value = option.value;
};

const optionsImages = photos.value.map((i) => i.id);
const optionsLevels = ["5", "10", "15", "20", "25", "30"];
</script>

<template>
  <div class="items-center flex mx-auto w-[700px] flex-col mt-[150px]">
    <span class="text-3xl font-semibold text-center text-[#605F5B] mb-5"
      >A tile-sliding picture game.</span
    >
    <span class="text-2xl font-light text-center text-[#605F5B] mb-10"
      >Rearrange tiles by dragging to put the image together.</span
    >
    <div class="relative">
      <img
        v-if="selectedImage?.src?.large"
        class="w-full shadow-[10px_12px_25px_2px_#00000026]"
        :src="selectedImage?.src?.large || ''"
      />
      <span v-else class="block w-[700px] h-[466px]"></span>
      <div
        class="w-full absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] flex flex-col items-center justify-center"
      >
        <button
          class="bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-3xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] py-[9px] flex items-center"
          type="button"
          @click="() => {}"
        >
          <p class="pt-[4px]">Shuffle picture</p>
          <Icon
            class="ml-2 text-[36px] rotate-90"
            name="heroicons:arrow-path-rounded-square"
          />
        </button>
        <button
          class="bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-2xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] py-[9px] flex items-center mt-5"
          type="button"
          @click="beginGame"
        >
          Choose manually
        </button>
        <div class="flex flex-row mt-7 gap-[30px]">
          <input
            class="peer/1 invisible w-0 h-0"
            type="radio"
            name="size"
            id="size_1"
            value="small"
            checked
          />
          <label
            class="peer-checked/1:bg-[#FFFFFFB2] cursor-pointer bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-1xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] pb-[9px] pt-[12px] flex items-center"
            for="size_1"
            >9x13</label
          >

          <input
            class="peer/2 invisible w-0 h-0"
            type="radio"
            name="size"
            id="size_2"
            value="small"
          />
          <label
            class="peer-checked/2:bg-[#FFFFFFB2] cursor-pointer bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-1xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] pb-[9px] pt-[12px] flex items-center"
            for="size_2"
            >15x23</label
          >

          <input
            class="peer/3 invisible w-0 h-0"
            type="radio"
            name="size"
            id="size_3"
            value="small"
          />
          <label
            class="peer-checked/3:bg-[#FFFFFFB2] cursor-pointer bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-1xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] pb-[9px] pt-[12px] flex items-center"
            for="size_3"
            >18x26</label
          >
        </div>
      </div>
    </div>
    <button
      class="mt-7 block w-[158px] text-center bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[6px_6px_12.5px_0px_#00000026] text-3xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] py-[9px]"
      type="button"
      @click="beginGame"
    >
      Play
    </button>
  </div>
</template>

<style lang="css"></style>
