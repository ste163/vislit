import { it } from "vitest";
// Fetching data fails:
// - render failure state
// fetching data successfully on user with no data
// // First scenario
// - show welcome page
// - user with project but no localStorage,
// - route to /summary with most recent project
// // Second scenario
// - user with data and localStorage settings
// - restore settings

it.skip("when data (projects or types) fails to fetch, render error page and no sidebar", () => {
  // mock fetching data as failure (this will be biggest thing to figure out)
});
