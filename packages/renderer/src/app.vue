<script setup lang="ts">
import type { Project, Type } from "interfaces";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { send, receive } from "./api";
import TheSidebar from "./components/the-sidebar.vue";

const isLoading = ref<boolean>(true);
const isFetchErrorActive = ref<boolean>(false);
const fetchErrorMessage = ref<string>("");

const types = ref<Type[]>([]);
const projects = ref<Project[]>([]);

const router = useRouter();

receive("reload-database", () => {
  console.log("RELOAD");
  // RELOADING is currently from backend with mainWindow.reload
  // this may not work because of clearing localStorage, but works for now
  //
  // need to clear-out localStorage related to selected projects
  // and reset app-state
  // because you could have ALL new projects
  // so probably re-fresh the page after clearing storage
});

onMounted(async () => {
  try {
    const typesResponse = (await send("types-get-all")) as Type[];
    if (typesResponse instanceof Error) throw typesResponse;
    types.value = typesResponse;
    const projectsResponse = (await send("projects-get-all")) as Project[];
    if (projectsResponse instanceof Error) throw projectsResponse;
    projects.value = projectsResponse;
    if (projects.value.length === 0) {
      router.replace("/");
      return;
    }
    console.log("we have projects; read local storage and open most recent");
    // else, read localStorage for last opened project
    // if last opened project, open that project
    // otherwise, open most recent
    // route to /project/:id
  } catch (error: any | Error) {
    console.error(error);
    fetchErrorMessage.value = error?.message;
    isFetchErrorActive.value = true;
    await send("dialog-fetch-error");
  } finally {
    isLoading.value = false;
  }
});
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
