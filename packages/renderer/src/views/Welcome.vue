<script setup lang="ts">
import { inject, onMounted, ref } from "vue";
import BaseTemplateCard from "../components/base-template-card.vue";
import BaseCardContent from "../components/base-card-content.vue";
import BaseButtonClick from "../components/base-button-click.vue";
import FormProjectCreateModal from "../components/form-project-create-modal.vue";
import NotificationDot from "../components/notification-dot.vue";
import type { Store } from "../store";

const store = inject("store") as Store;
const isModalActive = ref<boolean>(false);

function openWindow(): void {
  console.log("Open window in main process");
}

// Needed to ensure that if the user deletes all projects
// The activeProject will be reset at the correct point in time
onMounted(() => {
  store.projects.setActiveProject(null);
});
</script>

<template>
  <base-template-card>
    <template #header> Welcome to Vislit! </template>

    <base-card-content>
      <template #header> Import previous Vislit Data </template>
      If you've already used Vislit, you can import your data by clicking the
      button below, or from File -> Import Vislit Data.

      <template #buttons>
        <base-button-click
          :background-color="'var(--lightGray)'"
          @click="openWindow"
        >
          Import Vislit Data
        </base-button-click>
      </template>
    </base-card-content>

    <base-card-content>
      <template #header> Choose save location for Vislit Data </template>
      By default, Vislit stores your data in your Documents folder. If you would
      prefer to store data in a Google Drive, OneDrive, DropBox, or other cloud
      provider's folder, you may select that new or later by going to File ->
      Change Save Location.

      <template #buttons>
        <base-button-click
          :background-color="'var(--lightGray)'"
          @click="openWindow"
        >
          Change Save Location
        </base-button-click>
      </template>
    </base-card-content>

    <base-card-content>
      <template #notification-dot>
        <notification-dot
          :dot-color="'var(--primary)'"
          :pulse-color="'var(--primary-pulse)'"
        />
      </template>

      <template #header> Create a Project </template>
      To get started writing and tracking your progress, create a project.

      <template #buttons>
        <base-button-click
          :background-color="'var(--primary)'"
          :text-color="'var(--white)'"
          @click="isModalActive = !isModalActive"
        >
          Create a Project
        </base-button-click>
      </template>
    </base-card-content>
  </base-template-card>

  <form-project-create-modal
    :is-form-modal-active="isModalActive"
    @close-modal="isModalActive = false"
  />
</template>
