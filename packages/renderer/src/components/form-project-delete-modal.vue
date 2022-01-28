<script setup lang="ts">
import { inject } from "vue";
import { useRouter } from "vue-router";
import type { Project } from "interfaces";
import type { Store } from "../store";
import BaseTemplateModalDelete from "./base-template-modal-delete.vue";

const store = inject("store") as Store;

const props = defineProps({
  isModalActive: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const emit = defineEmits(["handleDeleteModalClose"]);

const router = useRouter();

function archiveProject(): void {
  if (store.application.state.activeProject !== null) {
    const updatedProject: Project = {
      id: store.application.state.activeProject.id,
      typeId: store.application.state.activeProject.typeId,
      title: store.application.state.activeProject.title,
      description: store.application.state.activeProject.description,
      completed: store.application.state.activeProject.completed,
      archived: !store.application.state.activeProject.archived,
      dateModified: store.application.state.activeProject.dateModified,
      dateCreated: store.application.state.activeProject.dateCreated,
    };
    const response = store.application.updateProject(updatedProject);

    if (response !== undefined) {
      emit("handleDeleteModalClose");
    }
  } else {
    console.error("Active project is null, cannot archive");
  }
}

async function deleteProject(): Promise<void> {
  try {
    const { api } = window;
    const response = await api.send(
      "projects-delete",
      store.application.state.activeProject!.id!
    );

    if (response && response instanceof Error === false) {
      // Display success message
      await store.application.getProjects();

      emit("handleDeleteModalClose");

      // Route to most recent project if there is more than 1 (1 is the one about to be deleted)
      if (store.application.state.projects.length > 0) {
        store.application.setActiveProject(store.application.state.projects[0]);
        router.push(`/summary/${store.application.state.projects[0].id}`);
      } else {
        // All Projects have been deleted
        // Need to close all open columns as they rely on projects state
        store.application.state.columns.forEach(
          (column) => (column.isActive = false)
        );
        router.replace(`/`);
      }
    } else {
      // toast error
      console.error(response);
    }
  } catch (error: any | Error) {
    // also toast error
    console.error(error);
  }
}
</script>

<template>
  <base-template-modal-delete
    :is-modal-active="isModalActive"
    :has-archive-button="!store.application.state.active?.archived"
    @close-modal="$emit('handleDeleteModalClose')"
    @handle-archive-click="archiveProject"
    @handle-delete-click="deleteProject"
  >
    Deleting this project will irrecoverably delete all progress, goals, notes,
    and documents.
    <span v-if="store.application.state.active?.archived === false">
      If you think you may want to reference this project in the future, it is
      highly recommended to archive this project instead.</span
    >
  </base-template-modal-delete>
</template>
