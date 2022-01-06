<script setup lang="ts">
import { inject, watch } from "vue";
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
  // look into how to use zod to validate dropdowns/selects
  z.object({
    basedOnWordCountOrPageCount: z.string().nonempty("Title is required."),
    frequencyToRepeat: z.string().nonempty("Type is required."),
    daysPerFrequency: z.string().optional(),
    // wordOrPageCount: // something
    // proofread -> optional
    // edited -> optional
    // revised -> optional
  })
);

const initialFormValues = {
  basedOnWordCountOrPageCount: "",
  frequencyToRepeat: "",
  daysPerFrequency: "",
};

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  console.log(values);
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
        :values="[{ id: 'test', value: 'test' }]"
        :is-editable="false"
        :name="'frequencyToRepeat'"
        :label="'Time frame'"
      />

      <!-- If not daily, show this -->
      <input-text
        name="daysPerFrequency"
        type="number"
        label="Days to repeat in time frame"
        :background-color="'var(--lightGray)'"
      />

      <!-- This label needs to be computed to show Word or Page count per day -->
      <input-text
        name="wordOrPageCount"
        type="text"
        label="Word/Page count per day"
        :background-color="'var(--lightGray)'"
      />

      <input-check-box name="proofRead" label="Proofread" :value="false" />

      <input-check-box name="editted" label="Editted" :value="false" />

      <input-check-box name="revised" label="Revised" :value="false" />

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
  width: 15em;
}
</style>
