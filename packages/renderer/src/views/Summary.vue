<template>
  <!-- TODO:
- summary card template
- rename base card to BaseTemplateCard
-->
  <base-card>
    <template #header>
      {{ store.projects.state.active?.title }}
    </template>

    <base-card-content>
      <template #notification-dot>
        <notification-dot
          :dot-color="'var(--notification)'"
          :pulse-color="'var(--notification-pulse)'"
        />
      </template>

      <template #header>
        Goal
      </template>
      Create a goal to begin tracking progress.

      <template #buttons>
        <base-button-click
          :background-color="'var(--notification)'"
          @click="isModalActive = !isModalActive"
        >
          Create Goal
        </base-button-click>
      </template>
    </base-card-content>

    <base-card-content>
      <template #header>
        Start writing
      </template>
      Start writing in the Document Writer to see the last couple paragraphs
      written.

      <template #buttons>
        <base-button-click
          :background-color="'var(--lightGray)'"
          @click="openWindow"
        >
          Open Document Writer
        </base-button-click>

        <base-button-click
          :background-color="'var(--lightGray)'"
          class="button-spacing"
          @click="openWindow"
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
import type IStore from "../store/interfaces/IStore";

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
