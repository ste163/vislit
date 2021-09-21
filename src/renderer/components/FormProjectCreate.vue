<template>
  <base-modal
    :is-modal-active="isFormModalActive"
    @close-modal="emitCloseFormModal"
  >
    <template v-slot:header>Create Project</template>

    <input type="text" placeholder="title" />

    <input type="text" placeholder="type" />

    <input type="text" placeholder="description" />

    <!-- Make a create button component that has isDisabled and isActive props -->
    <button>Create</button>
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
