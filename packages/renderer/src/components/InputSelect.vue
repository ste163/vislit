<script setup lang="ts">
import { useField } from "vee-validate";
import type { PropType } from "vue";

const props = defineProps({
  values: {
    type: Array as PropType<Array<{ id?: string; value: string }>>,
    default: new Array({ id: "", value: "" }),
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  // backgroundColor should be Variant
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
  initialValue: props.values[0]?.value,
});
</script>

<template>
  <div
    class="select-container"
    :class="{ error: !!errorMessage, success: meta.valid && meta.dirty }"
  >
    <label
      :for="name"
      class="label"
      :class="meta.dirty ? 'label-active' : ''"
      >{{ label }}</label
    >
    <span v-show="errorMessage" class="input-error">
      {{ errorMessage }}
    </span>
    <!-- Clicking on this div opens the dropdown -->
    <!-- clicking outside closes it -->
    <div
      :id="name"
      :name="name"
      :value="inputValue"
      class="capitalize"
      @input="handleChange"
      @blur="handleBlur"
    >
      Selected Value
    </div>
    <div>Chevron</div>
    <!-- v-if isOpened, show list -->
    <div>
      <div v-for="value in values" :key="value?.id" class="capitalize">
        {{ value?.value }}
      </div>
    </div>
  </div>
</template>
