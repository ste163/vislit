<template>
  <!-- TODO -->
  <!-- Columns will be templates -->
  <!-- Allow columns to be created when clicking a nav item -->
  <!-- Allow columns to be resizable -->
  <!-- Allow columns to be dragged and dropped -->
  <!-- Allow columns to be replaced when a new one is clicked (ie, its content changing) -->
  <!-- Allow columns to be pinned/locked -->
  <the-sidebar />

  <!-- If the drop-zones are empty, only show them when the user is dragging a column -->
  <div>
    <!-- Left draggable area -->
  </div>

  <main>
    <router-view />
  </main>

  <div>
    <!-- Right draggable area -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheSidebar from "./components/TheSidebar.vue";

export default defineComponent({
  components: { TheSidebar },
});
</script>

<style>
#app {
  display: flex;
  flex-flow: row nowrap;
  height: 100vh;
}
</style>
