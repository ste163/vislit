<script setup lang="ts">
import { inject } from "vue";
import type IStore from "../store/interfaces/IStore";
import useIsSidebarDisabled from "../composables/useIsSidebarDisabled";
import ButtonRouterLink from "./ButtonRouterLink.vue";
import AppIconSummary from "./AppIconSummary.vue";
import AppIconWriter from "./AppIconWriter.vue";
import AppIconProgress from "./AppIconProgress.vue";
import AppIconVisualization from "./AppIconVisualization.vue";
import AppIconThesaurus from "./AppIconThesaurus.vue";
import ButtonColumn from "./ButtonColumn.vue";
import AppIconProject from "./AppIconProject.vue";
import AppIconNote from "./AppIconNote.vue";
import AppIconLexicon from "./AppIconLexicon.vue";
import AppIconSetting from "./AppIconSetting.vue";

const store = inject("store") as IStore;

const isSidebarDisabled = useIsSidebarDisabled();
</script>

<template>
  <nav
    class="sidebar-container"
    :class="store.application.state.isSidebarMinimized ? 'sidebar-mininized' : 'sidebar-open' 
    "
  >
    <!-- TODO -->
    <!-- Make sidebar minimize-able -->
    <!-- Needs to include props for: isTextShown which has isMinimized passed in -->
    <div>
      <div
        class="sidebar-header"
        draggable="false"
        :class="{ 'sidebar-header-disabled': isSidebarDisabled }"
      >
        Views
      </div>
      <button-router-link
        :route="`/summary/${store.projects.state.active?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-summary class="button-icon" />
        </template>
        Summary
      </button-router-link>

      <button-router-link
        :route="`/writer/${store.projects.state.active?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-writer class="button-icon" />
        </template>
        Document Writer
      </button-router-link>

      <button-router-link
        :route="`/progress/${store.projects.state.active?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-progress class="button-icon" />
        </template>
        Progress
      </button-router-link>

      <button-router-link
        :route="`/visualization/${store.projects.state.active?.id}`"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-visualization class="button-icon" />
        </template>
        Visualizations
      </button-router-link>

      <button-router-link
        :route="'/thesaurus'"
        class="sidebar-button"
      >
        <template #icon>
          <app-icon-thesaurus class="button-icon" />
        </template>
        Thesaurus
      </button-router-link>

      <div
        class="sidebar-header top-margin"
        :class="{ 'sidebar-header-disabled': isSidebarDisabled }"
        draggable="false"
      >
        Columns
      </div>
      <button-column class="sidebar-button">
        <template #icon>
          <app-icon-project class="button-icon" />
        </template>
        Projects
      </button-column>

      <button-column class="sidebar-button">
        <template #icon>
          <app-icon-note class="button-icon" />
        </template>
        Notes
      </button-column>

      <button-column class="sidebar-button">
        <template #icon>
          <app-icon-lexicon class="button-icon" />
        </template>
        Lexicons
      </button-column>
    </div>

    <div class="flex flex-col">
      <button-column class="sidebar-button">
        <template #icon>
          <app-icon-setting class="button-icon" />
        </template>
        Settings
      </button-column>

      <button
        class="btn-none arrow__container--sidebar"
        @click="store.application.setIsSidebarMinimized"
      >
        <div
          :class="{
            'arrow--sidebar': true,
            'arrow--sidebar--active': !store.application.state.isSidebarMinimized
          }"
        />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.sidebar-container {
  background-color: var(--white);
  min-width: 170px;
  width: 10em;
  padding: 0.5em 0em;
  box-shadow: #00000027 -10px 0px 30px;
  @layer components {
    @apply {
      flex
      flex-col
      flex-nowrap
      justify-between
      select-none
      z-10
      }
    }
}

.sidebar-header {
  font-weight: 300;
  font-size: 0.8em;
  margin-left: 1.25em;
  cursor: default;
}

.sidebar-header-disabled {
  color: var(--gray);
}
.sidebar-button {
  margin: 0.1em 0;
}

.top-margin {
  margin-top: 1.5em;
}

/* Side-bar Arrow */
.arrow__container--sidebar {
  display: flex;
  margin-top: 10px;
  margin-right: 10px;
  justify-content: flex-end;
  align-items: center;
}

.arrow__container--sidebar:hover > .arrow--sidebar::after,
.arrow--sidebar::before {
  background-color: black;
}

.arrow__container--sidebar:hover > .arrow--sidebar::before {
  background-color: black;
}

.arrow--sidebar::after,
.arrow--sidebar::before {
  content: "";
  display: block;
  width: 18px;
  height: 3.5px;
  border-radius: 10px;
  background-color: black;
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
