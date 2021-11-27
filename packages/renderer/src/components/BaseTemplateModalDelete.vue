<script setup lang="ts">
import BaseModal from "./BaseModal.vue";
import BaseButtonClick from "./BaseButtonClick.vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  isModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
  hasArchiveButton: {
    type: Boolean,
    default: false,
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["closeModal", "handleArchiveClick", "handleDeleteClick"]);

function emitCloseModal(): void {
  emit("closeModal");
}

function emitHandleArchiveClick(): void {
  emit("handleArchiveClick");
}

function emitHandleDeleteClick(): void {
  emit("handleDeleteClick");
}

</script>

<template>
  <base-modal
    :is-modal-active="isModalActive"
    @close-modal="emitCloseModal"
  >
    <template #header>
      Confirm Deletion
    </template>

    <div>
      <p class="text-container">
        <slot />
      </p>

      <div class="button-container">
        <base-button-click @click="emitCloseModal">
          Cancel
        </base-button-click>
        <!-- Need to pass in an isSubmitting for loading spinner for Archive & Delete -->
        <div>
          <base-button-click
            v-if="hasArchiveButton"
            :background-color="'var(--success)'"
            :text-color="'var(--white)'"
            class="archive-button"
            @click="emitHandleArchiveClick"
          >
            Archive
          </base-button-click>
          <base-button-click
            :background-color="'var(--warning)'"
            :text-color="'var(--white)'"
            @click="emitHandleDeleteClick"
          >
            Delete
          </base-button-click>
        </div>
      </div>
    </div>
  </base-modal>
</template>

<style scoped>
.text-container {
  margin-bottom: 1.5em;
  width: 30em;
}

.button-container {
  display: flex;
  justify-content: space-between;
}

.archive-button {
  margin-right: 1em;
}
</style>
