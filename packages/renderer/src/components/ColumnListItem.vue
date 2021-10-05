<script setup lang="ts">
import { inject } from "vue";
import type { PropType } from "vue";
import type { IProject } from "interfaces";
import type IStore from "../store/interfaces/IStore";

const store = inject("store") as IStore;

// eslint-disable-next-line no-undef
const props = defineProps({
	// eslint-disable-next-line vue/require-default-prop
	project: {
		type: Object as PropType<IProject>,
		required: true,
	},
});
</script>

<template>
  <button
    class="column-list-item"
    :class="{'column-list-item-active': store.projects.state.active?.id === props.project?.id}"
  >
    {{ project.title }}
  </button>
</template>

<style scoped>
.column-list-item {
  font-weight: 700;
  letter-spacing: var(--letterSpacingSmaller);
  margin: 0.25em 0;
    text-align: left;
}

.column-list-item-active {
  background-color: var(--primary);
  color: var(--white);
}
</style>