<script setup lang="ts">
import { inject, computed, ref } from "vue";
import type { Store } from "../store";
import BaseModal from "./BaseModal.vue";
import FormGoal from "./FormGoal.vue";

const store = inject("store") as Store;

const props = defineProps({
  isModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["closeModal"]);

const isFormActive = ref<boolean>(false);

const activeGoal = computed(() =>
  store.projects.state.active?.goals?.find((goal) => goal.active)
);
const previousGoals = computed(() =>
  store.projects.state.active?.goals?.filter((goal) => !goal.active)
);

function emitCloseModal(): void {
  emit("closeModal");
}

async function onDeleteClick(goalId: string): Promise<void> {
  console.log("deleteGoalWithId", goalId);
  try {
    const { api } = window;
    const response = await api.send("goals-delete", goalId);
    if (response instanceof Error) throw response;
    if (response) await store.projects.getProjects();
  } catch (error: any | Error) {
    console.error(error.message);
  }
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
    <button @click="isFormActive = !isFormActive">Edit Active Goal</button>

    <div v-if="isFormActive">
      <h2>Edit Goal</h2>
      <hr />
      <form-goal :active-goal="activeGoal" @goal-saved="isFormActive = false" />
    </div>
    <hr />
    <!-- Option to delete goal, but that's it, no edit or detail view -->
    <h2>Old Goals</h2>
    Count of old goals: {{ previousGoals?.length }}
    <div v-for="goal in previousGoals" :key="goal.id">
      {{ goal?.dateModified }}
      {{ goal?.wordOrPageCount }}
      {{ goal?.basedOnWordCountOrPageCount }}, {{ goal?.daysPerFrequency }} days
      per {{ goal?.frequencyToRepeat }}.
      <button @click="onDeleteClick(goal.id as string)">Delete Goal</button>
    </div>
  </base-modal>
</template>
