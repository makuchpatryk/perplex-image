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
        class="w-full absolute left-[50%] translate-x-[-50%] top-5 flex flex-col items-center"
      >
        <button
          class="w-[200px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
          type="button"
          @click="() => {}"
        >
          Shuffle picture
        </button>
        <button
          class="w-[200px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
          type="button"
          @click="beginGame"
        >
          Choose manually
        </button>
        <div class="center-align">
          <input type="radio" name="size" id="size_1" value="small" checked />
          <label for="size_1">9x13</label>

          <input type="radio" name="size" id="size_2" value="small" />
          <label for="size_2">15x23</label>

          <input type="radio" name="size" id="size_3" value="small" />
          <label for="size_3">18x26</label>
        </div>
      </div>
    </div>
    <button
      class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
      type="button"
      @click="beginGame"
    >
      PLAY
    </button>
  </div>
</template>

<style lang="css">
input[type="radio"] {
  visibility: hidden;
  height: 0;
  width: 0;
}

label {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  cursor: pointer;
  background-color: #454545;
  color: white;
  padding: 5px 10px;
  border-radius: 3px;
}
input[type="radio"]:checked + label {
  background-color: #58ba83;
}
</style>
