<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { send, receive } from "api";
import { PATHS } from "router";
import { nanoid } from "nanoid/non-secure";
import type { Project, Type } from "interfaces";
import type {
  NotificationItem,
  ProjectFormSubmission,
} from "renderer-interfaces";
import TheSidebar from "components/the-sidebar.vue";
import NotificationContainer from "components/notification-container.vue";
import BaseButton from "components/base-button.vue";
import TheProjectForm from "components/the-project-form.vue";
import TheProjectList from "components/the-project-list.vue";
import IconClose from "icons/icon-close.vue";
import IconBack from "icons/icon-back.vue";

const isLoading = ref<boolean>(true);
const isFetchErrorActive = ref<boolean>(false);
const fetchErrorMessage = ref<string>("");

const notificationItems = ref<NotificationItem[]>([]);

const types = ref<Type[]>([]); // if this used an {typeId: {type}} could initialize to null
const projects = ref<Project[]>([]); // if this used an {projectId: {project}} could initialize to null

const selectedProject = ref<Project | null>(null);
// later, this could be moved into an object of type Column that could have:
// { isOpen: false, dockedOn: 'left' | 'right', width: 300 // in pixels }
// this object could be stored in localStorage
const isProjectColumnActive = ref<boolean>(false);
type ActiveProjectColumn = "form" | "list";
const ACTIVE_PROJECT_COLUMN_STATES = {
  Form: "form",
  List: "list",
} as const;
const activeProjectColumn = ref<ActiveProjectColumn>(
  ACTIVE_PROJECT_COLUMN_STATES.Form
);
const projectColumnHeaderTitle = computed(() =>
  activeProjectColumn.value === ACTIVE_PROJECT_COLUMN_STATES.List &&
  selectedProject.value?.title
    ? selectedProject.value.title
    : null
);

const router = useRouter();

function showCriticalError(message = "No error message received") {
  isFetchErrorActive.value = true;
  fetchErrorMessage.value = message;
}

function toggleProjectColumn(): void {
  // read and store in localStorage, saving and loading the current state
  isProjectColumnActive.value = !isProjectColumnActive.value;
}

function setActiveProjectColumn(type: ActiveProjectColumn) {
  activeProjectColumn.value = type;
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

function handleProjectFormSubmission(response: ProjectFormSubmission): void {
  if (response.errorMessage) {
    addNotificationItem({ type: "error", message: response.errorMessage });
    // because an error occurred, do not update app state.
    return;
  }
  if (response.project) {
    selectedProject.value = response.project;
    router.replace(PATHS.Project);
    // NOTE: for now, adding the created project to the first of list
    // this may become an issue later and we need to refetch latest projects though
    projects.value = [response.project, ...projects.value];
    activeProjectColumn.value = ACTIVE_PROJECT_COLUMN_STATES.List;
  }
  addNotificationItem({ type: "success", message: "Created Project" });
}

function handleProjectDelete(id: string): void {
  console.log("open delete modal to delete project id", id);
}

function handleProjectSelect(projectId: string): void {
  // TODO: move projects to use object notation
  selectedProject.value =
    projects.value.find(({ id }) => id === projectId) || null;
}

// reloading the database is needed when user selects a new .json file;
// renderer needs to reset itself to stay in-sync
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
    if (!projects.value.length) {
      router.replace(PATHS.Home);
      return;
    }
    // TODO:
    // - read localStorage for last opened project
    // set that project as most recent, otherwise go to most recent.
    // - read localStorage for last opened page/view
    // route to that view, otherwise go to projects
    selectedProject.value = projects.value[0];
    activeProjectColumn.value = ACTIVE_PROJECT_COLUMN_STATES.List;
    router.replace(PATHS.Project);
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
  <!-- TODO: this might not be isFetchError but critical error instead. Will no more later -->
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
    <the-sidebar
      :is-disabled="!projects.length"
      :is-loading="isLoading"
      :is-project-column-active="isProjectColumnActive"
      @click-projects-column="toggleProjectColumn"
    />
    <notification-container
      :notification-items="notificationItems"
      @close-item="handleCloseNotificationItem"
    />

    <!-- NOTE: as there is only the Projects column for now, no abstraction -->
    <section
      v-if="isProjectColumnActive"
      class="bg-gray-200 h-full min-w-[275px]"
    >
      <!-- Column Header -->
      <header class="flex bg-gray-300 justify-between px-2 py-1">
        <h1 class="text-xs font-sans tracking-widest">
          Projects
          <span v-if="projectColumnHeaderTitle"
            >- {{ projectColumnHeaderTitle }}</span
          >
        </h1>
        <button @click="toggleProjectColumn">
          <div class="scale-50">
            <icon-close :variant="'dark'" />
          </div>
        </button>
      </header>
      <!-- Column Content -->
      <div class="flex flex-col">
        <div v-if="activeProjectColumn === ACTIVE_PROJECT_COLUMN_STATES.Form">
          <div class="flex my-4 mx-3">
            <button
              class="scale-75 mr-3"
              @click="setActiveProjectColumn(ACTIVE_PROJECT_COLUMN_STATES.List)"
            >
              <icon-back />
            </button>
            <h3>Create</h3>
          </div>
          <the-project-form
            :types="types"
            @project-form-submission="handleProjectFormSubmission"
          />
        </div>
        <div
          v-if="
            projects.length &&
            activeProjectColumn === ACTIVE_PROJECT_COLUMN_STATES.List
          "
        >
          <base-button
            @click="setActiveProjectColumn(ACTIVE_PROJECT_COLUMN_STATES.Form)"
          >
            <template #icon>
              <!-- TODO: Convert to icon -->
              +
            </template>
            Create</base-button
          >
          <the-project-list
            :projects="projects"
            @delete-project="handleProjectDelete"
            @select-project="handleProjectSelect"
          />
        </div>
      </div>
    </section>

    <section class="flex-grow overflow-y-scroll">
      <main class="flex flex-col h-full p-4">
        <router-view
          v-slot="{ Component, route }"
          :is-loading="isLoading"
          :project="selectedProject"
        >
          <component
            :is="Component"
            :key="route.path"
            @open-project-form="toggleProjectColumn"
            @critical-error-occurred="showCriticalError"
          />
        </router-view>
      </main>
    </section>
  </div>
</template>
