<template>
  <div>
    <!-- Must have a single root node to animate with <transition-group /> -->
    <button @click="emitGoBack">Back</button>
    <form @submit.prevent="onSubmit">
      <input-text name="title" type="text" label="Title" />

      <input-text name="type" type="text" label="Type" />

      <input-text name="description" type="text" label="Description" />

      <!-- Make a create button component that has isDisabled and isActive props -->
      <button type="submit" :disabled="!meta.dirty">Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./InputText.vue";

const validationSchema = toFormValidator(
  z.object({
    title: z.string().nonempty("Title is required."),
    type: z.string().nonempty("Type is required."),
    description: z.string().optional(),
  })
);

const initialFormValues = {
  title: "",
  type: "",
  description: "",
};

const { handleSubmit, meta } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["goBack"]);

function emitGoBack(): void {
  emit("goBack");
}

const onSubmit = handleSubmit((values, { resetForm }) => {
  console.log("YOU SUBMITED", values);
  resetForm();
});
</script>
