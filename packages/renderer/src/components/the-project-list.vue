<script setup lang="ts">
import type { Project } from "interfaces";

interface Props {
  projects: Project[] | null;
  selectedProjectId: string | undefined;
}

const { projects } = defineProps<Props>();

// TODO:
// use a computed prop that changes whenever the sorting or projects change
// but for now, do not worry about that

const emit = defineEmits<{
  (e: "deleteProject", response: string): void;
  (e: "selectProject", response: string): void;
}>();

function emitDeleteProject(id: string) {
  emit("deleteProject", id);
}

function emitSelectProject(id: string) {
  emit("selectProject", id);
}
</script>

<template>
  <!--
        TODO:
        1. List all project - DONE
        1.5. Long project names need to '...'
        2. Clicking the delete button, deletes - DONE
        3. Organize by headers: In Progress, Completed, Archived
        4. Sort by: Alphabetical, Date Created, Last Updated (will need to display dates if sorting by those)
        5. Can type in the search bar to "filter"
    -->
  <div v-for="project in projects" :key="project.id">
    <!-- TODO: needs to be select-able with ENTER, and clickable with enter -->
    <div
      :class="selectedProjectId === project.id && 'bg-primary text-white'"
      class="flex justify-between cursor-pointer font-medium rounded-md px-2"
    >
      <div class="w-full" @click="emitSelectProject(project.id ?? '')">
        {{ project.title }}
      </div>
      <button class="ml-4" @click="emitDeleteProject(project.id ?? '')">
        <!-- TODO: trashcan icon -->
        DELETE
      </button>
    </div>
  </div>
</template>
