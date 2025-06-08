<script setup lang="ts">
import { storeToRefs } from "pinia";
import { LevelsKeys } from "~/modules/core/constants";
import { useImagesStore } from "~/modules/core/store/images";
import type { PexelPhoto } from "~/modules/core/types";

const { photos, selectedImage } = storeToRefs(useImagesStore());
const { setSelectedImage, randomSelectImage, getImages } = useImagesStore();

const selectOption = ref<LevelsKeys>(LevelsKeys["9x13"]);
const listOption = Object.values(LevelsKeys);
const isSelectImageOpened = ref(false);
const loading = ref(true);

async function beginGame() {
  if (selectedImage?.value) {
    await navigateTo({
      path: `/game/${selectedImage.value.id}`,
      query: {
        level: selectOption.value,
      },
    });
  }
}

function onChangeRadio(e: Event) {
  selectOption.value = (e.target as HTMLInputElement)
    .value as unknown as LevelsKeys;
}

function onSelectImage(data: PexelPhoto) {
  setSelectedImage(data).then(() => {
    onCloseImage();
  });
}

function onCloseImage() {
  isSelectImageOpened.value = false;
}

onMounted(() => {
  getImages().then(() => {
    loading.value = false;
  });
});
</script>

<template>
  <div class="justify-center items-center flex mx-auto w-[700px] flex-col">
    <span class="text-3xl font-semibold text-center text-[#605F5B] mb-5">{{
      $t("A tile-sliding picture game.")
    }}</span>
    <span class="text-2xl font-light text-center text-[#605F5B] mb-10">{{
      $t("Rearrange tiles by dragging to put the image together.")
    }}</span>
    <div class="relative">
      <img
        v-if="!loading && selectedImage?.src?.large"
        class="w-full shadow-[10px_12px_25px_2px_#00000026]"
        :src="selectedImage?.src?.large || ''"
      />
      <span
        v-else
        class="block w-[700px] h-[466px] bg-[length:400%] animate-moving bg-gradient-to-r from-[#777777] to-[#bbbbbb]"
      ></span>
      <div
        class="w-full absolute left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] flex flex-col items-center justify-center"
      >
        <UiButton
          class="mt-5"
          @click="
            () => {
              loading = true;
              randomSelectImage();
              loading = false;
            }
          "
        >
          <p class="pt-[4px]">{{ $t("Shuffle picture") }}</p>
          <Icon
            class="ml-2 text-[36px] rotate-90"
            name="heroicons:arrow-path-rounded-square"
          />
        </UiButton>
        <UiButton class="mt-5" @click="isSelectImageOpened = true">
          {{ $t("Choose manually") }}
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
              :id="String(option)"
              :value="option"
              :checked="selectOption === option"
              @change="onChangeRadio($event)"
            />
            <label
              :class="[
                'cursor-pointer bg-[#FFFFFF66] rounded-[20px] backdrop-blur-[15%] shadow-[0px_4px_4px_0px_#00000040] text-1xl font-normal text-[#303030] hover:bg-[#FFFFFFEE] active:bg-[#FFFFFFEE] px-[12px] pb-[9px] pt-[12px] flex items-center',
                'transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200',
                key === 0 && 'peer-checked/0:bg-[#FFFFFFEE]',
                key === 1 && 'peer-checked/1:bg-[#FFFFFFEE]',
                key === 2 && 'peer-checked/2:bg-[#FFFFFFEE]',
              ]"
              :for="option as string"
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
      >{{ $t("Play") }}</UiButton
    >
  </div>
</template>
