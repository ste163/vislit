<script setup lang="ts">
import { inject, computed, ref } from "vue";
import type { Goal } from "interfaces";
import type { Store } from "../store";
import BaseModal from "./base-modal.vue";
import GoalForm from "./goal-form.vue";

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

const previousGoals = computed(() =>
  store.state.activeProject?.goals?.filter((goal) => !goal.active)
);

function emitCloseModal(): void {
  emit("closeModal");
}

async function onDeleteClick(goalId: string): Promise<void> {
  try {
    const { api } = window;
    const response = await api.send("goals-delete", goalId);
    if (response instanceof Error) throw response;
    if (response) await store.getProjects();
  } catch (error: any | Error) {
    console.error(error.message);
  }
}

async function onCompleteClick(goalId: string): Promise<void> {
  try {
    const { api } = window;
    const response = await api.send("goals-completed", goalId);
    if (response instanceof Error) throw response;
    if (response) await store.getProjects();
  } catch (error: any | Error) {
    console.error(error.message);
  }
}
</script>

<template>
  <base-modal :is-modal-active="isModalActive" @close-modal="emitCloseModal">
    <template #header>Manage Goals</template>
    <div v-if="store.state.activeGoal">
      <h2>Active goal</h2>
      {{ store.state.activeGoal.wordOrPageCount }}
      {{ store.state.activeGoal.basedOnWordCountOrPageCount }},
      {{ store.state.activeGoal.daysPerFrequency }} days per
      {{ store.state.activeGoal.frequencyToRepeat }}.
      <button @click="isFormActive = !isFormActive">Edit Active Goal</button>
      <button
        @click="onCompleteClick(store.state.activeGoal?.id as string)"
      >
        Set Goal as Completed
      </button>
    </div>
    <div v-else-if="!store.state.activeGoal">
      <h2>Create New Goal</h2>
      <button @click="isFormActive = !isFormActive">Create</button>
    </div>

    <div v-if="isFormActive">
      <h2>Edit/Create Goal</h2>
      <hr />
      <goal-form
        :active-goal="(store.state.activeGoal as Goal)"
        @goal-saved="isFormActive = false"
      />
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
