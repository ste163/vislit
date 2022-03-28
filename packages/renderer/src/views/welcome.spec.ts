import { cleanup, render, screen } from "@testing-library/vue";
import { it, expect, afterEach, vi } from "vitest";
import Welcome from "./welcome.vue";
import { fireEvent } from "@testing-library/dom";

afterEach(() => cleanup());

it("renders loading state while isLoading is true", () => {
  render(Welcome, {
    props: {
      isLoading: true,
    },
  });
  expect(screen.getByTestId("loading-welcome")).toBeTruthy();
});

it.skip("renders error message if unable to fetch default data path location", () => {
  // mock the return value as undefined
  // render
  // error text should exist
});

it("renders page when loaded and calls import data, change save location, and create project when buttons clicked", async () => {
  // mock window's api property
  Object.defineProperty(window, "api", {
    value: {
      send: vi.fn(() => "/default/vislit-data"),
    },
  });

  render(Welcome, {
    props: {
      isLoading: false,
    },
  });

  // is not loading
  expect(screen.queryByTestId("loading-welcome")).toBeNull();

  // fetched default saved data path on mount and renders it
  // TODO: fetch it

  // all headings exist
  const headings = screen.getAllByRole("heading");
  expect(headings[0].textContent).toBe("Welcome to Vislit!");
  // expect(headings[1].textContent).toBe("Import previous Vislit Data");
  expect(headings[2].textContent).toBe(
    "Choose a save location for your Vislit Data"
  );
  expect(headings[3].textContent).toBe("Create a Project");

  // clicking the import button calls ipcSend
  const importButton = screen.getAllByRole("button")[0];

  // eslint-disable-next-line testing-library/await-fire-event
  fireEvent.click(importButton); // userEvent is failing
  expect(window.api.send).toHaveBeenCalledTimes(2);

  // clicking save location calls ipcSend
  const changeLocationButton = screen.getAllByRole("button")[1];
  // eslint-disable-next-line testing-library/await-fire-event
  fireEvent.click(changeLocationButton);
  expect(window.api.send).toHaveBeenCalledTimes(3);

  // clicking create a project calls onCreateProject (either a passed in function), one from state, or elsewhere
});
