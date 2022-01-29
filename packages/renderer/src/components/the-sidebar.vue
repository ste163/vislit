<script setup lang="ts">
import { inject } from "vue";
import type { Store } from "../store";
import useIsSidebarDisabled from "../composables/use-is-sidebar-disabled";
import ButtonRouterLink from "./button-router-link.vue";
import AppIconSummary from "./app-icon-summary.vue";
import AppIconWriter from "./app-icon-writer.vue";
import AppIconProgress from "./app-icon-progress.vue";
import AppIconVisualization from "./app-icon-visualization.vue";
import ButtonColumn from "./button-column.vue";
import AppIconProject from "./app-icon-project.vue";
import AppIconNote from "./app-icon-note.vue";
import AppIconSetting from "./app-icon-setting.vue";

const store = inject("store") as Store;

const isSidebarDisabled = useIsSidebarDisabled();

// TODO:
// - add <transition /> to animate the sidebar open
</script>

<template>
  <nav
    class="sidebar-container"
    :class="
      store.state.isSidebarMinimized ? 'sidebar-minimized' : 'sidebar-open'
    "
  >
    <div>
      <div
        class="sidebar-header"
        draggable="false"
        :class="{ 'sidebar-header-disabled': isSidebarDisabled }"
      >
        <span v-if="!store.state.isSidebarMinimized"> Views </span>
      </div>
      <button-router-link
        :route="`/summary/${store.state.activeProject?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-summary class="button-icon" />
        </template>
        <span v-if="!store.state.isSidebarMinimized"> Summary </span>
      </button-router-link>

      <button-router-link
        :route="`/writer/${store.state.activeProject?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-writer class="button-icon" />
        </template>
        <span v-if="!store.state.isSidebarMinimized"> Document Writer </span>
      </button-router-link>

      <button-router-link
        :route="`/progress/${store.state.activeProject?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-progress class="button-icon" />
        </template>
        <span v-if="!store.state.isSidebarMinimized"> Progress </span>
      </button-router-link>

      <button-router-link
        :route="`/visualization/${store.state.activeProject?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-visualization class="button-icon" />
        </template>
        <span v-if="!store.state.isSidebarMinimized"> Visualizations </span>
      </button-router-link>

      <div
        class="sidebar-header mt-7"
        :class="{ 'sidebar-header-disabled': isSidebarDisabled }"
        draggable="false"
      >
        <span v-if="!store.state.isSidebarMinimized"> Columns </span>
      </div>
      <button-column class="sidebar-button">
        <template #icon>
          <app-icon-project class="button-icon" />
        </template>
        <span v-if="!store.state.isSidebarMinimized"> Projects </span>
      </button-column>

      <button-column class="sidebar-button">
        <template #icon>
          <app-icon-note class="button-icon" />
        </template>
        <span v-if="!store.state.isSidebarMinimized"> Notes </span>
      </button-column>
    </div>

    <div class="flex flex-col">
      <button-column class="mb-8">
        <template #icon>
          <app-icon-setting class="button-icon" />
        </template>
        <span v-if="!store.state.isSidebarMinimized"> Settings </span>
      </button-column>

      <button
        class="btn-none arrow__container--sidebar"
        @click="store.setIsSidebarMinimized"
      >
        <div
          :class="{
            'arrow--sidebar': true,
            'arrow--sidebar--active': !store.state.isSidebarMinimized,
          }"
        />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidebar-container {
  background-color: var(--white);
  box-shadow: #00000027 -10px 0px 30px;
  @apply flex
    flex-col
    flex-nowrap
    justify-between
    py-2
    select-none
    z-10
    transition-all;
}

.sidebar-minimized {
  @apply w-12;
}

.sidebar-open {
  @apply w-40 min-w-max;
}

.sidebar-header {
  @apply text-xs
    cursor-default
    ml-4
    font-light;
}

.sidebar-header-disabled {
  color: var(--gray);
}
.sidebar-button {
  @apply my-1;
}

/* Side-bar Arrow -> no tailwind */
.arrow__container--sidebar {
  transform: scale(0.8);
  position: absolute;
  bottom: 5px;
}

.arrow__container--sidebar:hover > .arrow--sidebar::after,
.arrow--sidebar::before {
  background-color: var(--black);
}

.arrow__container--sidebar:hover > .arrow--sidebar::before {
  background-color: var(--black);
}

.arrow--sidebar::after,
.arrow--sidebar::before {
  content: "";
  display: block;
  width: 18px;
  height: 3.5px;
  border-radius: 10px;
  background-color: var(--black);
  margin: 3px 0px;
  transition: 0.3s;
}

.arrow--sidebar::after {
  transform: rotate(-30deg) translate(-1px, 0px);
}

.arrow--sidebar::before {
  transform: rotate(-147deg) translate(1px, 0px);
}

.arrow--sidebar--active::after {
  transform: rotate(-145deg) translate(-7px, 0px);
}

.arrow--sidebar--active::before {
  transform: rotate(-35deg) translate(4px, 4px);
}
</style>
