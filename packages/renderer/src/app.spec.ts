import { render, screen } from "@testing-library/vue";
import { expect, it, vi } from "vitest";
import App from "./app.vue";
import router from "./router";
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
  const window = {
    api: {
      send: () => {},
    },
  };

  // potential: make an abstraction layer for the window.api, otherwise I have to use window.api everywhere
  // an abstraction would allow for easier mocking! Then I don't have ts ignore and eslint errors

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const typeFetchMock = vi.spyOn(api, "send").mockImplementation(() => {
    throw new Error();
  });

  render(App, {
    global: {
      plugins: [router],
    },
  });

  expect(screen.getByText("Unable to access data")).toBeTruthy();
  expect(typeFetchMock).toHaveBeenCalledTimes(1);
});
