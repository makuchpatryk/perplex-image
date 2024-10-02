<script setup>
const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["modal-close"]);

const onClickOutside = () => {
  emit("modal-close");
};
</script>

<template>
  <div>
    <Teleport to="body">
      <div v-if="isOpen" class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container" v-click-outside="onClickOutside">
            <div class="modal-header">
              <slot name="header"> default header </slot>
            </div>
            <div class="modal-body">
              <slot name="content"> default content </slot>
            </div>
            <div class="modal-footer">
              <slot name="footer">
                <div>
                  <button
                    class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline m-1"
                    @click.stop="emit('modal-close')"
                    v-text="Submit"
                  />
                </div>
              </slot>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-container {
  width: 300px;
  margin: 150px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
</style>
