<script setup lang="ts">
import { useField } from "vee-validate";
import { watch } from "vue";
// and use that state to do all the styling

type Props = {
  name: string;
  label: string;
  type?: string;
  value?: string;
  min?: string;
};

const {
  type = "text",
  value = "",
  name,
  label,
  min = "0",
} = defineProps<Props>();

const {
  value: fieldValue,
  meta,
  errorMessage,
  handleBlur,
  handleChange,
} = useField(name, undefined, { initialValue: value });

console.log(meta);
watch(meta, () => {
  console.log(meta);
});
</script>

<template>
  <div class="flex flex-col">
    <label
      class="font-medium"
      :class="meta.valid ? 'text-primary' : errorMessage && 'text-alert'"
    >
      {{ label }}
    </label>
    <input
      :id="name"
      :name="name"
      :type="type"
      :value="fieldValue"
      :min="min"
      class="rounded-md p-1 outline-none focus:border"
      :class="
        meta.valid
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
