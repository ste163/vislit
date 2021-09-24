<template>
  <div class="input-container">
    <label
      :for="name"
      class="label"
      :class="meta.dirty ? 'label-active' : ''"
      >{{ label }}</label
    >
    <p class="input-error" v-show="errorMessage">{{ errorMessage }}</p>
    <input
      class="input"
      :name="name"
      :id="name"
      :type="type"
      :value="inputValue"
      @input="handleChange"
      @blur="handleBlur"
    />
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
  margin: 1em 0;
}

.label {
  position: absolute;
  font-size: 0.9em;
  font-weight: 500;
  top: 0.2em;
  left: 0.4em;
  transition: all 0.1s ease-in-out;
}

.label-active {
  top: -1.5em;
  color: var(--primary);
}

.input {
}

.input-error {
  position: absolute;
  top: -1.5em;
  left: 0.3em;
  font-size: 0.9em;
  font-weight: 500;
  color: var(--warning);
}
</style>
