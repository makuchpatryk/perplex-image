<script setup lang="ts">
let number = ref<string | number>(1);
let level = ref<string | number>(5);
let width = ref<number>(1000);

const beginGame = async () => {
  await navigateTo({
    path: `/game/${number.value}`,
    query: {
      level: level.value,
      width: width.value,
    },
  });
};
</script>

<template>
  <div class="w-full max-w-xs items-center flex">
    <form class="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <span class="flex w-full mb-2 justify-between">
        <label>select image</label>
        <select v-model="number">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </span>
      <span class="flex w-full mb-2 justify-between">
        <label>select level</label>
        <select v-model="level">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
          <option value="30">30</option>
        </select>
      </span>
      <span class="flex w-full mb-2 justify-between">
        <label>select width</label>
        <select v-model="width">
          <option value="1000">1000</option>
          <option value="1500">1500</option>
          <option value="2000">2000</option>
        </select>
      </span>

      <button
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
        type="button"
        @click="beginGame"
      >
        Single play
      </button>
      <button
        class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
        type="button"
      >
        Multi play
      </button>
    </form>
  </div>
</template>
