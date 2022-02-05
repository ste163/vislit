<!-- KNOWN BUG:
Trying to delete active progress while column is open causes error:
Missing required param "id" -->
<script setup lang="ts">
import type { Project } from "interfaces";
import type { ComputedRef } from "vue";
import { computed, inject, onMounted, watch } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { useRouter } from "vue-router";
import type { Store } from "../store";
import BaseButtonClick from "./base-button-click.vue";

import ColumnListItem from "./column-list-item.vue";

const store = inject("store") as Store;

const router = useRouter();

const emit = defineEmits(["createClick"]);

function emitClick(): void {
  emit("createClick");
}

function updateRouteId(id: string | undefined): void {
  const routeName = router.currentRoute.value.name;

  router.push({
    name: routeName,
    params: {
      id,
    },
  } as RouteLocationRaw);
}

const inProgressProjects: ComputedRef<Project[]> = computed(() => {
  return store.state.projects.filter(
    (project) => project.archived === false && project.completed === false
  );
});

const completedProjects: ComputedRef<Project[]> = computed(() => {
  return store.state.projects.filter(
    (project) => project.archived === false && project.completed === true
  );
});

const archivedCompletedProjects: ComputedRef<Project[]> = computed(() => {
  return store.state.projects.filter(
    (project) => project.archived === true && project.completed === true
  );
});

const archivedRetiredProjects: ComputedRef<Project[]> = computed(() => {
  return store.state.projects.filter(
    (project) => project.archived === true && project.completed === false
  );
});

// Must pass anonymous function into watch before all updateRouteId
// Otherwise there's an overload error in TS (even though it works correctly)
watch(
  () => store.state.activeProject?.id,
  () => updateRouteId(store.state.activeProject?.id)
);

onMounted(async () => {
  // Always get the most up-to-date list of projects when column opens
  if (store !== null && store.state.activeProject !== null)
    await store.getProjects();
});
</script>

<template>
  <div>
    <div>
      <base-button-click :background-color="'var(--white)'" @click="emitClick">
        Create Project
      </base-button-click>
      <!-- Checkbox component for: Show detailed project information -->
      <!-- Searchbar for Filter Projects by Title, Type, or Description -->
    </div>

    <!-- If searching for anything, hide all other items, and make the header say: Filtering by: term -->

    <div v-if="inProgressProjects.length > 0">
      <div class="column-list-header">In Progress</div>
      <!-- List of Items -> to be moved into ColumnListItem -->
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in inProgressProjects"
          :key="project.id"
          :project="project"
          @click="store.setActiveProject(project)"
        />
      </div>
    </div>

    <!-- style as greyed? -->
    <div v-if="completedProjects.length > 0">
      <div class="column-list-header">Completed</div>
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in completedProjects"
          :key="project.id"
          :project="project"
          @click="store.setActiveProject(project)"
        />
      </div>
    </div>

    <!-- Style as greyed -->
    <div v-if="archivedCompletedProjects.length > 0">
      <div class="column-list-header">Archived, Completed</div>
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in archivedCompletedProjects"
          :key="project.id"
          :project="project"
          @click="store.setActiveProject(project)"
        />
      </div>
    </div>

    <!-- Style as greyed -->
    <div v-if="archivedRetiredProjects.length > 0">
      <div class="column-list-header">Archived, Retired</div>
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in archivedRetiredProjects"
          :key="project.id"
          :project="project"
          @click="store.setActiveProject(project)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Convert to tailwind */

.column-list-header {
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: var(--letterSpacingSmall);
  margin: 0.5em 0;
  padding: 0.5em 0.75em;
}

.column-list-item-container {
  display: flex;
  flex-flow: column nowrap;
}
</style>
