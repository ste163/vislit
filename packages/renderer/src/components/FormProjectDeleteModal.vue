<script setup lang="ts">
import { computed, inject } from "vue";
import { useRouter } from "vue-router";
import type { Project } from "interfaces";
import type Store from "../store/Store";
import BaseTemplateModalDelete from "./BaseTemplateModalDelete.vue";

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
  if (store.projects.state.active !== null) {
    const updatedProject: Project = {
      id: store.projects.state.active.id,
      typeId: store.projects.state.active.typeId,
      title: store.projects.state.active.title,
      description: store.projects.state.active.description,
      completed: store.projects.state.active.completed,
      archived: !store.projects.state.active.archived,
      dateModified: store.projects.state.active.dateModified,
      dateCreated: store.projects.state.active.dateCreated,
    };
    const response = store.projects.updateProject(updatedProject);

    if (response !== undefined) {
      emit("handleDeleteModalClose");
    }
  } else {
    console.error("Active project is null, cannot archive");
  }
}

async function deleteProject(): Promise<void> {
  if (store.projects.state.active !== null) {
    const response = await store.projects.deleteProject(
      store.projects.state.active.id!
    );

    if (response === true) {
      emit("handleDeleteModalClose");

      // Route to most recent project if there is more than 1 (1 is the one about to be deleted)
      if (store.projects.state.all.length > 0) {
        store.projects.setActiveProject(store.projects.state.all[0]);
        router.push(`/summary/${store.projects.state.all[0].id}`);
      } else {
        // All Projects have been deleted
        // Need to close all open columns as they rely on projects state
        store.application.state.columns.forEach(
          (column) => (column.isActive = false)
        );
        router.replace(`/`);
      }
    }
  } else {
    console.error("Active project is null, cannot delete");
  }
}

const archiveWarningText = computed(() => {
  if (store.projects.state.active?.archived === true) {
    return "";
  } else {
    return `
			If you think you may want to reference this project in the future, 
			it is highly recommended to archive this project instead.
		`;
  }
});
</script>

<template>
  <base-template-modal-delete
    :is-modal-active="isModalActive"
    :has-archive-button="!store.projects.state.active?.archived"
    @close-modal="$emit('handleDeleteModalClose')"
    @handle-archive-click="archiveProject"
    @handle-delete-click="deleteProject"
  >
    Deleting this project will irrecoverably delete all progress, goals, notes,
    and writing.
    {{ archiveWarningText }}
  </base-template-modal-delete>
</template>
