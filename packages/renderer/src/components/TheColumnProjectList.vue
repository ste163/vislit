<script setup lang="ts">
import { inject, onMounted, watch } from "vue";
import type { RouteLocationRaw} from "vue-router";
import { useRouter } from "vue-router";
import type IStore from "../store/interfaces/IStore";
import BaseButtonClick from "./BaseButtonClick.vue";
import ColumnListHeader from "./ColumnListHeader.vue";
import ColumnListItem from "./ColumnListItem.vue";

const store = inject("store") as IStore;

const router = useRouter();

// eslint-disable-next-line no-undef
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

// Must pass anonymous function into watch before calling updateRouteId
// Otherwise there's an overload error in TS (even though it works correctly)
watch(() => store.projects.state.active?.id, () => updateRouteId(store.projects.state.active?.id));

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
      <base-button-click
        :background-color="'var(--white)'"
        @click="emitClick"
      >
        Create Project
      </base-button-click>
  
      <!-- Checkbox component for: Show detailed project information -->
  
      <!-- Searchbar for Filter Projects by Title, Type, or Description -->
    </div>

    <!-- By default, show In Progress header: need header component that's dynamic -->

    <!-- Will need if checks for if the project.archived !== true, place in In progress -->

    <!-- if project.archived === true, place in Archived, with a grayed out color, and at the bottom of the list always -->

    <!-- If searching for anything, hide all other items, and make the header say: Filtering by: term -->

    <column-list-header>In Progress</column-list-header>

    <!-- List of Items -> to be moved into ColumnListItem -->
    <div class="column-list-item-container">
      <column-list-item 
        v-for="project in store.projects.state.all"
        :key="project.id"
        :project="project"
        @click="store.projects.setActiveProject(project)"
      />
    </div>
  </div>
</template>

<style scoped>
.column-list-controls {
  margin: 1em 0 2em 0;
}

.column-list-header {
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: var(--letterSpacingSmall);
  margin: 0.5em 0;
}

.column-list-item-container {
  display: flex;
  flex-flow: column nowrap;
}
</style>
