<template>
  <!-- Copied from original test version of FormProjectCreate -->
  <base-modal
    :is-modal-active="isFormModalActive"
    @close-modal="emitCloseFormModal"
  >
    <template v-slot:header>Edit Project</template>

    <form>
      <input type="text" placeholder="title" />

      <input type="text" placeholder="type" />

      <input type="text" placeholder="description" />

      <!-- Make a create button component that has isDisabled and isActive props -->
      <button>Edit</button>
    </form>
  </base-modal>
</template>

<script setup lang="ts">
import BaseModal from "./BaseModal.vue";

// eslint-disable-next-line no-undef
const props = defineProps({
  isFormModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["closeFormModal"]);

function emitCloseFormModal(): void {
  emit("closeFormModal");
}
</script>
