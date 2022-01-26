<script setup lang="ts">
import { computed, ref, inject, onMounted, watch } from "vue";
import type { Store } from "../store";
import type { Goal, Progress } from "interfaces";
import FormProgress from "../components/form-progress.vue";

const store = inject("store") as Store;

const today = new Date();

const isLoading = ref<boolean>(true);
const selectedMonth = ref<number>(today.getMonth());
const selectedYear = ref<number>(today.getFullYear());
const progressForDateRange = ref<Progress[]>([]);

const daysInMonth = computed(() => {
  function getDaysInMonth(month: number, year: number) {
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  return getDaysInMonth(selectedMonth.value, selectedYear.value);
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

const monthDoubleDigit = computed(() =>
  convertMonthToDoubleDigit(selectedMonth.value)
);

const yearString = computed(() => selectedYear.value.toString());

const activeGoal = computed(() => {
  const goals = store.projects.state.active?.goals?.filter(
    (goal) => goal.active
  );
  if (goals) return goals[0];
  return undefined;
});

const combinedProgressAndDates = computed(() =>
  daysInMonth.value.map((day) => {
    return {
      date: day.toISOString(),
      progress: progressForDateRange.value.find(
        (progress) => day.toISOString() === progress.date
      ),
    };
  })
);

function convertMonthToDoubleDigit(month: number): string {
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];
  return months[month];
}

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

async function fetchProgress(year: string, month: string): Promise<void> {
  try {
    const { api } = window;
    const dates = {
      projectId: store.projects.state.active?.id,
      year: year,
      month: month,
    };
    const response = await api.send("progress-get-all-by-year-month", dates);
    if (response instanceof Error) throw response;
    progressForDateRange.value = response as Progress[];
  } catch (e: any | Error) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  const year = today.getFullYear().toString();
  const month = convertMonthToDoubleDigit(today.getMonth());
  await fetchProgress(year, month);
});

watch(
  () => selectedMonth.value,
  async () => {
    // Currently loading unmounts the table then re-renders after fetching data
    // which is lagging the progress view. Figure out a better loading solution so it
    // doesn't unmount (show spinner over table/something)
    // MUST reset loading state, because form inputs need to re-mount to get their state reset
    // otherwise their input state gets out of sync as vee-validate is using its own state management
    // that is firing differently than my changes
    isLoading.value = true;
    await fetchProgress(yearString.value, monthDoubleDigit.value);
  }
);
</script>

<template>
  <!-- TODO: wrap in v-if for needing to have an activeproject -->
  <!-- How do you handle displaying progress for old goals? Are they no longer completed? Should there be a dilineating line showing progress changes in the table? -->
  <!-- Probably should do it so:
1. You can only add progress for dates starting from the active goal. Ie, you can't change old progress. it gets locked down. If you have -->
  <!-- So if the goalId doesn't match the activeGoalId, don't allow for editing or deleting that progress -->
  <!-- TODO: Can only add progress ON or AFTER the Project's date created -->
  <h1>Progress</h1>
  <div>
    <!-- TODO: Improve loading so it doesn't unmount table (causes major lag) -->
    <div v-if="isLoading">LOADING...</div>
    <div v-else>
      <div v-if="store.projects.state.active?.goals?.length === 0">
        <h2>Create a Goal to track writing progress</h2>
      </div>
      <div v-else>
        <h2>{{ monthHeading }}</h2>
        <button @click="handlePreviousMonthClick">Previous</button>
        <button @click="handleNextMonthClick">Next</button>

        <!-- Todo: auto-saving changes when you click the edit button -->
        <table class="table-auto text-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Word/Page Count</th>
              <th>Proofread</th>
              <th>Edited</th>
              <th>Revised</th>
              <th>Completed</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            <!-- Instead, make the form-progress a <tr /> and have the rows exist there -->
            <!-- FOR TESTING, GOAL ID ISN'T LEGIT -->
            <!-- ALSO, WE WON'T BE LOOPING OVER DAYS IN MONTH -->
            <!-- WILL BE LOOPING OVER PROGRESS IN MONTH OR SOME COMBO OF THE TWO -->
            <!--  -->
            <!-- Also, listen for the progressSaved event and then re-fetch data -->
            <!-- Also, only allow for progress entering if there is an active goal -->
            <form-progress
              v-for="({ date, progress }, index) in combinedProgressAndDates"
              :key="index"
              :date="date"
              :current-progress="progress"
              :project-id="(store.projects.state.active?.id as string)"
              :goal-id="(activeGoal?.id as string)"
              @progress-saved="
                async () => await fetchProgress(yearString, monthDoubleDigit)
              "
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
