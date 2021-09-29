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

          <div class="modal-card-content">
            <slot></slot>
          </div>
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
  width: 100vw;
  height: 100vh;
  background-color: #0000000f;
  backdrop-filter: blur(3px);
}

.modal-card {
  position: absolute;
  top: 30vh;
  left: 40vw;
  background-color: var(--white);
  padding: 1em;
  min-height: 10em;
  max-height: fit-content;
  width: clamp(5em, 50%, 17em);
  border-radius: 5px;
  box-shadow: #6e6e6e4d 0px 0px 40px;
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

.modal-card-content {
  display: flex;
  flex-flow: column nowrap;
}

/* animations */
.blur-enter-active,
.blur-leave-active {
  transition: opacity 0.25s ease;
}

.blur-enter-from,
.blur-leave-to {
  opacity: 0;
}
</style>
