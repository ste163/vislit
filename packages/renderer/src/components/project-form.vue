<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { toFormValidator } from "@vee-validate/zod";
import BaseButton from "./base-button.vue";
import InputText from "./input-text.vue";
// TODO: setup basic test file
// - if no project passed in, show empty create form
// - skip.if project passed in, show that form in Edit mode
// - non-valid data shows errors
// - must submit required fields shows required field errors
// - valid data emits submit event
//
// Types:
// if a type is added: emit 'refetchTypes'
// if a type is deleted: emit 'refetchTypes'

const emit = defineEmits(["projectFormSubmission"]);

// However, if they select Add new Type, then show the new input
// that input cannot be visible to submit. You cannot submit form with Add new Type selected
const validationSchema = toFormValidator(
  z.object({
    title: z.string().min(1, { message: "Title is required." }),
    type: z.string().min(1, { message: "Type is required" }),
    description: z.string().optional(),
  })
);

const { handleSubmit } = useForm({ validationSchema });

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    console.log("submit form values", values);

    // call endpoints here
    // based on results
    // setup the object that gets emitted to Parent
    // Parent/App.vue handles notifications, routing, column state, etc.
    // By doing this, the project-form ONLY works with the form
    // it knows nothing else about the state of the application.

    // TODO: create an interface for this
    // to be used on App level
    emit("projectFormSubmission", {
      isError: false,
      errorMessage: null,
      isEditing: false,
      project: {
        id: "123",
        title: "Test Title",
        type: "id",
        description: null,
      },
    });
  } catch (error: any | Error) {
    // show error notification/error dialog?
    console.error(error);
  }
});
</script>

<template>
  <form class="flex flex-col mx-4 mt-4" @submit.prevent="onSubmit">
    <h3 class="mb-4">Create</h3>

    <!-- This really need to be in components or this file will get HUGE too fast -->
    <input-text name="title" label="Title" />

    <div class="flex flex-col my-4">
      <label>Type</label>
      <!-- Attempt to use default html as its most accessible; with some simple styling -->
      <select id="type" class="rounded-md p-1">
        <!-- NO! Select has a + and Trashcan icon
        If nothing is selected, it's a PLUS so you can add a type
        If something is selected, it's a trashcan!
        Or some kind of icon that opens a modal for seeing:
        - how many projects per type
        - removing types
        THIS IS FOR v2 though
        - V1 is no type editing for project form
        -->
        <option></option>
        <option>Test 1</option>
        <option>Test 2</option>
      </select>
      <!-- OR have an item that is: Add your Own/Other that would open a new input at the bottom -->
      <!-- Have option to 'add a new item below it?' -->
    </div>

    <div class="flex flex-col">
      <label>Description</label>
      <!-- Custom outline: needs to be using state though for 'is active' -->
      <textarea
        id="description"
        class="rounded-md p-1 border border-primary outline-none max-h-48"
        rows="2"
      />
    </div>

    <div class="self-center mt-4">
      <base-button>Create</base-button>
    </div>
  </form>
</template>
