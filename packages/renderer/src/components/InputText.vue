<template>
  <div
    class="input-container"
    :class="{ error: !!errorMessage, success: meta.valid && meta.dirty }"
  >
    <label
      :for="name"
      class="label"
      :class="meta.dirty ? 'label-active' : ''"
    >{{ label }}</label>
    <p
      v-show="errorMessage"
      class="input-error"
    >
      {{ errorMessage }}
    </p>
    <input
      :id="name"
      class="input"
      :name="name"
      :type="type"
      :value="inputValue"
      @input="handleChange"
      @blur="handleBlur"
    >
  </div>
</template>

<script setup lang="ts">
import { useField } from "vee-validate";

// eslint-disable-next-line no-undef
const props = defineProps({
	type: {
		type: String,
		default: "text",
	},
	value: {
		type: String,
		default: "",
	},
	name: {
		type: String,
		required: true,
	},
	label: {
		type: String,
		required: true,
	},
	backgroundColor: {
		type: String,
		default: "var(--white)",
	},
});

const {
	value: inputValue,
	meta,
	errorMessage,
	handleBlur,
	handleChange,
} = useField(props.name, undefined, {
	initialValue: props.value,
});
</script>

<style scoped>
.input-container {
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  height: 3em;
  margin: 0.5em 0;
}

.input {
  background-color: v-bind(backgroundColor);
}

.input-container.error input {
  background-color: var(--warning-transparent);
  border-color: var(--warning);
}

.input-container.error .label {
  color: var(--warning);
}

.input-container.success input {
  background-color: var(--success-transparent);
  border-color: var(--success);
}

.input-container.success .label {
  color: var(--success-dark);
}

.label {
  position: absolute;
  font-size: 0.9em;
  font-weight: 600;
  top: 0.4em;
  left: 0.5em;
  transition: all 0.1s ease-in-out;
}

.label-active {
  top: -1.5em;
  color: var(--primary);
}

.input-error {
  position: absolute;
  top: -1.5em;
  left: 0.5em;
  font-size: 0.9em;
  font-weight: 600;
  color: var(--warning);
}
</style>
