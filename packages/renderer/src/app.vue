<script setup lang="ts">
import { onMounted } from "vue";

onMounted(async () => {
  // Show loading
  // fetch Projects
  // fetch Types
  // if no projects, show welcome view
  // otherwise, read localStorage
  // if it's got a last opened project, open that project
  // if there is no last opened project
  // open most recent
  // stop loading
});
</script>

<template>
  <the-sidebar />

  <div>
    <main>
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>
