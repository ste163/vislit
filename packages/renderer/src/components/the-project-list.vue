<script setup lang="ts">
import type { Project } from "interfaces";

interface Props {
  projects: Project[] | null;
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
  <!-- Filtering/Controls/Button to swap between list and form (form needs a back button) -->
  <!-- LIST of all projects -->
  <!--
        TODO:
        1. List all project 
        2. Clicking the delete button, deletes
        3. Organize by headers: In Progress, Completed, Archived
        4. Sort by: Alphabetical, Date Created, Last Updated (will need to display dates if sorting by those)
        5. Can type in the search bar to "filter"
    -->
  <div v-for="project in projects" :key="project.id">
    <div class="flex">
      <div @click="emitSelectProject(project.id ?? '')">
        {{ project.title }}
      </div>
      <button class="ml-4" @click="emitDeleteProject(project.id ?? '')">
        DELETE
      </button>
    </div>
  </div>
</template>
