<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
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
import InputSelect from "components/input-select.vue";
import InputSearch from "components/input-search.vue";
import IconClose from "icons/icon-close.vue";
import IconBack from "icons/icon-back.vue";

const isLoading = ref<boolean>(true);
const isFetchErrorActive = ref<boolean>(false);
const fetchErrorMessage = ref<string>("");
const isDeleteModalActive = ref<boolean>(false);
const projectIdToDelete = ref<string | null>(null);

const types = ref<Type[]>([]); // if this used an {typeId: {type}} could initialize to null
const projects = ref<Project[]>([]); // if this used an {projectId: {project}} could initialize to null
const notificationItems = ref<NotificationItem[]>([]);

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

function toggleDeleteModal(): void {
  isDeleteModalActive.value = !isDeleteModalActive.value;
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

// maybe rename?? - not specific that it's handling the column list delete click
function handleProjectDelete(id: string): void {
  toggleDeleteModal();
  projectIdToDelete.value = id;
}

// potentially rename?
async function deleteProject(): Promise<void> {
  try {
    // set isDeleting to true
    const result = await send("projects-delete", projectIdToDelete.value);
    if (result instanceof Error) throw result;
    toggleDeleteModal();
    // If we were using an object, could just delete the key, much faster
    projects.value = projects.value.filter(
      ({ id }) => id !== projectIdToDelete.value
    );
    projectIdToDelete.value = null;
    selectedProject.value = projects.value.length ? projects.value[0] : null;
  } catch (error: any | Error) {
    // show error banner
    console.error(error);
  } finally {
    // set isDeleting to false
  }
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

watch(projects, () => {
  // if we all projects have been deleted, reset state
  if (projects.value.length) return;
  router.replace("/");
  isProjectColumnActive.value = false;
  activeProjectColumn.value = ACTIVE_PROJECT_COLUMN_STATES.Form;
  // TODO: note column disabled
  // - update local storage?
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

  <!-- TODO: need to restructure/change css so that the side-bar is is more 'static' -->
  <div v-else class="h-full w-full flex">
    <!-- NOTE: handling the delete modal here until more modals come, then think about abstraction -->
    <!-- But may need to move to component so testing is easy -->
    <teleport v-if="isDeleteModalActive" to="#modal-container">
      <!-- TODO: if a modal is open, pressing ESC should close it -->
      <section
        class="z-10 modal-background absolute justify-center place-items-center flex w-full h-full"
      >
        <div class="bg-white place-items-center flex flex-col rounded-md p-2">
          <!-- Header -->
          <div class="self-end">
            <button @click="toggleDeleteModal">
              <div class="scale-50">
                <icon-close :variant="'dark'" />
              </div>
            </button>
          </div>
          <!-- Content -> should determine modal width and height -->
          <div role="dialog" class="max-w-lg px-4 mb-2">
            <h1 class="mb-1">Warning</h1>
            <p>
              Deleting this project will delete all related notes, progress,
              goals, and documents. Archiving is a safer option as you can keep
              organized and have backups.
            </p>
            <!-- Note: maybe have metrics of: will delete: X documents, X notes, X progress, etc -->
            <div class="flex w-full justify-between mt-3">
              <!-- TODO: 
                Need to make button-text that also has submitting abilities.
                Maybe submit is actually in base-button as many type scan use that -->
              <div class="flex">
                <button class="mr-3 font-semibold">Archive</button>
                <button class="font-semibold" @click="deleteProject">
                  Delete
                </button>
              </div>
              <button class="font-semibold" @click="toggleDeleteModal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>
    </teleport>

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
        <h1 class="text-xs font-sans tracking-widest w-3/4 truncate">
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
          <div class="m-5">
            <base-button
              @click="setActiveProjectColumn(ACTIVE_PROJECT_COLUMN_STATES.Form)"
            >
              <template #icon>
                <!-- TODO: Convert to icon -->
                +
              </template>
              Create Project</base-button
            >
            <input-select
              class="mt-4"
              name="sort"
              label="Sort by"
              :empty-default="false"
              :can-validation-affects-styling="false"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="lastUpdated">Last Updated Date</option>
              <option value="dateCreated">Date Created</option>
            </input-select>

            <input-search />
          </div>
          <!-- TODO: pass the sort by and search values into here -->
          <the-project-list
            :projects="projects"
            :selected-project-id="selectedProject?.id"
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

<style>
.modal-background {
  background-color: rgba(0, 0, 0, 0.123);
}
</style>
