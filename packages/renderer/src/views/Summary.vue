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
import ProjectStatusTag from "../components/ProjectStatusTag.vue";
import type { IProject } from "interfaces";

const store = inject("store") as IStore;

const isEditFormModalActive = ref<boolean>(false);
const isDeleteModalActive = ref<boolean>(false);
const isEllipsisMenuActive = ref<boolean>(false);

const activeProject = computed(() => {
	return  store.projects.state.active as IProject;
});

const formatedDate = useDateFormatFull(activeProject.value.dateModified);



function openWindow(): void {
	console.log("Open window in main process");
}

function openEditProjectModal(): void {
	console.log("OPEN EDIT PROJECT MODAL");
}

function openEditGoalModal(): void {
	console.log("OPEN EDIT GOAL MODAL");
}

function toggleProjectComplete(): void {
	console.log("TOGGLE PROJECT COMPLETE/INPROGRESS");
}

function toggleProjectArchived(): void {
	console.log("TOGGLED PROJECT ARCHIVED");
}

function openDeleteConfirmationModal(): void {
	isDeleteModalActive.value = true;
}
</script>

<template>
  <base-template-card
    :is-ellipsis-menu-active="isEllipsisMenuActive"
    @clickOutside="isEllipsisMenuActive = false;"
  >
    <template #header>
      {{ activeProject.title }}
    </template>

    <template #sub-header>
      <project-status-tag :project="activeProject" /> {{ activeProject.typeId }} | Last updated on {{ formatedDate }}
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
      <!-- If completed, Mark Project as In Progress -->
      <button-ellipsis-item @click="toggleProjectComplete">
        Mark Project as Completed
      </button-ellipsis-item> 
      <button-ellipsis-item @click="toggleProjectArchived">
        Archive Project
      </button-ellipsis-item>
      <button-ellipsis-item @click="openDeleteConfirmationModal">
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

      <template #header>
        Goal
      </template>
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
      <template #header>
        Start writing
      </template>
      Start writing in the Document Writer to see the last couple paragraphs
      written.

      <template #buttons>
        <base-button-click
          :background-color="'var(--lightGray)'"
          @click="openWindow"
        >
          Open Document Writer
        </base-button-click>

        <base-button-click
          :background-color="'var(--lightGray)'"
          class="button-spacing"
          @click="openWindow"
        >
          Open Notes
        </base-button-click>
      </template>
    </base-card-content>
  </base-template-card>

  <form-project-delete-modal
    :is-modal-active="isDeleteModalActive"
    @close-modal="isDeleteModalActive = false"
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
