<script setup lang="ts">
import { inject, watch } from "vue";
import { useRouter } from "vue-router";
import type IStore from "../store/interfaces/IStore";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./InputText.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import BaseModal from "./BaseModal.vue";

const store = inject("store") as IStore;

const router = useRouter();

// eslint-disable-next-line no-undef
const props = defineProps({
  isFormModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["closeModal"]);

function emitCloseModal(): void {
  emit("closeModal");
}

const validationSchema = toFormValidator(
  z.object({
    title: z.string().nonempty("Title is required."),
    type: z.string().nonempty("Type is required."),
    description: z.string().optional(),
  }),
);

const initialFormValues = {
  title: "",
  type: "",
  description: "",
};

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  const newProject = {
    id: "",
    title: values.title,
    description: values.description,
    typeId: 1,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  };

  try {
    const project = await store.projects.addProject(newProject);

    if (project !== undefined) {
      router.push(`/summary/${project.id}`);
      resetForm();
    }
  } catch (error) {
    const e = error as Error;
    // Move to notification
    console.error(e.message);
  }
});

// Needed otherwise the form attempts to 'submit' when opened on initial render
watch(() => props.isFormModalActive, resetForm);
</script>

<template>
  <!-- Used only on the Welcome page -->
  <base-modal
    :is-modal-active="isFormModalActive"
    @close-modal="emitCloseModal"
  >
    <template #header>
      Create Project
    </template>

    <form
      class="form"
      @submit.prevent="onSubmit"
    >
      <input-text
        name="title"
        type="text"
        label="Title"
        :background-color="'var(--lightGray)'"
      />

      <input-text
        name="type"
        type="text"
        label="Type"
        :background-color="'var(--lightGray)'"
      />

      <input-text
        name="description"
        type="text"
        label="Description"
        :background-color="'var(--lightGray)'"
      />

      <!-- Need to pass in an isSubmitting for loading spinner -->
      <button-submit
        :is-disabled="!meta.dirty"
        :background-color-disabled="'var(--lightGray)'"
      />
    </form>
  </base-modal>
</template>

<style scoped>
.form {
  display: flex;
  flex-flow: column nowrap;
  margin-top: 1em;
  width: 15em;
}
</style>
