<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { send, receive } from "./api";
import { nanoid } from "nanoid/non-secure";
import type { NotificationItem } from "./interfaces";
import type { Project, Type } from "interfaces";
import TheSidebar from "./components/the-sidebar.vue";
import ProjectForm from "./components/project-form.vue";
import NotificationContainer from "./components/notification-container.vue";
import IconClose from "./icons/icon-close.vue";

const isLoading = ref<boolean>(true);
const isFetchErrorActive = ref<boolean>(false);
const fetchErrorMessage = ref<string>("");

const notificationItems = ref<NotificationItem[]>([]);

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

function addNotificationItem({
  type,
  message,
}: Partial<NotificationItem>): void {
  if (type && message)
    notificationItems.value = [
      {
        id: nanoid(8),
        type,
        message,
      },
      ...notificationItems.value,
    ];
}

function handleCloseNotificationItem(id: string): void {
  notificationItems.value = notificationItems.value.filter(
    ({ id: currentId }) => currentId !== id
  );
}

// TODO: Create an interface for what the response should be
function handleProjectFormSubmission(response: any): void {
  console.log("App level, handle form data response:", response);
  // IF there is an errorMessage in the response, display that in the notification
  // And keep the project form at its same state.
  // IF there is no errorMessage AND we have a project
  // Then change the project column to the project list column view
  // route application to this Project's page
  addNotificationItem({ type: "success", message: "Created Project" });
}

receive("reload-database", () => {
  console.log("RELOAD DATABASE");
  // RELOADING is currently from backend with mainWindow.reload
  // this may not work because of clearing localStorage is needed, but appears to work for now
  // TO TEST WHEN WE HAVE MORE DATA:
  // need to clear-out localStorage related to selected projects
  // and reset app-state
  // because you could have ALL new projects
  // so probably re-fresh the page after clearing storage!
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
      <!-- TODO: add this link! -->
      message on GitHub issues (link)
    </p>
    <p>Error message: {{ fetchErrorMessage }}</p>
  </div>

  <div v-else class="h-full w-full flex">
    <!-- TODO: once a project is created, the side-bar is no longer disabled. Ie, the disabled state
    Needs to be based on if they're on the Welcome page or not. -->
    <the-sidebar :is-disabled="true" :is-loading="isLoading" />
    <notification-container
      :notification-items="notificationItems"
      @close-item="handleCloseNotificationItem"
    />

    <!-- As there is only the Projects column for now, no abstraction -->
    <section
      v-if="isProjectColumnActive"
      class="bg-gray-200 h-full min-w-[250px]"
    >
      <!-- Column Header -->
      <div class="flex bg-gray-300 justify-between px-2 py-1">
        <h1 class="text-xs font-sans tracking-widest">Projects</h1>
        <button @click="closeProjectColumn">
          <div class="scale-50">
            <icon-close :variant="'dark'" />
          </div>
        </button>
      </div>
      <!-- Column Content -->
      <div class="flex flex-col">
        <project-form @project-form-submission="handleProjectFormSubmission" />
      </div>
    </section>

    <section class="flex-grow overflow-y-scroll">
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
