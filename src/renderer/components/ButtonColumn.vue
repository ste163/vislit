<template>
  <base-button-toggle
    @click="toggleColumnActive"
    :isActive="isColumnActive"
    :activeEffectColor="'var(--lightGray)'"
    activeTextColor="'var(--black)'"
    :isDisabled="isButtonDisabled"
  >
    <template v-slot:btn-icon>
      <slot name="icon"> </slot>
    </template>
    <div ref="columnTitle">
      <slot></slot>
    </div>
  </base-button-toggle>
</template>

<script setup lang="ts">
import { inject, ref, computed } from "vue";
import BaseButtonToggle from "./BaseButtonToggle.vue";
import IStore from "../store/interfaces/IStore";
import IColumn from "@/interfaces/IColumn";
import { useRoute } from "vue-router";

const store = inject("store") as IStore;
const route = useRoute();

const columnTitle = ref<HTMLElement>();
const column = ref<IColumn | undefined>();

const isColumnActive = computed(() =>
  column.value !== undefined ? column.value.isActive : false
);

const isButtonDisabled = computed(() =>
  route.name === "Welcome" ? true : false
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
