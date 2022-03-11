import { render, screen, waitFor } from "@testing-library/vue";
import { expect, it, vi } from "vitest";
import App from "./app.vue";
import router from "./router";
// fetching data successfully on user with no data
// // First scenario
// - show welcome page
// - user with project but no localStorage,
// - route to /summary with most recent project
// // Second scenario
// - user with data and localStorage settings
// - restore settings

it("when data (projects or types) fails to fetch, render error page and no sidebar", async () => {
  // To mock on the window object, need to add the api to the window
  const api = {
    send: vi.fn(() => {
      throw new Error("Mock failed response");
    }),
  };

  Object.defineProperty(window, "api", {
    value: api,
  });

  render(App, {
    global: {
      plugins: [router],
    },
  });

  // await for loading state to have finished

  // Fetch data was called
  expect(window.api.send).toHaveBeenCalledOnce();

  // Wait for state to update
  await waitFor(() => {
    expect(screen.getByText("Unable to access data")).toBeTruthy();
  });
});
