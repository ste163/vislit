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
  <form @submit.prevent="onSubmit">
    <div>
      <label>Title</label>
      <input />
    </div>

    <div>
      <label>Type</label>
      <input />
    </div>

    <!-- Have a question mark here that says
descriptions are optional to help you. You can also search for them -->
    <div>
      <label>Description</label>
      <input />
    </div>

    <base-button>Submit</base-button>
  </form>
</template>
