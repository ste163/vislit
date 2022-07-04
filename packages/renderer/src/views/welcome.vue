<script setup lang="ts">
import { computed } from "vue";
import { onMounted, ref } from "vue";
import { send } from "../api";
import BaseButton from "../components/base-button.vue";
import IconProject from "../icons/icon-project.vue";
import PulseNotification from "../components/pulse-notification.vue";

interface Props {
  isLoading: boolean;
}

const { isLoading } = defineProps<Props>();
const emit = defineEmits(["openProjectForm"]);

const defaultDataPath = ref<string>("");

const displayedPath = computed(() =>
  defaultDataPath.value === ""
    ? "Error loading default data path"
    : defaultDataPath.value
);

function onCreateProjectClick(): void {
  emit("openProjectForm");
}

async function onImportClick(): Promise<void> {
  await send("dialog-data-link-non-taskbar");
}

async function onSaveChangeClick(): Promise<void> {
  await send("dialog-change-save-location");
}

onMounted(async () => {
  const path = (await send("data-path-get")) as string;
  if (path) defaultDataPath.value = path;
});
</script>

<template>
  <!-- Note: welcome page and summary page should share same loading card component because they're very similar -->
  <div class="flex w-full h-full self-center place-content-center">
    <section
      class="bg-white py-8 px-12 rounded-xl w-full h-fit sm:w-full lg:w-5/6 max-w-[850px]"
    >
      <!-- Loading screen -->
      <!-- Move this loading into a component later -->
      <div
        v-if="isLoading"
        class="flex flex-col gap-4 h-full"
        data-testid="loading-welcome"
      >
        <div class="h-8 w-3/5 rounded-xl bg-gray-200 animate-pulse" />
        <div class="bg-gray-200 w-10/12 animate-pulse h-10 rounded-xl" />
        <div class="bg-gray-200 w-9/12 animate-pulse h-12 rounded-xl" />
        <div class="bg-gray-200 w-11/12 animate-pulse h-24 rounded-xl" />
        <div class="bg-gray-200 w-9/12 animate-pulse h-12 rounded-xl" />
      </div>
      <div v-else>
        <!-- TODO: update wording for import/link + dialogs -->
        <h1 class="mb-7">Welcome to Vislit!</h1>
        <h2>Link to previous Vislit Data</h2>
        <p class="my-3">
          Have previously exported data? Link Vislit to that data by clicking
          below, or later from
          <span class="font-bold whitespace-nowrap"
            >File -> Link to Vislit Data</span
          >.
        </p>
        <base-button @click="onImportClick">Link Vislit Data</base-button>

        <h2 class="mt-12">Choose a save location for your Vislit Data</h2>
        <p class="my-3">
          By default, Vislit stores your data in:
          <span data-testid="data-path"> {{ displayedPath }}</span
          >. If you would prefer to store data in another location or in a cloud
          sync folder (like in Google Drive, OneDrive, or DropBox), select that
          now or later by going to
          <span class="font-bold whitespace-nowrap"
            >File -> Change Save Location</span
          >.
        </p>
        <base-button @click="onSaveChangeClick"
          >Change Save Location</base-button
        >

        <div class="mt-12 flex items-center relative">
          <pulse-notification
            class="absolute left-[-25px]"
            :color="'#3772ff'"
          />
          <h2>Create a Project</h2>
        </div>

        <p class="my-3">
          To get started writing, setting goals, and tracking progress, create a
          project.
        </p>
        <base-button :variant="'primary'" @click="onCreateProjectClick">
          <template #icon>
            <icon-project class="h-3 w-3 fill-white" />
          </template>
          Create a Project
        </base-button>
      </div>
    </section>
  </div>
</template>
