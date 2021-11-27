<script setup lang="ts">
import { computed, ref } from "vue";
import type { PropType } from "vue";
import type { IProject } from "interfaces";

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
    backgroundColor.value = "var(--primary)";
    textColor.value = "var(--white)";
    return "IN PROGRESS";
  } else if (props.project.completed === true) {
    backgroundColor.value = "var(--success)";
    textColor.value = "var(--white)";
    return "COMPLETED";
  }
  // Or it's not in-progress but it's been archived
  backgroundColor.value = "var(--lightGray)";
  textColor.value = "var(--black)";
  return "RETIRED";
}

const statusTagText = computed(() => setStatusTagText());
</script>

<template>
  <div v-if="props.project.archived" class="container container-archived">
    ARCHIVED
  </div>

  <div class="container">
    {{ statusTagText }}
  </div>
</template>

<style scoped>
.container {
  font-size: 0.8em;
  font-weight: 900;
  width: max-content;
  padding: 0.1em 0.35em;
  padding-top: 0.2em;
  border-radius: 3px;
  margin-right: 0.85em;

  color: v-bind(textColor);
  background-color: v-bind(backgroundColor);
}

.container-archived {
  color: var(--black);
  background-color: var(--lightGray);
}
</style>
