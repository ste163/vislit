<script setup lang="ts">
import { ref, onMounted } from "vue";
import TheSidebar from "./components/the-sidebar.vue";

const isLoading = ref<boolean>(true);

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
  // IF ERROR:
  // do not turn off loading state
  // ipc call the error to display the error dialog box from electron
});
//
// Pass loading state into both sidebar and router-view components
// Because we won't know what the side-bar state is until after
// data fetching, local storage reading, setting all that state, THEN stop loading
// after all data is prepared
</script>

<template>
  <the-sidebar :is-disabled="true" :is-loading="isLoading" />

  <div class="flex-grow">
    <main class="flex flex-col h-full p-4">
      <router-view v-slot="{ Component }" :is-loading="isLoading">
        <component :is="Component" />
      </router-view>
    </main>
  </div>
</template>
