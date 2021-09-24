<template>
  <div class="form-container">
    <!-- Must have a single root node to animate with <transition-group /> -->

    <div class="form-container-header">
      <button-back class="back-button" @click="emitGoBack" />

      <column-sub-heading class="form-title"
        >Create New Project</column-sub-heading
      >
    </div>

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
import ColumnSubHeading from "./ColumnSubHeading.vue";
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
.form-container {
  width: clamp(180px, 90%, 300px);
}

.form-container-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
}

.back-button {
  margin: 0.5em 0em 0.5em 0.5em;
  padding-top: 0.22em;
}

.form-title {
  margin-left: 1em;
}

.form {
  display: flex;
  flex-flow: column nowrap;
}
</style>
