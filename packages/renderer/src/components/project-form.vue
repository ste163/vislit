<script setup lang="ts">
import { computed, ref } from "vue";
import { useForm } from "vee-validate";
import { toFormValidator } from "@vee-validate/zod";
import { z } from "zod";
import { send } from "../api";
import InputText from "./input-text.vue";
import InputSelect from "./input-select.vue";
import InputTextarea from "./input-textarea.vue";
import ButtonSubmit from "./button-submit.vue";
import type { Project, Type } from "interfaces";
import type { ProjectFormSubmission } from "../renderer-interfaces";

// TODO: Types:
// if a type is added: emit 'refetchTypes'
// if a type is deleted: emit 'refetchTypes'

interface Props {
  types: Type[];
}

const { types } = defineProps<Props>();

const emit = defineEmits(["projectFormSubmission"]);

const isSubmitting = ref<boolean>(false);
const typeOptions = computed(() => types.map((type) => type));

// However, if they select Add new Type, then show the new input
// that input cannot be visible to submit. You cannot submit form with Add new Type selected
const validationSchema = toFormValidator(
  z.object({
    title: z.string().min(1, { message: "Title is required." }),
    type: z.string().min(1, { message: "Type is required" }),
    description: z.string().optional(),
  })
);

const { handleSubmit } = useForm({
  validationSchema,
});

const onSubmit = handleSubmit(async (formValues) => {
  try {
    isSubmitting.value = true;
    const { title, type, description } = formValues;
    const result = (await send("projects-add", {
      title,
      typeId: type,
      description: description ?? null,
    })) as Project | Error;

    if (result instanceof Error) {
      emit("projectFormSubmission", { errorMessage: result?.message });
      // SHOW THE ERROR NOTIFICATION BANNER
      // this is a DB failure
      return;
    }
    // based on results
    // setup the object that gets emitted to Parent
    // Parent/App.vue handles notifications, routing, column state, etc.
    // By doing this, the project-form ONLY works with the form
    // it knows nothing else about the state of the application.

    emit("projectFormSubmission", {
      isEditing: false,
      project: {
        ...result,
      },
    } as unknown as ProjectFormSubmission);
  } catch (error: any | Error) {
    // SHOW ERROR WINDOW, as this is a major failure
    // (so send the message)
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
});
</script>

<template>
  <form class="flex flex-col mx-4 mt-4" @submit.prevent="onSubmit">
    <h3 class="mb-4">Create</h3>
    <input-text name="title" label="Title" />
    <input-select class="my-5" name="type" label="Type">
      <option
        v-for="option in typeOptions"
        :key="option.id"
        :value="option.id"
        class="capitalize"
      >
        {{ option.value }}
      </option>
    </input-select>
    <input-textarea name="description" label="Description (optional)" />
    <div class="self-center mt-4">
      <button-submit :is-submitting="isSubmitting" />
    </div>
  </form>
</template>
