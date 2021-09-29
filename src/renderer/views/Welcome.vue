<template>
  <base-card>
    <template v-slot:header> Welcome to Vislit! </template>

    <base-card-content>
      <template v-slot:header> Import previous Vislit Data </template>
      If you've already used Vislit, you can import your data by clicking the
      button below, or from File -> Import Vislit Data.

      <template v-slot:buttons>
        <base-button-click
          @click="openWindow"
          :background-color="'var(--lightGray)'"
        >
          Import Vislit Data
        </base-button-click>
      </template>
    </base-card-content>

    <base-card-content>
      <template v-slot:header> Choose save location for Vislit Data </template>
      By default, Vislit stores your data in your Documents folder. If you would
      prefer to store data in a Google Drive, OneDrive, DropBox, or other cloud
      provider's folder, you may select that new or later by going to File ->
      Change Save Location.

      <template v-slot:buttons>
        <base-button-click
          @click="openWindow"
          :background-color="'var(--lightGray)'"
        >
          Change Save Location
        </base-button-click>
      </template>
    </base-card-content>

    <base-card-content>
      <template v-slot:notification-dot>
        <notification-dot :dot-color="'var(--primary)'"
      /></template>

      <template v-slot:header> Create a Project </template>
      To get started writing and tracking your progress, create a project.

      <template v-slot:buttons>
        <base-button-click
          @click="isModalActive = !isModalActive"
          :background-color="'var(--primary)'"
          :text-color="'var(--white)'"
        >
          Create a Project
        </base-button-click>
      </template>
    </base-card-content>
  </base-card>

  <form-project-create-modal
    :is-form-modal-active="isModalActive"
    @close-modal="isModalActive = false"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import BaseCard from "../components/BaseCard.vue";
import BaseCardContent from "../components/BaseCardContent.vue";
import BaseButtonClick from "../components/BaseButtonClick.vue";
import FormProjectCreateModal from "../components/FormProjectCreateModal.vue";
import NotificationDot from "../components/NotificationDot.vue";

const isModalActive = ref<boolean>(false);

function openWindow(): void {
  console.log("Open window in main process");
}
</script>
