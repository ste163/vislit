<script setup lang="ts">
import type { PropType } from "vue";
import { inject, computed } from "vue";
import type { Store } from "../store";
import type { Goal } from "interfaces";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./input-text.vue";
import ButtonSubmit from "./button-submit.vue";
import InputSelect from "./input-select.vue";
import InputCheckBox from "./input-check-box.vue";

const store = inject("store") as Store;

const props = defineProps({
  activeGoal: {
    type: Object as PropType<Goal>,
    required: false,
    default: {
      projectId: "",
      basedOnWordCountOrPageCount: "",
      wordOrPageCount: "",
      frequencyToRepeat: "",
    } as unknown as Goal,
  },
});

const emit = defineEmits(["goalSaved"]);

function emitGoalSaved(): void {
  emit("goalSaved");
}

const computedActiveGoal = computed(() =>
  props.activeGoal.id ? props.activeGoal : null
);

const validationSchema = toFormValidator(
  z.object({
    basedOnWordCountOrPageCount: z.string().nonempty("Required."),
    frequencyToRepeat: z.string().nonempty("Required.").or(z.number()),
    daysPerFrequency: z
      .string()
      .regex(/^([^-])[0-9]*$/)
      .optional()
      .or(z.number()),
    wordOrPageCount: z
      .string({
        required_error: "Required",
      })
      .regex(/^([^-])[0-9]*$/)
      .or(z.number()),
    proofread: z.boolean().optional(),
    edited: z.boolean().optional(),
    revised: z.boolean().optional(),
  })
);

const initialFormValues = {
  basedOnWordCountOrPageCount: props.activeGoal.basedOnWordCountOrPageCount,
  frequencyToRepeat: props.activeGoal.frequencyToRepeat,
  wordOrPageCount: props.activeGoal.wordOrPageCount,
  edited: props.activeGoal.editCountsTowardGoal,
  proofread: props.activeGoal.proofreadCountsTowardGoal,
  revised: props.activeGoal.revisedCountsTowardsGoal,
};

if (computedActiveGoal.value && "daysPerFrequency" in props.activeGoal) {
  (initialFormValues as any).daysPerFrequency =
    computedActiveGoal.value.daysPerFrequency;
}

const { handleSubmit, meta, values } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  const newGoal: Goal = {
    projectId: store.application.state.activeProject!.id!,
    basedOnWordCountOrPageCount: values.basedOnWordCountOrPageCount as
      | "word"
      | "page",
    wordOrPageCount: parseInt(values.wordOrPageCount as unknown as string), // casting because Goal has number but form forces it to a string
    frequencyToRepeat: values.frequencyToRepeat as
      | "daily"
      | "weekly"
      | "monthly",
    proofreadCountsTowardGoal: values.proofread,
    editCountsTowardGoal: values.edited,
    revisedCountsTowardsGoal: values.revised,
  };

  // daysPerFrequency only exists for non-daily goals
  // must use any type as daysPerFrequency can't have an initial form value
  if ((values as any).daysPerFrequency)
    newGoal.daysPerFrequency = parseInt((values as any).daysPerFrequency);

  if (computedActiveGoal.value) {
    newGoal.id = computedActiveGoal.value.id;
    newGoal.projectId = computedActiveGoal.value.projectId;
    newGoal.active = computedActiveGoal.value.active;
    newGoal.completed = computedActiveGoal.value.completed;
    newGoal.dateCreated = computedActiveGoal.value.dateCreated;
    newGoal.dateModified = computedActiveGoal.value.dateModified;
  }

  try {
    const { api } = window;
    const response = computedActiveGoal.value
      ? await api.send("goals-update", newGoal)
      : await api.send("goals-add", newGoal);
    if (response instanceof Error) throw response;
    if (response) {
      resetForm();
      await store.application.getProjects();
      emitGoalSaved();
    }
  } catch (error: any | Error) {
    console.error(error.message);
  }
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
</script>

<template>
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

    <input-text
      v-if="
        values.frequencyToRepeat !== 'daily' && values.frequencyToRepeat as any !== ''
      "
      name="daysPerFrequency"
      :label="`Days to repeat per  ${frequencyLabel}`"
      type="number"
      :max="frequencyMax"
      min="1"
      :background-color="'var(--lightGray)'"
    />

    <input-text
      v-if="
        values.basedOnWordCountOrPageCount as any !== '' &&
        values.frequencyToRepeat as any !== ''
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
