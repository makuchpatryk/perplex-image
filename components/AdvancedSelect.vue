<script setup lang="ts" generic="T">
interface Props {
  value?: T | null;
  options: T[];
}

const props = defineProps<Props>();
let trigger = ref<boolean>(false);
const $el = ref(null);
const activator = ref(null);
const dropdownStyle = ref(null);

const emit = defineEmits(["input"]);

watch(
  () => props.value,
  () => {
    nextTick(() => {
      calculationDropdown();
    });
  }
);

const onSelect = () => {
  calculationDropdown();
  trigger.value = !trigger.value;
};

const onClickOption = (option: T) => {
  trigger.value = false;

  emit("input", {
    value: option,
  });
};
const closeDropdown = () => {
  console.log("closeDropdown");
  trigger.value = false;
};

const calculationDropdown = () => {
  const { top, height, width, left, right } =
    activator.value.getBoundingClientRect();

  const payload: { [k: string]: any } = {
    top: `${top + height}px`,
    minWidth: `${width}px`,
    maxWidth: `${width * 1.5}px`,
  };

  if (left + width * 1.5 > window.innerWidth) {
    payload.right = `${window.innerWidth - right}px`;
  } else {
    payload.left = `${left}px`;
  }

  dropdownStyle.value = {
    ...payload,
  };
};
const onResizeEvent = () => {
  trigger.value = false;
};
onMounted(() => {
  window.addEventListener("resize", onResizeEvent);
});
onUnmounted(() => {
  window.removeEventListener("resize", onResizeEvent);
});
</script>

<template>
  <div ref="$el">
    <div
      @click.prevent.stop="onSelect"
      ref="activator"
      class="border px-4 py-2 cursor-pointer flex items-center"
    >
      <slot v-if="value" name="value" :value="value">
        <div class="text-slate-700" v-text="value" />
      </slot>
      <slot v-else name="placeholder">
        <div class="text-slate-700" v-text="`-- select option --`" />
      </slot>
      <Icon class="ml-auto" name="charm:chevron-down" />
    </div>
    <div v-if="trigger">
      <Teleport to="body">
        <ul
          class="bg-white border mt-1 absolute w-auto h-auto"
          :style="dropdownStyle"
          v-click-outside="closeDropdown"
        >
          <li
            class="truncate p-3 cursor-pointer hover:bg-slate-100"
            v-for="(option, key) in options"
            :key="key"
            @click.prevent="onClickOption(option)"
          >
            <slot name="option" :option="option" :key="key">
              <div v-text="option" class="truncate" />
            </slot>
          </li>
        </ul>
      </Teleport>
    </div>
  </div>
</template>
