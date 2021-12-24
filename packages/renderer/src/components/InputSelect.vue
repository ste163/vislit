<script setup lang="ts">
import { useField } from "vee-validate";
import type { PropType } from "vue";
import { computed } from "vue";

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

// computed that takes the selectedValue's id and displays correct type name
const selectedDisplayText = computed(() => {
  const item = props.values.find((val) => val.id === selectedValue.value);
  return item?.value;
});

const {
  value: selectedValue,
  meta,
  errorMessage,
  handleChange,
} = useField(props.name, undefined, {
  initialValue: "",
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
    <div :id="name" :name="name" :value="selectedValue" class="capitalize">
      {{ selectedDisplayText }}
    </div>
    <div>Chevron</div>
    <!-- v-if isOpened, show list -->
    <div>
      <option
        v-for="value in values"
        :key="value?.id"
        class="capitalize"
        :name="name"
        :value="value.id"
        @click="handleChange"
      >
        {{ value?.value }}
      </option>
    </div>
  </div>
</template>
