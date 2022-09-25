<script setup lang="ts">
import type { Project } from "interfaces";

interface Props {
  project: Project;
  isLoading: boolean;
}

const { isLoading } = defineProps<Props>();
// TODO:
// if the project is a falsey value, onMounted, route to '/'
// the potential bug here is if a user is on this page, and deletes all their projects
// we need to re-route them as a fallback for this page
</script>

<template>
  <div class="flex w-full h-full self-center place-content-center">
    <section
      class="bg-white py-8 px-12 rounded-xl w-full h-fit sm:w-full lg:w-5/6 max-w-[850px]"
    >
      <!-- Loading screen, if re-used another time, abstract it -->
      <div
        v-if="isLoading"
        class="flex flex-col gap-4 h-full"
        data-testid="loading-project"
      >
        <div class="h-8 w-3/5 rounded-xl bg-gray-200 animate-pulse" />
        <div class="bg-gray-200 w-10/12 animate-pulse h-10 rounded-xl" />
        <div class="bg-gray-200 w-9/12 animate-pulse h-12 rounded-xl" />
        <div class="bg-gray-200 w-11/12 animate-pulse h-24 rounded-xl" />
        <div class="bg-gray-200 w-9/12 animate-pulse h-12 rounded-xl" />
      </div>
      <div v-else>
        <h1>SELECTED PROJECT: {{ project.title }}</h1>
      </div>
    </section>
  </div>
</template>
