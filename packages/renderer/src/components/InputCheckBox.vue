<script setup lang="ts">
import { useField } from "vee-validate";

const props = defineProps({
  value: {
    type: Boolean,
    required: true,
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

const { meta, checked, handleChange } = useField(props.name, undefined, {
  type: "checkbox",
  checkedValue: true,
  uncheckedValue: false,
});
</script>

<template>
  <div>
    <label
      :for="name"
      class="label"
      :class="meta.dirty ? 'label-active' : ''"
      >{{ label }}</label
    >
    <button type="button" @click="handleChange(value ? false : true)">
      {{ checked ? "X" : "Not Checked" }}
    </button>
  </div>
</template>
