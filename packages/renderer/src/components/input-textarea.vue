<script setup lang="ts">
import { useField } from "vee-validate";

type Props = {
  name: string;
  label: string;
  rows?: string;
  value?: string;
};

const { name, label, rows = "2", value = "" } = defineProps<Props>();

const {
  value: fieldValue,
  meta,
  errorMessage,
  handleBlur,
  handleChange,
} = useField(name, undefined, { initialValue: value });
console.log(meta);
</script>

<template>
  <div class="flex flex-col">
    <label
      :for="name"
      class="font-medium"
      :class="
        meta.valid && meta.touched
          ? 'text-primary'
          : errorMessage && 'text-alert'
      "
    >
      {{ label }}
    </label>
    <textarea
      :id="name"
      :name="name"
      :value="fieldValue"
      :rows="rows"
      class="rounded-md p-1 outline-none focus:border focus:border-gray-800"
      :class="
        meta.valid && meta.touched
          ? 'border border-primary'
          : errorMessage
          ? 'border border-alert'
          : 'border-gray-800'
      "
      @input="handleChange"
      @blur="handleBlur"
    />
    <div v-show="errorMessage" class="text-alert font-medium">
      {{ errorMessage }}
    </div>
  </div>
</template>
