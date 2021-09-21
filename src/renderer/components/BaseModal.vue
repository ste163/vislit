<template>
  <teleport to="#modal-container">
    <transition name="blur">
      <div v-if="isModalActive" class="modal-background">
        <div class="modal-card">
          <div class="modal-card-header">
            <h2>
              <slot name="header">Header</slot>
            </h2>

            <button-close
              @click="emitCloseModal"
              class="modal-card-header-close"
            />
          </div>
          <slot></slot>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import ButtonClose from "./ButtonClose.vue";
// eslint-disable-next-line no-undef
const props = defineProps({
  isModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["closeModal"]);

function emitCloseModal(): void {
  emit("closeModal");
}
</script>

<style scoped>
.modal-background {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(3px);
}

.modal-card {
  position: absolute;
  top: 35%;
  left: 50%;
  background-color: var(--white);
  padding: 0.25em;
  height: 100px;
  min-width: 10em;
  max-width: fit-content;
  border-radius: 5px;
}

.modal-card-header {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
}

.modal-card-header-close {
  padding-top: 0.26em;
}

/* animations */
.blur-enter-active,
.blur-leave-active {
  transition: opacity 0.15s ease;
}

.blur-enter-from,
.blur-leave-to {
  opacity: 0;
}
</style>
