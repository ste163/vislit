<script setup lang="ts">
import BaseButton from "./base-button.vue";
// use Zod and vee-validate
// like the prototype version
//
// TODO: setup basic test file
// - if no project passed in, show empty create form
// - skip.if project passed in, show that form in Edit mode
// - non-valid data shows errors
// - must submit required fields shows required field errors
// - valid data emits submit event

const emit = defineEmits(["projectFormSubmission"]);

function onSubmit(): void {
  console.log("submit form");

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
}
</script>

<template>
  <form class="flex flex-col mx-4 mt-2" @submit.prevent="onSubmit">
    <h3>Create</h3>

    <div class="flex flex-col">
      <label>Title<sup>*</sup></label>
      <input class="rounded-md p-1" />
    </div>

    <div class="flex flex-col my-4">
      <label>Type<sup>*</sup></label>
      <!-- Attempt to use default html as its most accessible; with some simple styling -->
      <select class="rounded-md p-1">
        <option></option>
        <option>Add new type</option>
        <option>Test 1</option>
        <option>Test 2</option>
      </select>
      <!-- OR have an item that is: Add your Own/Other that would open a new input at the bottom -->
      <!-- Have option to 'add a new item below it?' -->
    </div>

    <div class="flex flex-col">
      <label>Description</label>
      <!-- Custom outline: needs to be using state though for 'is active' -->
      <input class="rounded-md p-1 border border-primary outline-none" />
    </div>

    <div class="self-center mt-4">
      <base-button>Create</base-button>
    </div>
  </form>
</template>
