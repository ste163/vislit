<template>
  <nav class="sidebar-container">
    <!-- TODO -->
    <!-- Needs to include props for: isTextShown, isActive, button's active color -->
    <!-- Create the toggle buttons for columns, that create columns -> which needs a new button that uses the BaseButtonToggle -->
    <div>
      <div class="sidebar-header" draggable="false">Views</div>
      <button-router-link :route="'/'" class="sidebar-button">
        <template v-slot:icon>
          <app-icon-summary class="button-icon" />
        </template>
        Summary
      </button-router-link>

      <button-router-link :route="'/writer'" class="sidebar-button">
        <template v-slot:icon>
          <app-icon-writer class="button-icon" />
        </template>
        Document Writer
      </button-router-link>

      <button-router-link :route="'/progress'" class="sidebar-button">
        <template v-slot:icon>
          <app-icon-progress class="button-icon" />
        </template>
        Progress
      </button-router-link>

      <button-router-link :route="'/visualization'" class="sidebar-button">
        <template v-slot:icon>
          <app-icon-visualization class="button-icon" />
        </template>
        Visualizations
      </button-router-link>

      <button-router-link :route="'/thesaurus'" class="sidebar-button">
        <template v-slot:icon>
          <app-icon-thesaurus class="button-icon" />
        </template>
        Thesaurus
      </button-router-link>

      <div class="sidebar-header top-margin" draggable="false">Columns</div>
      <button-column class="sidebar-button">
        <template v-slot:icon>
          <app-icon-project class="button-icon" />
        </template>
        Projects
      </button-column>

      <button-column class="sidebar-button">
        <template v-slot:icon>
          <app-icon-note class="button-icon" />
        </template>
        Notes
      </button-column>

      <button-column class="sidebar-button">
        <template v-slot:icon>
          <app-icon-lexicon class="button-icon" />
        </template>
        Lexicons
      </button-column>
    </div>

    <div>
      <button-column class="sidebar-button">
        <template v-slot:icon>
          <app-icon-setting class="button-icon" />
        </template>
        Settings
      </button-column>
    </div>
  </nav>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
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
.sidebar-button {
  margin: 0.1em 0;
}

.top-margin {
  margin-top: 1.5em;
}
</style>
