<template>
  <div>
    <!-- Must have a single root node to animate with <transition-group /> -->
    <button @click="emitGoBack">Back</button>
    <form @submit.prevent="onSubmit">
      <input type="text" v-model="title" placeholder="title" />
      <span>{{ errors.title }}</span>

      <input type="text" v-model="type" placeholder="type" />
      <span>{{ errors.type }}</span>

      <input type="text" v-model="description" placeholder="description" />
      <span>{{ errors.description }}</span>

      <!-- Make a create button component that has isDisabled and isActive props -->
      <button type="submit" :disabled="!meta.dirty">Create</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm, useField } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";

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

const { handleSubmit, errors, meta } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const { value: title } = useField("title");
const { value: type } = useField("type");
const { value: description } = useField("description");

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
