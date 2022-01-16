<script setup lang="ts">
import { computed, ref, inject } from "vue";
import type { Store } from "../store";
import type { Progress } from "interfaces";

const store = inject("store") as Store;

const today = new Date();

const selectedMonth = ref<number>(today.getUTCMonth());
const selectedYear = ref<number>(today.getUTCFullYear());

const daysInMonth = computed(() => {
  // https://stackoverflow.com/questions/13146418/find-all-the-days-in-a-month-with-date-object#13146828
  function getDaysInMonthUTC(month: number, year: number) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  return getDaysInMonthUTC(selectedMonth.value, selectedYear.value);
});

const monthHeading = computed(() => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[selectedMonth.value];
});

function handlePreviousMonthClick(): void {
  if (selectedMonth.value === 0) {
    selectedYear.value = selectedYear.value - 1;
    selectedMonth.value = 11;
  } else {
    selectedMonth.value = --selectedMonth.value;
  }
}

function handleNextMonthClick(): void {
  if (selectedMonth.value === 11) {
    selectedYear.value = ++selectedYear.value;
    selectedMonth.value = 0;
  } else {
    selectedMonth.value = ++selectedMonth.value;
  }
}

async function handleSubmitClick(date: Date): Promise<void> {
  try {
    const { api } = window;
    const progress: Progress = {
      date,
      projectId: store.projects.state.active?.id as string,
      goalId: 'test', // how's this coming back from project?
      count: 123, // rest are based on inputs, which will need validation. Each will be a separate form
      edited: false,
      proofread: false,
      revised: false
    };
   await api.send("progress-add", progress);
  } catch (error: any | Error) {
    console.error(error);
  }
}
</script>

<template>
  <h1>Progress</h1>
  <div>
    <h2>{{ monthHeading }}</h2>
    <button @click="handlePreviousMonthClick">Previous</button>
    <button @click="handleNextMonthClick">Next</button>

<!-- To make it easy, have a save button on every line -->
<!-- Todo will be have auto-saving changes when you click the edit button -->
    <div v-for="day in daysInMonth" :key="day.getUTCMilliseconds()">
      {{ day }}
      <button type="button" @click="handleSubmitClick(day)">Submit to API</button>
    </div>
  </div>
</template>
