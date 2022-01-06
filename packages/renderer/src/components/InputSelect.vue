<script setup lang="ts">
import { useField } from "vee-validate";
import type { PropType } from "vue";
import { computed, ref } from "vue";

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
  isEditable: {
    type: Boolean,
    required: true,
  },
  // backgroundColor should be Variant
  backgroundColor: {
    type: String,
    default: "var(--white)",
  },
});

const emit = defineEmits(["addClick", "deleteClick"]);

const isOpened = ref<boolean>(false);
const addInputValue = ref<string>("");

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
    <!-- clicking outside closes it -->
    <div :id="name" :name="name" :value="selectedValue" class="capitalize">
      {{ selectedDisplayText }}
    </div>
    <div
      @click="
        (e) => {
          e.stopPropagation();
          isOpened = !isOpened;
        }
      "
    >
      Chevron
    </div>

    <div v-if="isOpened">
      <div v-if="isEditable">
        <button type="button" @click="() => emit('addClick', addInputValue)">
          +
        </button>
        <input
          v-model="addInputValue"
          type="text"
          placeholder="Add a new Type"
        />
      </div>

      <div v-for="value in values" :key="value?.id" class="flex">
        <option
          class="capitalize"
          :name="name"
          :value="value.id"
          @click="handleChange"
        >
          {{ value?.value }}
        </option>
        <button
          v-if="isEditable"
          type="button"
          @click="() => emit('deleteClick', value.id)"
        >
          X
        </button>
      </div>
    </div>
  </div>
</template>
