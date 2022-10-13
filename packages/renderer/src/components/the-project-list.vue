<script setup lang="ts">
import type { Project } from "interfaces";
import { IconDelete } from "icons";

interface Props {
  projects: Project[] | null;
  selectedProjectId: string | undefined;
}

const { projects } = defineProps<Props>();

// TODO:
// use a computed prop that changes whenever the sorting or projects change
// but for now, do not worry about that

// How to compute render these:
// first by filtering + sorting
// THEN
// by section off of that list
// In Progress, Completed, Archived

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
        Organize by headers: In Progress, Completed, Archived
        Sort by: Alphabetical, Date Created, Last Updated (will need to display dates if sorting by those)
        Can type in the search bar to "filter"
    -->
  <div v-for="project in projects" :key="project.id">
    <!-- TODO: only keydown for SPACEBAR or ENTER selects. Currently tab selects-->
    <div
      :class="selectedProjectId === project.id && 'bg-primary text-white'"
      class="flex justify-between cursor-pointer font-medium rounded-md p-2 my-2"
      tabindex="0"
      @click="emitSelectProject(project.id ?? '')"
      @keydown="emitSelectProject(project.id ?? '')"
    >
      <div class="w-3/4 truncate">
        {{ project.title }}
      </div>

      <button
        v-if="selectedProjectId === project.id"
        class="ml-4"
        @click.prevent="emitDeleteProject(project.id ?? '')"
      >
        <div class="w-5 h-5">
          <icon-delete />
        </div>
      </button>
    </div>
  </div>
</template>
