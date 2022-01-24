<script setup lang="ts">
import type { PropType } from "vue";
import type { Progress } from "interfaces";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./input-text.vue";
import ButtonSubmit from "./button-submit.vue";
import InputCheckBox from "./input-check-box.vue";

const props = defineProps({
  date: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  goalId: {
    type: String,
    required: true,
  },
  currentProgress: {
    type: Object as PropType<Progress>,
    required: false,
    default: {
      projectId: "",
      goalId: "",
      count: "",
      proofread: false,
      edited: false,
      revised: false,
    } as unknown as Progress,
  },
});

const emit = defineEmits(["progressSaved"]);

function emitProgressSaved(): void {
  emit("progressSaved");
}

const validationSchema = toFormValidator(
  z.object({
    count: z
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
  count: props.currentProgress?.count.toString(),
  edited: props.currentProgress?.edited,
  proofread: props.currentProgress?.proofread,
  revised: props.currentProgress?.revised,
};

const { handleSubmit, meta } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values) => {
  const newProgress: Progress = {
    date: props.date,
    projectId: props.projectId,
    goalId: props.goalId,
    count: parseInt(values.count as unknown as string), // casting because Progress has number but form forces it to a string
    proofread: values.proofread,
    edited: values.edited,
    revised: values.revised,
  };

  try {
    const { api } = window;
    const response = await api.send("progress-modify", newProgress);
    if (response instanceof Error) throw response;
    if (response) emitProgressSaved();
  } catch (error: any | Error) {
    console.error(error.message);
  }
});
</script>

<template>
  <tr>
    <td>
      {{ date.split("T")[0] }}
    </td>
    <td>
      <input-text
        name="count"
        type="number"
        max="999999999"
        min="1"
        :background-color="'var(--lightGray)'"
      />
    </td>
    <td>
      <input-check-box name="proofread" />
    </td>
    <td>
      <input-check-box name="edited" />
    </td>
    <td>
      <input-check-box name="revised" />
    </td>
    <td>
      <span v-if="currentProgress.completed">Yes</span><span v-else>No</span>
    </td>

    <!-- Need to pass in an isSubmitting for loading spinner -->
    <button-submit
      :is-disabled="!meta.dirty"
      :background-color-disabled="'var(--lightGray)'"
      @click="onSubmit"
    />
  </tr>
</template>
