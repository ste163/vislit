<template>
  <nav class="sidebar-container">
    <base-button>Create</base-button>
    <!-- TODO -->
    <!-- Button templates for nav buttons -->
    <!-- Needs to include props for: icon, isTextShown, isActive, button's active color -->
    <!-- nav buttons and column buttons will be different -->
    <!-- the active button state really does need to be passed in, so i can control it globally -->

    <!-- Views -->
    <!-- Views for 
    Summary
    Document Writer
    Progress
    Visualizations
    Thesaurus -->
    <router-link class="router-link" to="/">
      <base-button> Summary </base-button>
    </router-link>

    <router-link class="router-link" to="/Progress">
      <base-button> Progress </base-button>
    </router-link>

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
  background-color: var(--white);
  width: 6em;
  padding: 1.5em 0.2em;
  box-shadow: black -20px 0px 30px;
  z-index: 1;
}
</style>
