<script setup lang="ts">
import { ref, inject, computed } from "vue";
import type IStore from "../store/interfaces/IStore";
import BaseTemplateCard from "../components/BaseTemplateCard.vue";
import BaseCardContent from "../components/BaseCardContent.vue";
import BaseButtonClick from "../components/BaseButtonClick.vue";
import FormProjectCreateModal from "../components/FormProjectCreateModal.vue";
import FormProjectDeleteModal from "../components/FormProjectDeleteModal.vue";
import NotificationDot from "../components/NotificationDot.vue";
import ButtonEllipsis from "../components/ButtonEllipsis.vue";
import ButtonEllipsisItem from "../components/ButtonEllipsisItem.vue";
import useDateFormatFull from "../composables/useDateFormatFull";
import ProjectStatusTags from "../components/ProjectStatusTags.vue";
import type { IProject } from "interfaces";

// TODO:
// If completed or archived, no longer able to add/edit content

const store = inject("store") as IStore;

const isEditFormModalActive = ref<boolean>(false);
const isDeleteModalActive = ref<boolean>(false);
const isEllipsisMenuActive = ref<boolean>(false);

const activeProject = computed(() => {
  return store.projects.state.active as IProject;
});

const formatedDate = useDateFormatFull(activeProject.value.dateModified);

function openNotesColumn(): void {
  store.application.state.columns.forEach((column) => {
    if (column.header === "Notes") {
      column.isActive = !column.isActive;
    }
  });
}

function openEditProjectModal(): void {
  console.log("OPEN EDIT PROJECT MODAL");
}

function openEditGoalModal(): void {
  console.log("OPEN EDIT GOAL MODAL");
}

function toggleProjectComplete(): void {
  const updatedProject: IProject = {
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
  const updatedProject: IProject = {
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
    v-if="activeProject !== null"
    :is-ellipsis-menu-active="isEllipsisMenuActive"
    @clickOutside="isEllipsisMenuActive = false"
  >
    <template #header>
      {{ activeProject.title }}
    </template>

    <template #sub-header>
      <project-status-tags :project="activeProject" />
      {{ activeProject.typeId }} | Last updated on {{ formatedDate }}
    </template>

    <template #description>
      {{ activeProject.description }}
    </template>

    <template #ellipsis-button>
      <button-ellipsis
        :is-active="isEllipsisMenuActive"
        @click="isEllipsisMenuActive = !isEllipsisMenuActive"
      />
    </template>

    <template #ellipsis-menu>
      <button-ellipsis-item @click="openEditProjectModal">
        Edit Project
      </button-ellipsis-item>
      <!-- ONLY SHOW EDIT GOAL IF GOAL HASN'T BEEN CREATED; OTHERWISE, OPEN GOAL MODAL -->
      <button-ellipsis-item @click="openEditGoalModal">
        Edit Goal
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

    <base-card-content>
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
          @click="isEditFormModalActive = !isEditFormModalActive"
        >
          Create Goal
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

  <form-project-create-modal
    :is-form-modal-active="isEditFormModalActive"
    @close-modal="isEditFormModalActive = false"
  />
</template>

<style>
.button-spacing {
  margin-left: 2em;
}
</style>
