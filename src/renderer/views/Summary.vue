<template>
  <!-- TODO:
- summary card template
- rename base card to BaseTemplateCard
-->
  <base-card>
    <template v-slot:header>
      {{ store.projects.state.active?.title }}
    </template>

    <base-card-content>
      <template v-slot:notification-dot>
        <notification-dot
          :dot-color="'var(--notification)'"
          :pulse-color="'var(--notification-pulse)'"
      /></template>

      <template v-slot:header> Goal </template>
      Create a goal to begin tracking progress.

      <template v-slot:buttons>
        <base-button-click
          @click="isModalActive = !isModalActive"
          :background-color="'var(--notification)'"
        >
          Create Goal
        </base-button-click>
      </template>
    </base-card-content>

    <base-card-content>
      <template v-slot:header> Start writing </template>
      Start writing in the Document Writer to see the last couple paragraphs
      written.

      <template v-slot:buttons>
        <base-button-click
          @click="openWindow"
          :background-color="'var(--lightGray)'"
        >
          Open Document Writer
        </base-button-click>

        <base-button-click
          @click="openWindow"
          :background-color="'var(--lightGray)'"
          class="button-spacing"
        >
          Open Notes
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
import { ref, inject } from "vue";
import BaseCard from "../components/BaseCard.vue";
import BaseCardContent from "../components/BaseCardContent.vue";
import BaseButtonClick from "../components/BaseButtonClick.vue";
import FormProjectCreateModal from "../components/FormProjectCreateModal.vue";
import NotificationDot from "../components/NotificationDot.vue";
import IStore from "../store/interfaces/IStore";

const store = inject("store") as IStore;

const isModalActive = ref<boolean>(false);

function openWindow(): void {
  console.log("Open window in main process");
}
</script>

<style>
.button-spacing {
  margin-left: 2em;
}
</style>
