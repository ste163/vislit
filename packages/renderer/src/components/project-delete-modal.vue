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

async function archiveProject(): Promise<void> {
  if (store.state.activeProject !== null) {
    const updatedProject: Project = {
      id: store.state.activeProject.id,
      typeId: store.state.activeProject.typeId,
      title: store.state.activeProject.title,
      description: store.state.activeProject.description,
      completed: store.state.activeProject.completed,
      archived: !store.state.activeProject.archived,
      dateModified: store.state.activeProject.dateModified,
      dateCreated: store.state.activeProject.dateCreated,
    };

    await store.updateProject(updatedProject);
    emit("handleDeleteModalClose");
  }
}

async function deleteProject(): Promise<void> {
  try {
    const { api } = window;
    const response = await api.send(
      "projects-delete",
      store.state.activeProject!.id!
    );

    if (response && response instanceof Error === false) {
      // Display success message
      await store.getProjects();

      emit("handleDeleteModalClose");

      // Route to most recent project if there is more than 1 (1 is the one about to be deleted)
      if (store.state.projects.length > 0) {
        store.setActiveProject(store.state.projects[0]);
        router.push(`/summary/${store.state.projects[0].id}`);
      } else {
        // All Projects have been deleted
        // Need to close all open columns as they rely on projects state
        store.state.columns.forEach((column) => (column.isActive = false));
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
    :has-archive-button="!store.state.activeProject?.archived"
    @close-modal="$emit('handleDeleteModalClose')"
    @handle-archive-click="archiveProject"
    @handle-delete-click="deleteProject"
  >
    Deleting this project will irrecoverably delete all progress, goals, notes,
    and documents.
    <span v-if="store.state.activeProject?.archived === false">
      If you think you may want to reference this project in the future, it is
      highly recommended to archive this project instead.</span
    >
  </base-template-modal-delete>
</template>
