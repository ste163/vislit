<template>
  <div class="container">
    <!-- Must have a single root node to animate with <transition-group /> -->
    <button-back class="back-button" @click="emitGoBack" />
    <form class="form" @submit.prevent="onSubmit">
      <input-text name="title" type="text" label="Title" />

      <input-text name="type" type="text" label="Type" />

      <input-text name="description" type="text" label="Description" />

      <!-- Need to pass in an isSubmitting for loading spinner -->
      <button-submit :is-disabled="!meta.dirty" />
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./InputText.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import ButtonBack from "./ButtonBack.vue";

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

<style scoped>
.container {
  width: clamp(180px, 90%, 300px);
}

.back-button {
  margin: 0.5em 0em 0.5em 0.5em;
}

.form {
  display: flex;
  flex-flow: column nowrap;
}
</style>
