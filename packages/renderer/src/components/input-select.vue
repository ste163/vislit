<script setup lang="ts">
import { useField } from "vee-validate";
import { watch } from "vue";

// parent component passes slot options in in its map?
type Props = {
  name: string;
  label: string;
  value?: string;
};

const { name, label, value = "" } = defineProps<Props>();

const {
  value: fieldValue,
  meta,
  errorMessage,
  handleChange,
  handleBlur,
} = useField(name, undefined, { initialValue: value });

watch(meta, () => {
  console.log(meta);
});
</script>

<template>
  <div class="flex flex-col">
    <label
      :for="name"
      :value="fieldValue"
      class="font-medium"
      :class="meta.valid ? 'text-primary' : errorMessage && 'text-alert'"
      >{{ label }}</label
    >
    <select
      :name="name"
      class="rounded-md p-1 outline-none focus:border"
      :class="
        meta.valid
          ? 'border border-primary'
          : errorMessage
          ? 'border border-alert'
          : 'border-gray-800'
      "
    >
      <option>
        <!-- Always have a default, empty option -->
      </option>
      <!-- Need to use a scoped slot to make this work -->
      <slot @select="handleChange" @blur="handleBlur" />
    </select>

    <div v-show="errorMessage" class="text-alert font-medium">
      {{ errorMessage }}
    </div>
  </div>
</template>
