<script setup lang="ts">
import type { Project, Type } from "interfaces";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { send, receive } from "./api";
import TheSidebar from "./components/the-sidebar.vue";
import ProjectForm from "./components/project-form.vue";

const isLoading = ref<boolean>(true);
const isFetchErrorActive = ref<boolean>(false);
const fetchErrorMessage = ref<string>("");

const types = ref<Type[]>([]);
const projects = ref<Project[]>([]);

// later, this could be moved into an object of type Column that could have:
// { isOpen: false, dockedOn: 'left' | 'right', width: 300 // in pixels }
// this object could be stored in localStorage
const isProjectColumnActive = ref<boolean>(false);

const router = useRouter();

function openProjectColumn(): void {
  // Check local storage to see what the default location and size of the column is
  // if there is data, open at that last location
  // otherwise, open in default location
  //
  // TODO
  // - style the div
  // - can be closed then re-opened from
  // - put the form inside
  // - can submit form data
  isProjectColumnActive.value = true;
}

function closeProjectColumn(): void {
  isProjectColumnActive.value = false;
  // in the future,
  // also store its size and location data
  // to localStorage, so we can re-open it in the same place
}

function showCriticalError(message = "No error message received") {
  isFetchErrorActive.value = true;
  fetchErrorMessage.value = message;
}

receive("reload-database", () => {
  console.log("RELOAD DATABASE");
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
    console.log(
      "we have projects; read local storage to see which was most recently opened"
    );
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

    <!-- As there is only the Projects column for now, only making that work -->
    <section
      v-if="isProjectColumnActive"
      class="bg-gray-200 h-full min-w-[150px]"
    >
      <div class="flex bg-gray-300 justify-between px-2">
        <h1 class="text-sm font-sans">Project - Create</h1>
        <button @click="closeProjectColumn">X</button>
      </div>
      <div class="flex flex-col">
        <!-- TODO: 
        Project Form will also need to have the currently active project
        passed in. However, this is out of scope until Editing is a thing-->
        <!-- Once the project form has been submitted, call the submit event
        and re-fetch allProjects to get the latest data -->
        <!-- 
          TODO: notifications:
          If the submit event is successful, display the Success notification
        if it fails, show the failure notification: these tests would occur at app.vue
        NOTE: notifications will most likely live with teleport so that it's always on-top
        -->
        <project-form />
      </div>
    </section>

    <section class="flex-grow">
      <main class="flex flex-col h-full p-4">
        <router-view v-slot="{ Component, route }" :is-loading="isLoading">
          <component
            :is="Component"
            :key="route.path"
            @open-project-form="openProjectColumn"
            @critical-error-occurred="showCriticalError"
          />
        </router-view>
      </main>
    </section>
  </div>
</template>
