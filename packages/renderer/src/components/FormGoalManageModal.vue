<script setup lang="ts">
import { inject, computed } from "vue";
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

const emit = defineEmits(["closeModal"]);

const activeGoal = computed(() =>
  store.projects.state.active?.goals?.find((goal) => goal.active)
);
const previousGoals = computed(() =>
  store.projects.state.active?.goals?.filter((goal) => !goal.active)
);

function emitCloseModal(): void {
  emit("closeModal");
}
</script>

<template>
  <base-modal :is-modal-active="isModalActive" @close-modal="emitCloseModal">
    <template #header>Manage Goals</template>
    <!-- clicking this opens the active goal edit form -->
    <h2>Active goal</h2>
    {{ activeGoal?.wordOrPageCount }}
    {{ activeGoal?.basedOnWordCountOrPageCount }},
    {{ activeGoal?.daysPerFrequency }} days per
    {{ activeGoal?.frequencyToRepeat }}.
    <!-- Checkbox for toggling as completed -->
    <!-- Button for opening edit form (opens the edit form on this same modal so all previous goals are visible)  -->
    <hr />
    <!-- Option to delete goal, but that's it, no edit or detail view -->
    <h2>Old Goals</h2>
    Count of old goals: {{ previousGoals?.length }}
  </base-modal>
</template>
