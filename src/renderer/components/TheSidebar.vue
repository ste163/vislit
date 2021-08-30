<template>
  <nav class="sidebar-container">
    <!-- These aren't really router links, but open/closers for columns -->
    <!-- Except for Settings, Progress, Document Writer -->
    <!-- On Document Writer, Visualizations, and Progress, will have a back arrow/up arrow to go to the summary card -->
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
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
