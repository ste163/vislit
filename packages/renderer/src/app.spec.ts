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
  // // but it's too fast for checking if the loading state is happening
  // TODO: check how to test with the router

  return {
    ...utils,
    findErrorText: () => screen.findByText("Unable to access data"),
    querySidebar: () => screen.queryByRole("navigation"),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

it("when data (projects or types) fails to fetch, render error page and no sidebar", async () => {
  // mock window's api property
  const api = {
    send: vi.fn().mockImplementationOnce(() => {
      throw new Error("Mock failed response");
    }),
  };

  Object.defineProperty(window, "api", {
    value: api,
  });

  const { findErrorText, querySidebar } = renderApp();

  // sidebar exists (although it's not showing loading state)
  expect(querySidebar()).toBeTruthy();

  // fetch for projects called once before erroring out
  expect(window.api.send).toHaveBeenCalledOnce(); // only called once because fn mock is only once
  // must wait for state changes to reflect
  expect(await findErrorText()).toBeTruthy();
  // sidebar doesn't exist when there's a major fetch error
  expect(querySidebar()).toBeNull();
});
