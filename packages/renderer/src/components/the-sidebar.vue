<script setup lang="ts">
import { useRouter } from "vue-router";
import IconSummary from "icons/icon-summary.vue";
import IconWriter from "icons/icon-writer.vue";
import IconProgress from "icons/icon-progress.vue";
import IconVisualization from "icons/icon-visualization.vue";
import IconProject from "icons/icon-project.vue";
import IconNote from "icons/icon-note.vue";

interface Props {
  isDisabled: boolean;
  isLoading: boolean;
}

const { isDisabled, isLoading } = defineProps<Props>();

const router = useRouter();
</script>
<template>
  <!-- TODO:
    Add ability to close sidebar
 -->
  <nav class="nav">
    <div
      v-if="isLoading"
      data-testId="loading-sidebar"
      class="flex flex-col gap-2 px-3 mt-2"
    >
      <div class="bg-gray-200 w-6/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-6/12 animate-pulse h-5 rounded-xl mt-8" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
      <div class="bg-gray-200 w-9/12 animate-pulse h-5 rounded-xl" />
    </div>
    <div v-else>
      <div>
        <h2 :class="isDisabled && 'text-gray-300'" class="header mt-2">
          Views
        </h2>
        <ul>
          <li>
            <button
              class="button"
              :disabled="isDisabled"
              @click="() => router.replace('/project')"
            >
              <icon-summary class="button-icon" />
              <span class="button-text">Summary</span>
            </button>
          </li>
          <li>
            <button
              class="button"
              :disabled="isDisabled"
              @click="() => router.replace('/writer')"
            >
              <icon-writer class="button-icon" />
              <span class="button-text">Writer</span>
            </button>
          </li>
          <li>
            <button
              class="button"
              :disabled="isDisabled"
              @click="() => router.replace('/progress')"
            >
              <icon-progress class="button-icon" />
              <span class="button-text">Progress</span>
            </button>
          </li>
          <li>
            <button
              class="button"
              :disabled="isDisabled"
              @click="() => router.replace('/visualizations')"
            >
              <icon-visualization class="button-icon" />
              <span class="button-text">Visualizations</span>
            </button>
          </li>
        </ul>
      </div>

      <div>
        <h2 :class="isDisabled && 'text-gray-300'" class="header mt-8">
          Columns
        </h2>
        <ul>
          <li>
            <button class="button" :disabled="isDisabled">
              <icon-project class="button-icon" />
              <span class="button-text">Projects</span>
            </button>
          </li>
          <li>
            <button class="button" :disabled="isDisabled">
              <icon-note class="button-icon" />
              <span class="button-text">Notes</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  @apply bg-white w-[135px] flex flex-col select-none;
}

.header {
  @apply text-xs px-3;
}

.button {
  @apply flex disabled:text-gray-300 disabled:fill-gray-300 px-3 my-3;
}

.button-text {
  @apply text-sm font-bold ml-2;
}

.button-icon {
  @apply h-[0.9rem] w-[0.9rem];
}
</style>
