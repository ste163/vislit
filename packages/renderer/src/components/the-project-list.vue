<script setup lang="ts">
import type { Project } from "interfaces";

interface Props {
  projects: Project[] | null;
}

const { projects } = defineProps<Props>();
// TODO:
// Whenever a project is deleted,
// need to emit the delete event so that the app.vue can either re-fetch all projects
// or update its list to have that one item removed with X id
// - no need to handle the add, as the project form does that
</script>

<template>
  <!--
    Only render this column if there are projects,
    the emitted delete event will allow app to decide
    what column state to show when there are no projects
  -->
  <div v-if="projects && projects.length">
    PROJECT LIST RENDERING
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
  </div>
</template>
