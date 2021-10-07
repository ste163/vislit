<script setup lang="ts">
import BaseTemplateModalDelete from './BaseTemplateModalDelete.vue';

// eslint-disable-next-line no-undef
const props = defineProps({
	isModalActive: {
		type: Boolean,
		default: false,
		required: true,
	},
});


function archiveProject(): void {
	console.log("ARCHIVE IT!");
}

function deleteProject(): void {
	console.log("DELETE IT");
}
</script>

<template>
  <base-template-modal-delete
    :is-modal-active="isModalActive"
    :has-archive-button="true"
    @handle-archive-click="archiveProject"
    @handle-delete-click="deleteProject"
  >
    Deleting this project will irrecoverably delete all progress, goals, notes, and writing.
    If you think you may want to reference this project in the future, it is highly recommended to archive this project instead.
  </base-template-modal-delete>
</template>