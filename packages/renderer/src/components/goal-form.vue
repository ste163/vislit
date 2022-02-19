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
import InputCheckBox from "./input-check-box.vue";

const store = inject("store") as Store;

const props = defineProps({
  activeGoal: {
    type: Object as PropType<Goal>,
    required: false,
    default: {
      projectId: "",
      isDaily: false,
      daysPerMonth: "",
      wordCount: "",
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
    isDaily: z.boolean().optional(),
    daysPerMonth: z
      .string()
      .regex(/^([^-])[0-9]*$/)
      .optional()
      .or(z.number()),
    wordCount: z
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
  daysPerMonth: props.activeGoal.daysPerMonth,
  isDaily: props.activeGoal.isDaily,
  wordCount: props.activeGoal.wordCount,
  edited: props.activeGoal.editCountsTowardGoal,
  proofread: props.activeGoal.proofreadCountsTowardGoal,
  revised: props.activeGoal.revisedCountsTowardsGoal,
};

if (computedActiveGoal.value && "daysPerMonth" in props.activeGoal) {
  (initialFormValues as any).daysPerMonth =
    computedActiveGoal.value.daysPerMonth;
}

const { handleSubmit, meta, values } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  const newGoal: Goal = {
    projectId: store.state.activeProject!.id!,
    isDaily: values.isDaily,
    wordCount: parseInt(values.wordCount as unknown as string), // casting because Goal has number but form forces it to a string
    proofreadCountsTowardGoal: values.proofread,
    editCountsTowardGoal: values.edited,
    revisedCountsTowardsGoal: values.revised,
  } as any as Goal;

  // daysPerMonth only exists for non-daily goals
  // must use any type as daysPerMonth can't have an initial form value
  if ((values as any).daysPerMonth)
    newGoal.daysPerMonth = parseInt((values as any).daysPerMonth);

  if (computedActiveGoal.value) {
    newGoal.id = computedActiveGoal.value.id;
    newGoal.projectId = computedActiveGoal.value.projectId;
    newGoal.active = computedActiveGoal.value.active;
    newGoal.completed = computedActiveGoal.value.completed;
  }

  try {
    const { api } = window;
    const response = computedActiveGoal.value
      ? await api.send("goals-update", newGoal)
      : await api.send("goals-add", newGoal);
    if (response instanceof Error) throw response;
    if (response) {
      resetForm();
      await store.getProjects();
      emitGoalSaved();
    }
  } catch (error: any | Error) {
    console.error(error.message);
  }
});
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <!-- Check box for isDaily -->

    <input-text
      name="daysPerMonth"
      :label="'Days to repeat per month'"
      type="number"
      max="31"
      min="1"
      :background-color="'var(--lightGray)'"
    />

    <input-text
      name="wordCount"
      :label="'Word Count'"
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
