<script setup lang="ts">
import { ref, inject, computed, watch, onMounted } from "vue";
import type { Store } from "../store";
import type { Progress, Project } from "interfaces";
import BaseTemplateCard from "../components/base-template-card.vue";
import BaseCardContent from "../components/base-card-content.vue";
import BaseButtonClick from "../components/base-button-click.vue";
import BaseModal from "../components/base-modal.vue";
import ProjectForm from "../components/project-form.vue";
import ProjectDeleteModal from "../components/project-delete-modal.vue";
import ProgressForm from "../components/progress-form.vue";
import NotificationDot from "../components/notification-dot.vue";
import ButtonEllipsis from "../components/button-ellipsis.vue";
import ButtonEllipsisItem from "../components/button-ellipsis-item.vue";
import useDateFormatFull from "../composables/use-date-format-full";
import ProjectStatusTags from "../components/project-status-tags.vue";
import GoalForm from "../components/goal-form.vue";
import GoalManageModal from "../components/goal-manage-modal.vue";

// TODO:
// If completed or archived, no longer able to add/edit content or Project details

// If it's later in day,
// like 8pm EST,
// new Date().toISOstring()
// returns the next day
// https://stackoverflow.com/questions/64781167/why-1-day-off-when-i-try-to-convert-date-into-toisostring-in-javascript
// appears to be because ISO uses a standardized timezone instead of the user's timezone
console.log(new Date().toISOString());

const store = inject("store") as Store;

const isEditProjectModalActive = ref<boolean>(false);
const isCreateGoalFormModalActive = ref<boolean>(false);
const isManageGoalModalActive = ref<boolean>(false);
const isDeleteModalActive = ref<boolean>(false);
const isEllipsisMenuActive = ref<boolean>(false);
const todaysProgress = ref<Progress | undefined>(undefined);

// Dislike this. Move it to the store. We should only be reading
// the computed
const activeProject = computed(() => {
  return store.state.activeProject as Project;
});

const todaysDate = computed(() => {
  // progress form requires 0 for all times & ISOstring
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString();
});

const formattedDate = useDateFormatFull(activeProject.value?.dateModified);

function openNotesColumn(): void {
  store.state.columns.forEach((column) => {
    if (column.header === "Notes") {
      column.isActive = !column.isActive;
    }
  });
}

async function toggleProjectComplete(): Promise<void> {
  const updatedProject = {
    id: activeProject.value.id,
    typeId: activeProject.value.typeId,
    title: activeProject.value.title,
    description: activeProject.value.description,
    completed: !activeProject.value.completed,
    archived: activeProject.value.archived,
  } as any as Project;
  await store.updateProject(updatedProject);
}

async function toggleProjectArchived(): Promise<void> {
  const updatedProject = {
    id: activeProject.value.id,
    typeId: activeProject.value.typeId,
    title: activeProject.value.title,
    description: activeProject.value.description,
    completed: activeProject.value.completed,
    archived: !activeProject.value.archived,
  } as any as Project;
  await store.updateProject(updatedProject);
}

// const ellipsisMenuGoalText = computed(() => {
// Setup goal then change the text correctly
// })

const ellipsisMenuCompletedText = computed(() => {
  return activeProject.value.completed
    ? "Mark Project as In Progress"
    : "Mark Project as Completed";
});

const ellipsisMenuArchivedText = computed(() => {
  return activeProject.value.archived
    ? "Un-archive Project"
    : "Archive Project";
});

async function fetchTodaysProgress(): Promise<void> {
  if (store.state.activeGoal && store.state.activeProject?.id) {
    try {
      const { api } = window;
      const request = {
        projectId: store.state.activeProject.id,
        date: new Date().toISOString(),
      };
      const response: Progress = (await api.send(
        "progress-get-by-date",
        request
      )) as Progress;
      if (response instanceof Error) {
        // display toast
        console.error(response);
        return;
      }
      todaysProgress.value = response;
    } catch (error: any | Error) {
      // toast
      console.error(error);
    }
  }
}

// Must do both onMounted and Watch because the projectId & activeGoal
// aren't set on the initial mount if the app loads to this page.
// Subsequent mounts for this page will run because global state has been set
onMounted(fetchTodaysProgress);
watch(() => store.state.activeGoal, fetchTodaysProgress);
</script>

<template>
  <base-template-card
    v-if="activeProject"
    :is-ellipsis-menu-active="isEllipsisMenuActive"
    @click-outside="isEllipsisMenuActive = false"
  >
    <template #header>
      {{ activeProject.title }}
    </template>

    <template #sub-header>
      <project-status-tags :project="activeProject" />
      <span class="capitalize">{{ activeProject.type?.value }}</span> | Last
      updated on {{ formattedDate }}
    </template>

    <template #description>
      {{ activeProject?.description }}
    </template>

    <template #ellipsis-button>
      <button-ellipsis
        :is-active="isEllipsisMenuActive"
        @click="isEllipsisMenuActive = !isEllipsisMenuActive"
      />
    </template>

    <template #ellipsis-menu>
      <button-ellipsis-item @click="isEditProjectModalActive = true">
        Edit Project
      </button-ellipsis-item>

      <button-ellipsis-item
        v-if="activeProject.goals?.length! > 0"
        @click="isManageGoalModalActive = !isManageGoalModalActive"
      >
        Manage Goals
      </button-ellipsis-item>
      <button-ellipsis-item @click="toggleProjectComplete">
        {{ ellipsisMenuCompletedText }}
      </button-ellipsis-item>
      <button-ellipsis-item @click="toggleProjectArchived">
        {{ ellipsisMenuArchivedText }}
      </button-ellipsis-item>
      <button-ellipsis-item @click="() => (isDeleteModalActive = true)">
        Delete Project
      </button-ellipsis-item>
    </template>

    <!-- Need 3 modal states
    - In Progress -> currently doing this
    - Completed
    - Archived -->

    <base-card-content v-if="activeProject.goals?.length! === 0">
      <template #notification-dot>
        <notification-dot
          :dot-color="'var(--notification)'"
          :pulse-color="'var(--notification-pulse)'"
        />
      </template>

      <template #header> Goal </template>
      Create a goal to begin tracking progress.

      <template #buttons>
        <base-button-click
          :background-color="'var(--notification)'"
          @click="isCreateGoalFormModalActive = !isCreateGoalFormModalActive"
        >
          Create Goal
        </base-button-click>
      </template>
    </base-card-content>

    <base-card-content v-else-if="activeProject.goals?.length! > 0">
      <template #header> Goal </template>
      <p v-if="store.state.activeGoal">
        Currently active goal: write
        {{ store.state.activeGoal.wordCount }} words
        <!-- But if its isDaily, then every day per month, calculated by length of days in month -->
        {{ store.state.activeGoal.daysPerMonth }} days per month
      </p>
      <p v-else>
        No active goal. Add a new goal to continue tracking progress.
      </p>
      <template #buttons>
        <base-button-click
          @click="isManageGoalModalActive = !isManageGoalModalActive"
        >
          Manage Goals
        </base-button-click>
      </template>
    </base-card-content>

    <!-- Can only add progress if there's an active goal -->
    <base-card-content v-if="store.state.activeGoal?.id && activeProject.id">
      <template #header> Progress </template>
      <table class="table-auto text-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Word/Page Count</th>
            <th>Proofread</th>
            <th>Edited</th>
            <th>Revised</th>
            <th>Completed</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody>
          <progress-form
            :key="todaysProgress?.count"
            :date="todaysDate"
            :project-id="activeProject.id"
            :goal-id="store.state.activeGoal.id"
            :current-progress="todaysProgress"
            @progress-saved="fetchTodaysProgress"
          />
        </tbody>
      </table>
    </base-card-content>

    <base-card-content>
      <template #header> Start writing </template>
      Start writing in the Document Writer to see the last couple paragraphs
      written.

      <template #buttons>
        <base-button-click
          :background-color="'var(--lightGray)'"
          @click="() => $router.push(`/writer/${activeProject.id}`)"
        >
          Open Document Writer
        </base-button-click>

        <base-button-click
          :background-color="'var(--lightGray)'"
          class="button-spacing"
          @click="openNotesColumn"
        >
          Open Notes
        </base-button-click>
      </template>
    </base-card-content>
  </base-template-card>

  <project-delete-modal
    :is-modal-active="isDeleteModalActive"
    @handle-delete-modal-close="isDeleteModalActive = false"
  />

  <base-modal
    :is-modal-active="isEditProjectModalActive"
    @close-modal="isEditProjectModalActive = false"
  >
    <template #header> Edit Project </template>
    <project-form
      :current-project="{ ...activeProject }"
      @project-saved="isEditProjectModalActive = false"
    />
  </base-modal>

  <base-modal
    :is-modal-active="isCreateGoalFormModalActive"
    @close-modal="isCreateGoalFormModalActive = false"
  >
    <template #header> Create Goal </template>
    <goal-form @goal-saved="isCreateGoalFormModalActive = false" />
  </base-modal>

  <goal-manage-modal
    :is-modal-active="isManageGoalModalActive"
    @close-modal="isManageGoalModalActive = false"
  />
</template>

<style>
.button-spacing {
  margin-left: 2em;
}
</style>
