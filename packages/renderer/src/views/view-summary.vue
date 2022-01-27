<script setup lang="ts">
import { ref, inject, computed } from "vue";
import type { Store } from "../store";
import type { Project } from "interfaces";
import BaseTemplateCard from "../components/base-template-card.vue";
import BaseCardContent from "../components/base-card-content.vue";
import BaseButtonClick from "../components/base-button-click.vue";
import BaseModal from "../components/base-modal.vue";
import FormProject from "../components/form-project.vue";
import FormProjectDeleteModal from "../components/form-project-delete-modal.vue";
import NotificationDot from "../components/notification-dot.vue";
import ButtonEllipsis from "../components/button-ellipsis.vue";
import ButtonEllipsisItem from "../components/button-ellipsis-item.vue";
import useDateFormatFull from "../composables/use-date-format-full";
import ProjectStatusTags from "../components/project-status-tags.vue";
import FormGoal from "../components/form-goal.vue";
import FormGoalManageModal from "../components/form-goal-manage-modal.vue";

// TODO:
// If completed or archived, no longer able to add/edit content or Project details

const store = inject("store") as Store;

const isEditProjectModalActive = ref<boolean>(false);
const isCreateGoalFormModalActive = ref<boolean>(false);
const isManageGoalModalActive = ref<boolean>(false);
const isDeleteModalActive = ref<boolean>(false);
const isEllipsisMenuActive = ref<boolean>(false);

const activeProject = computed(() => {
  return store.projects.state.active as Project;
});

const formatedDate = useDateFormatFull(activeProject.value?.dateModified);

function openNotesColumn(): void {
  store.application.state.columns.forEach((column) => {
    if (column.header === "Notes") {
      column.isActive = !column.isActive;
    }
  });
}

function toggleProjectComplete(): void {
  const updatedProject: Project = {
    id: activeProject.value.id,
    typeId: activeProject.value.typeId,
    title: activeProject.value.title,
    description: activeProject.value.description,
    completed: !activeProject.value.completed,
    archived: activeProject.value.archived,
    dateModified: activeProject.value.dateModified,
    dateCreated: activeProject.value.dateCreated,
  };

  store.projects.updateProject(updatedProject);
}

function toggleProjectArchived(): void {
  const updatedProject: Project = {
    id: activeProject.value.id,
    typeId: activeProject.value.typeId,
    title: activeProject.value.title,
    description: activeProject.value.description,
    completed: activeProject.value.completed,
    archived: !activeProject.value.archived,
    dateModified: activeProject.value.dateModified,
    dateCreated: activeProject.value.dateCreated,
  };

  store.projects.updateProject(updatedProject);
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
      updated on {{ formatedDate }}
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
      Your goal is --- make a computed property of the activeGoal that searches
      through goal array and grabs it
      <template #buttons>
        <base-button-click
          @click="isManageGoalModalActive = !isManageGoalModalActive"
        >
          Manage Goals
        </base-button-click>
      </template>
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

  <form-project-delete-modal
    :is-modal-active="isDeleteModalActive"
    @handle-delete-modal-close="isDeleteModalActive = false"
  />

  <base-modal
    :is-modal-active="isEditProjectModalActive"
    @close-modal="isEditProjectModalActive = false"
  >
    <template #header> Edit Project </template>
    <form-project
      :current-project="{ ...activeProject }"
      @project-saved="isEditProjectModalActive = false"
    />
  </base-modal>

  <base-modal
    :is-modal-active="isCreateGoalFormModalActive"
    @close-modal="isCreateGoalFormModalActive = false"
  >
    <template #header> Create Goal </template>
    <form-goal @goal-saved="isCreateGoalFormModalActive = false" />
  </base-modal>

  <form-goal-manage-modal
    :is-modal-active="isManageGoalModalActive"
    @close-modal="isManageGoalModalActive = false"
  />
</template>

<style>
.button-spacing {
  margin-left: 2em;
}
</style>
