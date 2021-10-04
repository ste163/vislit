<script setup lang="ts">
import { inject, ref, computed } from "vue";
import type { IColumn } from "interfaces";
import BaseButtonToggle from "./BaseButtonToggle.vue";
import type IStore from "../store/interfaces/IStore";
import useIsSidebarDisabled from "../composables/useIsSidebarDisabled";

const store = inject("store") as IStore;

const isDisabled = useIsSidebarDisabled();
const columnTitle = ref<HTMLElement>();
const column = ref<IColumn | undefined>();

const isColumnActive = computed(() =>
  column.value !== undefined ? column.value.isActive : false,
);

function toggleColumnActive(): void {
	const header = columnTitle.value?.textContent?.trim();

	if (header !== undefined) {
		column.value = store.application.state.columns.find(
			(column) => column.header === header,
		);

		if (column.value !== undefined) {
			column.value.isActive = !column.value.isActive;
		}
	}
}
</script>

<template>
  <base-button-toggle
    :is-active="isColumnActive"
    :active-effect-color="'var(--lightGray)'"
    active-text-color="'var(--black)'"
    :is-disabled="isDisabled"
    @click="toggleColumnActive"
  >
    <template #btn-icon>
      <slot name="icon" />
    </template>
    <div ref="columnTitle">
      <slot />
    </div>
  </base-button-toggle>
</template>
