<template>
  <nav class="sidebar-container">
    <!-- TODO -->
    <!-- Needs to include props for: isTextShown, isActive, button's active color -->
    <!-- Create the toggle buttons for columns, that create columns -> which needs a new button that uses the BaseButtonToggle -->

    <div class="sidebar-header" draggable="false">Views</div>
    <button-router-link :route="'/'">
      <template v-slot:icon>
        <app-icon-summary class="button-icon" />
      </template>
      Summary
    </button-router-link>

    <button-router-link :route="'/writer'">
      <template v-slot:icon>
        <app-icon-writer class="button-icon" />
      </template>
      Document Writer
    </button-router-link>

    <button-router-link :route="'/progress'">
      <template v-slot:icon>
        <app-icon-progress class="button-icon" />
      </template>
      Progress
    </button-router-link>

    <button-router-link :route="'/visualization'">
      <template v-slot:icon>
        <app-icon-visualization class="button-icon" />
      </template>
      Visualizations
    </button-router-link>

    <button-router-link :route="'/thesaurus'">
      <template v-slot:icon>
        <app-icon-thesaurus class="button-icon" />
      </template>
      Thesaurus
    </button-router-link>

    <div class="sidebar-header top-margin" draggable="false">Columns</div>
    <!--
    Toggle Buttons for:
    - Projects
    - Notes
    - Lexicons
    - Settings
    -->
  </nav>
</template>

<script setup lang="ts">
import ButtonRouterLink from "./ButtonRouterLink.vue";
import AppIconSummary from "./AppIconSummary.vue";
import AppIconWriter from "./AppIconWriter.vue";
import AppIconProgress from "./AppIconProgress.vue";
import AppIconVisualization from "./AppIconVisualization.vue";
import AppIconThesaurus from "./AppIconThesaurus.vue";
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-flow: column nowrap;
  background-color: var(--white);
  width: 10em;
  padding: 0.5em 0em;
  box-shadow: black -20px 0px 30px;
  user-select: none;
  z-index: 1;
}

.sidebar-header {
  font-weight: 300;
  font-size: 0.8em;
  margin-left: 1.25em;
  cursor: default;
}

.top-margin {
  margin-top: 1.5em;
}
</style>
