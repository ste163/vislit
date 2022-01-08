<script setup lang="ts">
import { inject, watch, computed } from "vue";
import type { Store } from "../store";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./InputText.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import BaseModal from "./BaseModal.vue";
import InputSelect from "./InputSelect.vue";
import InputCheckBox from "./InputCheckBox.vue";

const store = inject("store") as Store;

const props = defineProps({
  isFormModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["closeModal"]);

function emitCloseModal(): void {
  emit("closeModal");
}

const validationSchema = toFormValidator(
  z.object({
    basedOnWordCountOrPageCount: z.string().nonempty("Required."),
    frequencyToRepeat: z.string().nonempty("Required."),
    daysPerFrequency: z
      .string()
      .regex(/^([^-])[0-9]*$/)
      .optional(), // need max and min length based on weekly or monthly
    wordOrPageCount: z
      .string({
        required_error: "Required",
      })
      .regex(/^([^-])[0-9]*$/),
    proofread: z.boolean(),
    edited: z.boolean(),
    revised: z.boolean(),
  })
);

const initialFormValues = {
  basedOnWordCountOrPageCount: "",
  frequencyToRepeat: "",
  wordOrPageCount: "",
  edited: false,
  proofread: false,
  revised: false,
};

const { handleSubmit, meta, resetForm, values } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  console.log(values);

  // parse daysPerFrequency
  // parse wordOrPageCount

  const newGoal = {};

  // try {
  //   // hits the addGoal endpoint
  //   // do not use a store for this as that's over-kill
  //   // this will be the only place we ever add a goal
  //   const project = await store.projects.addProject(newGoal);
  //   if (project !== undefined) {
  //     resetForm();
  //   }
  // } catch (error: any | Error) {
  //   console.error(error.message);
  // }
});

const frequencyLabel = computed(() =>
  values.frequencyToRepeat === "weekly" ? "week" : "month"
);

const wordOrPageLabel = computed(() =>
  values.basedOnWordCountOrPageCount === "word" ? "Word" : "Page"
);

const pageOrWordCountLabel = computed(() =>
  values.frequencyToRepeat !== "daily"
    ? `${wordOrPageLabel.value} count for each day in ${frequencyLabel.value}`
    : `${wordOrPageLabel.value} count per day`
);

const frequencyMax = computed(() =>
  values.frequencyToRepeat === "weekly" ? "6" : "31"
);

// Needed otherwise the form attempts to 'submit' when opened on initial render
watch(() => props.isFormModalActive, resetForm);
</script>

<template>
  <base-modal
    :is-modal-active="isFormModalActive"
    @close-modal="emitCloseModal"
  >
    <template #header> Create Goal </template>

    <form class="form" @submit.prevent="onSubmit">
      <input-select
        :values="[
          { id: 'word', value: 'Word' },
          { id: 'page', value: 'Page' },
        ]"
        :is-editable="false"
        :name="'basedOnWordCountOrPageCount'"
        :label="'Based on word count or page count'"
      />

      <input-select
        :values="[
          { id: 'daily', value: 'Daily' },
          { id: 'weekly', value: 'Weekly' },
          { id: 'monthly', value: 'Monthly' },
        ]"
        :is-editable="false"
        :name="'frequencyToRepeat'"
        :label="'Time frame'"
      />

      <!-- computed property for label -->
      <!-- max for week is 6, month is 31 -->
      <input-text
        v-if="
          values.frequencyToRepeat !== 'daily' &&
          values.frequencyToRepeat !== ''
        "
        name="daysPerFrequency"
        :label="`Days to repeat per  ${frequencyLabel}`"
        type="number"
        :max="frequencyMax"
        min="1"
        :background-color="'var(--lightGray)'"
      />

      <!-- This label needs to be computed to show Word or Page count per day -->
      <input-text
        v-if="
          values.basedOnWordCountOrPageCount !== '' &&
          values.frequencyToRepeat !== ''
        "
        name="wordOrPageCount"
        :label="pageOrWordCountLabel"
        type="number"
        max="999999999"
        min="1"
        :background-color="'var(--lightGray)'"
      />

      <input-check-box name="proofread" label="Proofread" />
      <input-check-box name="edited" label="Edited" />
      <input-check-box name="revised" label="Revised" />

      <!-- Need to pass in an isSubmitting for loading spinner -->
      <button-submit
        :is-disabled="!meta.dirty"
        :background-color-disabled="'var(--lightGray)'"
      />
    </form>

    <!-- Also show the goal log on the right side -->
  </base-modal>
</template>

<style scoped>
/* Convert to tailwind */
.form {
  display: flex;
  flex-flow: column nowrap;
  margin-top: 1em;
  width: 20em;
}
</style>
