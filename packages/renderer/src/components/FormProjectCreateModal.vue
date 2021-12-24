<script setup lang="ts">
import { inject, watch, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import type Store from "../store/Store";
import type { Type } from "interfaces";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./InputText.vue";
import ButtonSubmit from "./ButtonSubmit.vue";
import BaseModal from "./BaseModal.vue";
import InputSelect from "./InputSelect.vue";

const store = inject("store") as Store;

const router = useRouter();

const props = defineProps({
  isFormModalActive: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const emit = defineEmits(["closeModal"]);

const types = reactive({ values: [] as Type[] });

onMounted(async () => {
  const { api } = window;
  const response = (await api.send("types-get-all")) as Type[];
  if (response) {
    types.values = response;
  }
});

function emitCloseModal(): void {
  emit("closeModal");
}

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

const { handleSubmit, meta, resetForm } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  console.log(values);
  const newProject = {
    id: "",
    title: values.title,
    description: values.description,
    typeId: values.type,
    completed: false,
    archived: false,
    dateCreated: null,
    dateModified: null,
  };

  // try {
  //   const project = await store.projects.addProject(newProject);
  //   if (project !== undefined) {
  //     router.push(`/summary/${project.id}`);
  //     resetForm();
  //   }
  // } catch (error: any | Error) {
  //   console.error(error.message);
  // }
});

function handleSelectAddClick(value: string): void {
  if (value !== "") {
    console.log("create type", value);
    try {
      // add
      // then if there's a good response
      // re-fetch data
    } catch (error: any | Error) {
      console.error(error);
      // set toast notification
    }
  }
}

function handleSelectDeleteClick(id: string): void {
  if (id) {
    console.log("delete", id);
    try {
      // delete
      // then if good response
      // re-fetch data
    } catch (error: any | Error) {
      console.error(error);
      // set toast notification
    }
  }
}

// Needed otherwise the form attempts to 'submit' when opened on initial render
watch(() => props.isFormModalActive, resetForm);
</script>

<template>
  <base-modal
    :is-modal-active="isFormModalActive"
    @close-modal="emitCloseModal"
  >
    <template #header> Create Project </template>

    <form class="form" @submit.prevent="onSubmit">
      <input-text
        name="title"
        type="text"
        label="Title"
        :background-color="'var(--lightGray)'"
      />

      <input-select
        :values="types.values"
        :is-editable="true"
        :name="'type'"
        :label="'Type'"
        @add-click="handleSelectAddClick"
        @delete-click="handleSelectDeleteClick"
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
/* Convert to tailwind */
.form {
  display: flex;
  flex-flow: column nowrap;
  margin-top: 1em;
  width: 15em;
}
</style>
