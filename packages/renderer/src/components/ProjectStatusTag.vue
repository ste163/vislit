<script setup lang="ts">
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import type { IProject } from 'interfaces';

// eslint-disable-next-line no-undef
const props = defineProps({
	project: {
		type: Object as PropType<IProject>,
		required: true,
	},
});

const textColor = ref<string>("var(--white)");
const backgroundColor = ref<string>("var(--primary)");

function setStatusTagText(): string {
	if (props.project.archived === false && props.project.completed === false) {
		return "IN PROGRESS";
	} else if (props.project.completed === true) {
		backgroundColor.value = 'var(--success)';
		return "COMPLETED";
	} else if (props.project.archived === true) {
		backgroundColor.value = 'var(--lightGray)';
		textColor.value = 'var(--black)';
		return "ARCHIVED";
	}
	return "NO STATUS";
}

const statusTagText = computed(() => setStatusTagText());
</script>

<template>
  <div class="container">
    {{ statusTagText }}
  </div>
</template>

<style scoped>
.container {
	font-size: 0.85em;
	font-weight: 900;
	width: max-content;
	padding: 0 0.35em;
	padding-top: 0.2em;
	border-radius: 3px;
	margin-right: 0.5em;
	
	color: v-bind(textColor);
	background-color: v-bind(backgroundColor);
}
</style>