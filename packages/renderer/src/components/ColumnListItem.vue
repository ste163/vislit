<script setup lang="ts">
import { inject, ref, watch } from "vue";
import type { PropType } from "vue";
import type { IProject } from "interfaces";
import type IStore from "../store/interfaces/IStore";
import BaseButtonToggle from "./BaseButtonToggle.vue";

const store = inject("store") as IStore;

// Prop for section? with a type that contains the strings: "inProgress", "Archived", "Completed"
// then decide colors based on that

// eslint-disable-next-line no-undef
const props = defineProps({
  project: {
    type: Object as PropType<IProject>,
    required: true,
  },
});

const isActive = ref<boolean>(
  store.projects.state.active?.id === props.project?.id
);

function setActive(): void {
  isActive.value = store.projects.state.active?.id === props.project?.id;
}

watch(() => store.projects.state.active?.id, setActive);
</script>

<!-- The baseButtonToggle doesn't work correctly.
Animation becomes jerky & doesn't work on the right side because 
it's based on the left absolute position -->
<template>
  <BaseButtonToggle
    :is-active="isActive"
    :is-disabled="false"
    class="column-list-item"
  >
    {{ project.title }}
  </BaseButtonToggle>
</template>

<style scoped>
.column-list-item {
  font-weight: 700;
  letter-spacing: var(--letterSpacingSmaller);
  margin: 0.25em 0;
  text-align: left;
  border-radius: 0;
}
</style>
