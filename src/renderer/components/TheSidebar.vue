<template>
  <nav class="sidebar-container">
    <base-button>button</base-button>
    <!-- TODO -->
    <!-- Button templates for nav buttons -->
    <!-- Needs to include props for: icon, isTextShown, isActive, button's active color -->

    <!-- Views -->
    <!-- Views for 
    Summary
    Document Writer
    Progress
    Visualizations
    Thesaurus -->
    <router-link to="/">Summary</router-link>
    <router-link to="/Progress">Progress</router-link>

    <!-- Columns -->
    <!-- Buttons for:
    - Projects
    - Notes
    - Lexicons
    - Settings -->
  </nav>
</template>

<script setup lang="ts">
import BaseButton from "./BaseButton.vue";
</script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-flow: column nowrap;
  background-color: white;
  width: 6em;
  padding: 1em;
  box-shadow: black -20px 0px 30px;
  z-index: 1;
}
</style>
