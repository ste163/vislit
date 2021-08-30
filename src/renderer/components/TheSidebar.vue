<template>
  <nav class="sidebar-container">
    <!-- TODO -->
    <!-- Button templates for nav items -->
    <!-- Needs to include props for: icon, isTextShown, isActive -->

    <!-- These aren't really router links, but open/closers for columns -->
    <!-- Except for Settings, Progress, Document Writer -->
    <!-- On Document Writer, Visualizations, and Progress, will have a back arrow/up arrow to go to the summary card -->
    <router-link to="/">Projects</router-link>
    <router-link to="/Progress">Progress</router-link>
  </nav>
</template>

<script lang="ts"></script>

<style scoped>
.sidebar-container {
  display: flex;
  flex-flow: column nowrap;
  background-color: white;
  width: 3em;
  padding: 1em;
}
</style>
