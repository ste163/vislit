<script setup lang="ts">
import { inject, watch, computed } from "vue";
import type { Store } from "../store";
import BaseModal from "./BaseModal.vue";

const store = inject("store") as Store;

const props = defineProps({
  isModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// computed of the active goal

const emit = defineEmits(["closeModal"]);

function emitCloseModal(): void {
  emit("closeModal");
}
</script>

<template>
  <base-modal :is-modal-active="isModalActive" @close-modal="emitCloseModal">
    <!-- clicking this opens the active goal edit form -->
    Active goal

    <hr />
    <!-- Option to delete goal, but that's it, no edit or detail view -->
    All other goals sorted by most recently updated (how they come from db)
  </base-modal>
</template>

<style scoped>
/* Convert to tailwind */
.form {
  display: flex;
  flex-flow: column nowrap;
  margin-top: 1em;
  width: 20em;
}
</style>
