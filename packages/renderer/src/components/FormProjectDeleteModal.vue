<script setup lang="ts">
import { inject } from 'vue';
import type IStore from '../store/interfaces/IStore';
import BaseTemplateModalDelete from './BaseTemplateModalDelete.vue';

const store = inject("store") as IStore;
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
	if (store.projects.state.active !== null) {
		const response = store.projects.deleteProject(store.projects.state.active.id);

		if (response !== undefined) {
			// Route to latest project OR, if there are none, route to Welcome
		}
	} else {
		console.error("Active project is null, cannot delete");
	}
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