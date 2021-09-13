<template>
  <nav class="sidebar-container">
    <!-- TODO -->
    <!-- Button templates for nav buttons -->
    <!-- Needs to include props for: icon, isTextShown, isActive, button's active color -->
    <!-- nav buttons and column buttons will be different -->
    <!-- the active button state really does need to be passed in, so i can control it globally -->

    <!-- Views -->
    <button-router-link :to="'/'"> Summary </button-router-link>

    <button-router-link :to="'/writer'"> Document Writer </button-router-link>

    <button-router-link :to="'/progress'"> Progress </button-router-link>

    <button-router-link :to="'/visualizations'">
      Visualizations
    </button-router-link>

    <button-router-link :to="'/thesaurus'"> Thesaurus </button-router-link>

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
</style>
