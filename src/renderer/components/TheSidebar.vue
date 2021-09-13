<template>
  <nav class="sidebar-container">
    <!-- TODO -->
    <!-- Needs to include props for: icon, isTextShown, isActive, button's active color -->
    <!-- nav buttons and column buttons will be different -->
    <!-- the active button state really does need to be passed in, so i can control it globally -->

    <div class="sidebar-header">Views</div>
    <button-router-link :route="'/'"> Summary </button-router-link>

    <button-router-link :route="'/writer'">
      Document Writer
    </button-router-link>

    <button-router-link :route="'/progress'"> Progress </button-router-link>

    <button-router-link :route="'/visualization'">
      Visualizations
    </button-router-link>

    <button-router-link :route="'/thesaurus'"> Thesaurus </button-router-link>

    <!-- Columns -->
    <!-- Toggle Buttons for:
    - Projects
    - Notes
    - Lexicons
    - Settings -->
  </nav>
</template>

<script setup lang="ts">
import ButtonRouterLink from "./ButtonRouterLink.vue";

// State for the active view
// Which will come from my custom global store
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-flow: column nowrap;
  background-color: var(--white);
  width: 9em;
  padding: 1.5em 0.2em;
  box-shadow: black -20px 0px 30px;
  z-index: 1;
}

.sidebar-header {
  font-weight: 300;
  font-size: 0.8em;
  margin-left: 1.25em;
  cursor: default;
}
</style>
