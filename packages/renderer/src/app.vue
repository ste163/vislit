<script setup lang="ts">
import type { Project, Type } from "interfaces";
import { ref, onMounted } from "vue";
import send from "./api";
import TheSidebar from "./components/the-sidebar.vue";

const isLoading = ref<boolean>(true);
const isFetchErrorActive = ref<boolean>(false);
const fetchErrorMessage = ref<string>("");

const types = ref<Type[]>([]);
const projects = ref<Project[]>([]);

onMounted(async () => {
  try {
    const typesResponse = (await send("types-get-all")) as Type[];
    if (typesResponse instanceof Error) throw typesResponse;
    types.value = typesResponse;
    const projectsResponse = (await send("projects-get-all")) as Project[];
    if (projectsResponse instanceof Error) throw projectsResponse;
    projects.value = projectsResponse;
  } catch (error: any | Error) {
    console.log(error);
    fetchErrorMessage.value = error?.message;
    isFetchErrorActive.value = true;
  } finally {
    isLoading.value = false;
  }

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
  <div v-if="isFetchErrorActive" class="h-full w-full flex flex-col">
    <h1>Unable to access data</h1>
    <p>
      Please restart Vislit. If the error persists, share the below error
      message on GitHub issues (link)
    </p>
    <p>Error message: {{ fetchErrorMessage }}</p>
  </div>

  <div v-else class="h-full w-full flex">
    <the-sidebar :is-disabled="true" :is-loading="isLoading" />

    <div class="flex-grow">
      <main class="flex flex-col h-full p-4">
        <router-view v-slot="{ Component, route }" :is-loading="isLoading">
          <component :is="Component" :key="route.path" />
        </router-view>
      </main>
    </div>
  </div>
</template>
