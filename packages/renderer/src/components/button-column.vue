<script setup lang="ts">
import { inject, ref, computed } from "vue";
import type { Column } from "interfaces";
import type { Store } from "../store";
import BaseButtonToggle from "./base-button-toggle.vue";
import useIsSidebarDisabled from "../composables/use-is-sidebar-disabled";

const store = inject("store") as Store;

const isDisabled = useIsSidebarDisabled();
const columnTitle = ref<HTMLElement>();
const column = ref<Column | undefined>();

const isColumnActive = computed(() =>
  column.value !== undefined ? column.value.isActive : false
);

function toggleColumnActive(): void {
  const header = columnTitle.value?.textContent?.trim();

  if (header !== undefined) {
    column.value = store.application.state.columns.find(
      (column) => column.header === header
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
