<script setup lang="ts">
import { onMounted } from "vue";
import TheSidebar from "./components/the-sidebar.vue";

onMounted(async () => {
  // isLoading is true by default
  // fetch Projects
  // fetch Types
  // if no projects, show welcome view
  // // route to '/'
  // // stop loading
  // else,
  // read localStorage
  // if it's got a last opened project, open that project
  // if there is no last opened project, open most recent
  // route to /project/:id
  // stop loading
});
</script>

<template>
  <the-sidebar />

  <div class="flex-grow">
    <main class="m-4">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>
