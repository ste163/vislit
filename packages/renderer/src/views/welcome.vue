<script setup lang="ts">
import { computed } from "vue";
import { onMounted, ref } from "vue";
import { send } from "api";
import BaseButton from "components/base-button.vue";
import PulseNotification from "components/pulse-notification.vue";
import IconProject from "icons/icon-project.vue";

interface Props {
  isLoading: boolean;
}

const { isLoading } = defineProps<Props>();
// NOTE: If these events are going to be used in multiple pages, move to CONSTs or an EVENTS enum
const emit = defineEmits(["openProjectForm", "criticalErrorOccurred"]);

const defaultDataPath = ref<string>("");
const isLoadingDefaultDataPath = ref<boolean>(true);

const isLoadingComplete = computed(
  () => isLoadingDefaultDataPath.value && isLoading
);

function onCreateProjectClick(): void {
  emit("openProjectForm");
}

// Do not need to worry if these events fail as any failure is handled on the api side
async function onImportClick(): Promise<void> {
  await send("dialog-data-link-non-taskbar");
}

async function onSaveChangeClick(): Promise<void> {
  await send("dialog-change-save-location");
}

onMounted(async () => {
  const path = (await send("data-path-get")) as string;
  if (path) {
    defaultDataPath.value = path;
    isLoadingDefaultDataPath.value = false;
  } else {
    emit(
      "criticalErrorOccurred",
      "Failed to load default data storage location."
    );
  }
});
</script>

<template>
  <div class="flex w-full h-full self-center place-content-center">
    <section
      class="bg-white py-8 px-12 rounded-xl w-full h-fit sm:w-full lg:w-5/6 max-w-[850px]"
    >
      <!-- Loading screen -->
      <div
        v-if="isLoadingComplete"
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
          <span data-testid="data-path"> {{ defaultDataPath }}</span
          >. If you would prefer to store data in another location or in a cloud
          sync folder (like in Google Drive, OneDrive, or DropBox), select that
          now or later by going to
          <span class="font-bold whitespace-nowrap">
            File -> Change Save Location</span
          >.
        </p>
        <base-button @click="onSaveChangeClick">
          Change Save Location
        </base-button>

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
