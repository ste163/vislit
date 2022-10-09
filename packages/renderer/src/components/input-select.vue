<script setup lang="ts">
import { useField } from "vee-validate";

type Props = {
  name: string;
  label: string;
  emptyDefault: boolean;
  canValidationAffectsStyling: boolean;
  value?: string;
};

const {
  name,
  label,
  value = "",
  emptyDefault,
  canValidationAffectsStyling,
} = defineProps<Props>();

const {
  value: fieldValue,
  meta,
  errorMessage,
  handleChange,
  handleBlur,
} = useField(name, undefined, { initialValue: value });
</script>

<template>
  <div class="flex flex-col">
    <label
      :for="name"
      :fieldValue="fieldValue"
      class="font-medium"
      :class="
        canValidationAffectsStyling && meta.valid && meta.touched
          ? 'text-primary'
          : errorMessage && 'text-alert'
      "
      >{{ label }}</label
    >
    <select
      :name="name"
      class="capitalize rounded-md p-1 outline-none focus:border focus:border-gray-800"
      :class="
        canValidationAffectsStyling && meta.valid && meta.touched
          ? 'border border-primary'
          : errorMessage
          ? 'border border-alert'
          : 'border-gray-800'
      "
      @change="handleChange"
      @blur="handleBlur"
    >
      <option v-if="emptyDefault" value=""></option>
      <slot />
    </select>

    <div v-show="errorMessage" class="text-alert font-medium">
      {{ errorMessage }}
    </div>
  </div>
</template>
