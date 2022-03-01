<script setup lang="ts">
import BaseButton from "../components/base-button.vue";

interface Props {
  isLoading: boolean;
}

const { isLoading } = defineProps<Props>();
</script>

<template>
  <div class="flex w-full h-full self-center place-content-center">
    <!-- <svg
      role="status"
      class="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-300 fill-primary"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg> -->

    <section
      class="bg-white py-8 px-12 rounded-xl w-full h-fit sm:w-full lg:w-5/6 max-w-[850px]"
    >
      <div v-if="isLoading" class="flex flex-col gap-4 h-full">
        <div class="h-8 w-3/5 rounded-xl bg-gray-200 animate-pulse" />
        <div class="bg-gray-200 w-10/12 animate-pulse h-10 rounded-xl" />
        <div class="bg-gray-200 w-9/12 animate-pulse h-12 rounded-xl" />
        <div class="bg-gray-200 w-11/12 animate-pulse h-24 rounded-xl" />
        <div class="bg-gray-200 w-9/12 animate-pulse h-12 rounded-xl" />
      </div>
      <div v-else>
        <h1 class="mb-10">Welcome to Vislit!</h1>
        <h2>Import previous Vislit Data</h2>
        <p class="my-3">
          Have previously exported data? Import now by clicking below, or later
          from
          <span class="font-bold whitespace-nowrap"
            >File -> Import Vislit Data</span
          >.
        </p>
        <base-button>Import Vislit Data</base-button>

        <h2 class="mt-12">Choose a save location for your Vislit Data</h2>
        <p class="my-3">
          By default, Vislit stores your data in: DYNAMIC LOCATION FROM BACKEND.
          If you would prefer to store data in another location or in a cloud
          sync folder (like in Google Drive, OneDrive, or DropBox), select that
          now or later by going to
          <span class="font-bold whitespace-nowrap"
            >File -> Change Save Location</span
          >.
        </p>
        <base-button>Change Save Location</base-button>

        <h2 class="mt-12">Create a Project</h2>
        <p class="my-3">
          To get started writing, setting goals, and tracking progress, create a
          project.
        </p>
        <!-- look into using var() with tailwind -->
        <base-button :background-color="'#3772ff'" :text-color="'white'"
          >Create a Project</base-button
        >
      </div>
    </section>
  </div>
</template>

<!-- Note: welcome page and summary page should share same loading card component because they're very similar -->
