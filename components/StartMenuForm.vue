<script setup lang="ts">
import { Options } from "~/constants";
import { useImagesStore } from "../stores/images";
import { storeToRefs } from "pinia";

const { photos, selectedImage } = storeToRefs(useImagesStore());
const { setSelectedImage } = useImagesStore();

const selectOption = ref<Options>(Options.EASY);
const listOption = Object.values(Options);
const isSelectImageOpened = ref(false);

const beginGame = async () => {
  await navigateTo({
    path: `/game/${selectedImage.value.id}`,
    query: {
      level: selectOption.value,
    },
  });
};

const onChangeRadio = (e: Event) => {
  selectOption.value = (e.target as HTMLInputElement).value as Options;
};

const onSelectImage = (data: any) => {
  setSelectedImage(data).then(() => {
    onCloseImage();
  });
};

const onCloseImage = () => {
  isSelectImageOpened.value = false;
};
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
        <UiButton class="mt-5" @click="() => {}">
          <p class="pt-[4px]">Shuffle picture</p>
          <Icon
            class="ml-2 text-[36px] rotate-90"
            name="heroicons:arrow-path-rounded-square"
          />
        </UiButton>
        <UiButton class="mt-5" @click="() => (isSelectImageOpened = true)">
          Choose manually
        </UiButton>
        <div class="flex flex-row mt-7 gap-[30px]">
          <span v-for="(option, key) in listOption" :key="option">
            <input
              :class="[
                'invisible w-0 h-0',
                key === 0 && 'peer/0',
                key === 1 && 'peer/1',
                key === 2 && 'peer/2',
              ]"
              type="radio"
              name="size"
              :id="option"
              :value="option"
              :checked="selectOption === option"
              @change="(e) => onChangeRadio(e)"
            />
            <label
              :class="[
                'cursor-pointer bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-1xl font-normal text-[#303030] hover:bg-[#FFFFFFB2] active:bg-[#FFFFFFB2] px-[12px] pb-[9px] pt-[12px] flex items-center',
                'transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200',
                key === 0 && 'peer-checked/0:bg-[#FFFFFFB2]',
                key === 1 && 'peer-checked/1:bg-[#FFFFFFB2]',
                key === 2 && 'peer-checked/2:bg-[#FFFFFFB2]',
              ]"
              :for="option"
            >
              {{ option }}
            </label>
          </span>
        </div>
      </div>
    </div>
    <SelectImageModal
      :isModalOpened="isSelectImageOpened"
      :photos="photos"
      @submit="onSelectImage"
      @close="onCloseImage"
    />
    <UiButton
      class="mt-10 text-[48px] w-[208px] h-[77px] justify-center"
      @click="beginGame"
      >Play</UiButton
    >
  </div>
</template>

<style lang="css"></style>
