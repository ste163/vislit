<script setup lang="ts">
import { inject } from "vue";
import { useRouter } from "vue-router";
import type { PropType } from "vue";
import type { Project } from "interfaces";
import type { Store } from "../store";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import InputText from "./input-text.vue";
import ButtonSubmit from "./button-submit.vue";
import InputSelect from "./input-select.vue";

const props = defineProps({
  currentProject: {
    type: Object as PropType<Project>,
    required: false,
    default: {
      title: "",
      type: "",
      description: "",
    } as unknown as Project,
  },
});

const emit = defineEmits(["projectSaved"]);

const store = inject("store") as Store;

const router = useRouter();

const { api } = window;

const validationSchema = toFormValidator(
  z.object({
    title: z.string().nonempty("Title is required."),
    type: z.string().nonempty("Type is required."),
    description: z.string().optional(),
  })
);

const initialFormValues = {
  title: props.currentProject.title,
  type: props.currentProject.typeId,
  description: props.currentProject.description,
};

const { handleSubmit, meta } = useForm({
  validationSchema,
  initialValues: initialFormValues,
});

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    if (props.currentProject.id) {
      const updatedProject = {
        id: props.currentProject.id,
        title: values.title,
        description: values.description,
        typeId: values.type,
        completed: false,
        archived: false,
      } as Project;

      await store.updateProject(updatedProject);
      emit("projectSaved");
      resetForm();
    } else {
      const newProject = {
        title: values.title,
        description: values.description,
        typeId: values.type,
      };

      const response = (await api.send("projects-add", newProject)) as Project;

      // Change to check for error first, then throw the repsonse if there is one
      if (response && response instanceof Error === false) {
        // Display success message
        await store.getProjects();
        emit("projectSaved");
        router.push(`/summary/${response.id}`);
        resetForm();
      } else {
        // toast error
        // because we got an error response but nothing UI-wise broke
        console.error(response);
      }
    }
  } catch (error: any | Error) {
    // Something failed major failed
    console.error(error.message);
  }
});

async function handleSelectAddClick(value: string): Promise<void> {
  if (value !== "") {
    try {
      const response = await api.send("types-add", value);
      if (response) await store.getTypes();
    } catch (error: any | Error) {
      console.error(error);
      // set toast notification
    }
  }
}

async function handleSelectDeleteClick(id: string): Promise<void> {
  if (id) {
    try {
      const response = await api.send("types-delete", id);
      if (response) await store.getTypes();
    } catch (error: any | Error) {
      console.error(error);
      // set toast notification
    }
  }
}

// Needed otherwise the form attempts to 'submit' when opened on initial render
// watch(() => props.isFormModalActive, resetForm);
</script>

<template>
  <form class="form" @submit.prevent="onSubmit">
    <input-text
      name="title"
      type="text"
      label="Title"
      :background-color="'var(--lightGray)'"
    />

    <input-select
      :values="store.state.types"
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
