<script setup lang="ts">
import { RouterLink } from "vue-router";
import { PATHS } from "router";
import IconSummary from "icons/icon-summary.vue";
import IconWriter from "icons/icon-writer.vue";
import IconProgress from "icons/icon-progress.vue";
import IconVisualization from "icons/icon-visualization.vue";
import IconProject from "icons/icon-project.vue";
import IconNote from "icons/icon-note.vue";

interface Props {
  isDisabled: boolean;
  isLoading: boolean;
  isProjectColumnActive: boolean;
}

const { isDisabled, isLoading } = defineProps<Props>();
const emit = defineEmits(["clickProjectsColumn"]);

function handleProjectColumnClick(): void {
  emit("clickProjectsColumn");
}
</script>
<template>
  <!-- TODO:
    - can minimize sidebar
 -->
  <nav class="bg-white w-[135px] flex flex-col select-none">
    <div
      v-if="isLoading"
      data-testId="loading-sidebar"
      class="flex flex-col gap-2 px-3 mt-2"
    >
      <div class="bg-gray-200 w-6/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-6/12 animate-pulse h-5 rounded-xl mt-8" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
    </div>
    <div v-else>
      <div>
        <h2 :class="isDisabled && 'text-gray-300'" class="sidebar-header mt-2">
          Views
        </h2>
        <ul>
          <li>
            <router-link
              class="sidebar-item"
              :class="isDisabled && 'sidebar-item-disabled'"
              :to="isDisabled ? '' : PATHS.Project"
            >
              <icon-summary class="sidebar-item-icon" />
              <span class="sidebar-item-text">Summary</span>
            </router-link>
          </li>
          <li>
            <router-link
              class="sidebar-item"
              :class="isDisabled && 'sidebar-item-disabled'"
              :to="isDisabled ? '' : PATHS.Writer"
            >
              <icon-writer class="sidebar-item-icon" />
              <span class="sidebar-item-text">Writer</span>
            </router-link>
          </li>
          <li>
            <router-link
              class="sidebar-item"
              :class="isDisabled && 'sidebar-item-disabled'"
              :to="isDisabled ? '' : PATHS.Progress"
            >
              <icon-progress class="sidebar-item-icon" />
              <span class="sidebar-item-text">Progress</span>
            </router-link>
          </li>
          <li>
            <router-link
              class="sidebar-item"
              :class="isDisabled && 'sidebar-item-disabled'"
              :to="isDisabled ? '' : PATHS.Visualizations"
            >
              <icon-visualization class="sidebar-item-icon" />
              <span class="sidebar-item-text">Visualizations</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div>
        <h2 :class="isDisabled && 'text-gray-300'" class="sidebar-header mt-8">
          Columns
        </h2>
        <ul>
          <li
            :class="
              !isDisabled && isProjectColumnActive && 'column-button-active'
            "
          >
            <button
              class="sidebar-item"
              :disabled="isDisabled"
              @click="handleProjectColumnClick"
            >
              <icon-project class="sidebar-item-icon" />
              <span class="sidebar-item-text">Projects</span>
            </button>
          </li>
          <li>
            <button class="sidebar-item" :disabled="isDisabled">
              <icon-note class="sidebar-item-icon" />
              <span class="sidebar-item-text">Notes</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.sidebar-header {
  @apply text-xs px-3;
}

.sidebar-item {
  @apply flex w-full px-3 my-3 disabled:text-gray-300 disabled:fill-gray-300 py-1;
}

/* Hacky fix: vue router v4 doesn't have 'disabled', so using empty string to mimic no routing; 
however, if the route is '/' (welcome page), then it sets all routes as the active class */
.sidebar-item-disabled {
  @apply text-gray-300 fill-gray-300 cursor-default bg-white !important;
}

.sidebar-item-text {
  @apply text-xs font-semibold ml-2;
}

.sidebar-item-icon {
  @apply pt-0.5 h-[1.0rem] w-[1.0rem];
}

.router-link-exact-active,
.column-button-active {
  @apply bg-primary fill-white text-white rounded-md;
}
</style>
