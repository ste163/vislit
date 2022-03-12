import { render, screen, waitFor } from "@testing-library/vue";
import { beforeEach, expect, it, vi } from "vitest";
import App from "./app.vue";
import router from "./router";
// fetching data successfully on user with no data
// // First scenario
// - wait for loading
// - show welcome page
// - user with project but no localStorage,
// - route to /summary with most recent project
// // Second scenario
// - user with data and localStorage settings
// - restore settings

function renderApp() {
  const utils = render(App, {
    global: {
      plugins: [router],
    },
  });

  // 2 issues are happening:
  // 1 on initial render, the routes haven't rendered
  // 2 the api.send occurs on mount, which appears to be the same time as the routes
  // TODO: check how to test with the router

  // unable to test for loading state because window mock completes the moment the app mounts
  // while in react it happens later in lifecycle

  return {
    ...utils,
    queryErrorText: () => screen.queryByText("Unable to access data"),
    querySidebar: () => screen.queryByRole("navigation"),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

it("when data (projects or types) fails to fetch, render error page and no sidebar", async () => {
  // mock window's api property
  const api = {
    send: vi.fn(() => {
      throw new Error("Mock failed response");
    }),
  };

  Object.defineProperty(window, "api", {
    value: api,
  });

  const { queryErrorText, querySidebar } = renderApp();

  // sidebar exists (although it's not showing loading state)
  expect(querySidebar()).toBeTruthy();

  // fetch for projects called once
  expect(window.api.send).toHaveBeenCalledOnce();

  // must wait for state changes to reflect in routes
  await waitFor(() => {
    expect(queryErrorText()).toBeTruthy();
    // check that route is error page route (once that page is made)
  });

  // fetch error removes sidebar
  expect(querySidebar()).toBeNull();
});
