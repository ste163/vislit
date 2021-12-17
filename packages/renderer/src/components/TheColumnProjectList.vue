<script setup lang="ts">
import type { ProjectModel } from "interfaces";
import type { ComputedRef } from "vue";
import { computed, inject, onMounted, watch } from "vue";
import type { RouteLocationRaw } from "vue-router";
import { useRouter } from "vue-router";
import type StoreModel from "../store/interfaces/StoreModel";
import BaseButtonClick from "./BaseButtonClick.vue";
import ColumnListHeader from "./ColumnListHeader.vue";
import ColumnListItem from "./ColumnListItem.vue";

const store = inject("store") as StoreModel;

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

const inProgressProjects: ComputedRef<ProjectModel[]> = computed(() => {
  return store.projects.state.all.filter(
    (project) => project.archived === false && project.completed === false
  );
});

const completedProjects: ComputedRef<ProjectModel[]> = computed(() => {
  return store.projects.state.all.filter(
    (project) => project.archived === false && project.completed === true
  );
});

const archivedCompletedProjects: ComputedRef<ProjectModel[]> = computed(() => {
  return store.projects.state.all.filter(
    (project) => project.archived === true && project.completed === true
  );
});

const archivedRetiredProjects: ComputedRef<ProjectModel[]> = computed(() => {
  return store.projects.state.all.filter(
    (project) => project.archived === true && project.completed === false
  );
});

// Must pass anonymous function into watch before calling updateRouteId
// Otherwise there's an overload error in TS (even though it works correctly)
watch(
  () => store.projects.state.active?.id,
  () => updateRouteId(store.projects.state.active?.id)
);

onMounted(async () => {
  // Always get the most up-to-date list of projects when column opens
  if (store.projects !== null && store.projects.state.active !== null) {
    await store.projects.getProjects();
  }
});
</script>

<template>
  <div>
    <!-- Move the Create button, checkbox & search bar into ColumnListControls component -->
    <div class="column-list-controls">
      <base-button-click :background-color="'var(--white)'" @click="emitClick">
        Create Project
      </base-button-click>
      <!-- Checkbox component for: Show detailed project information -->
      <!-- Searchbar for Filter Projects by Title, Type, or Description -->
    </div>

    <!-- If searching for anything, hide all other items, and make the header say: Filtering by: term -->

    <div v-if="inProgressProjects.length > 0">
      <column-list-header>In Progress</column-list-header>
      <!-- List of Items -> to be moved into ColumnListItem -->
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in inProgressProjects"
          :key="project.id"
          :project="project"
          @click="store.projects.setActiveProject(project)"
        />
      </div>
    </div>

    <!-- style as greyed? -->
    <div v-if="completedProjects.length > 0">
      <column-list-header>Completed</column-list-header>
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in completedProjects"
          :key="project.id"
          :project="project"
          @click="store.projects.setActiveProject(project)"
        />
      </div>
    </div>

    <!-- Style as greyed -->
    <div v-if="archivedCompletedProjects.length > 0">
      <column-list-header>Archived, Completed</column-list-header>
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in archivedCompletedProjects"
          :key="project.id"
          :project="project"
          @click="store.projects.setActiveProject(project)"
        />
      </div>
    </div>

    <!-- Style as greyed -->
    <div v-if="archivedRetiredProjects.length > 0">
      <column-list-header>Archived, Retired</column-list-header>
      <div class="column-list-item-container">
        <column-list-item
          v-for="project in archivedRetiredProjects"
          :key="project.id"
          :project="project"
          @click="store.projects.setActiveProject(project)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.column-list-controls {
  margin: 1em 0 2em 0;
  padding: 0.5em 0.75em;
}

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
