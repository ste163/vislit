import { cleanup, render, screen, waitFor } from "@testing-library/vue";
import { it, expect, afterEach, vi } from "vitest";
import Welcome from "./welcome.vue";
import { fireEvent } from "@testing-library/dom";

const mockSend = vi.fn(() => "");

afterEach(() => cleanup());

const renderWelcome = ({ isLoading = false, mockDataPathResult = "" }) => {
  mockSend.mockReset();
  mockSend.mockImplementationOnce(() => mockDataPathResult);
  try {
    if (!window.api) {
      Object.defineProperty(window, "api", {
        value: {
          send: mockSend,
        },
      });
    }
  } catch (_) {
    // This error is trying to redefine the already defined api property
    // This is a false positive error as we're re-defining the mock function
    // Not the property itself
  }
  const utils = render(Welcome, {
    props: {
      isLoading,
    },
  });

  return {
    ...utils,
  };
};

it("renders loading state while isLoading is true", () => {
  renderWelcome({ isLoading: true });
  expect(screen.getByTestId("loading-welcome")).toBeTruthy();
});

it("renders error message if unable to fetch default data path location", async () => {
  renderWelcome({ isLoading: false });
  await waitFor(() => {
    expect(screen.getByTestId("data-path").textContent).toContain("Error");
  });
});

it("renders page when loaded; button clicks call: import data, change save location, and create project", async () => {
  const DEFAULT_DATA_PATH = "/default/vislit-data";
  const { emitted } = renderWelcome({ mockDataPathResult: DEFAULT_DATA_PATH });
  // is not loading
  expect(screen.queryByTestId("loading-welcome")).toBeNull();
  // renders default data path after mount state updates
  await waitFor(() => {
    expect(screen.getByTestId("data-path").textContent).toContain(
      "vislit-data"
    );
  });
  // all headings exist
  expect(screen.getAllByRole("heading").length).toBe(4);

  // clicking the import button calls ipcSend
  const importButton = screen.getAllByRole("button")[0];
  // eslint-disable-next-line testing-library/await-fire-event
  fireEvent.click(importButton); // userEvent is failing
  expect(window.api?.send).toHaveBeenCalledTimes(2); // called twice as first call is during mount

  // clicking save location calls ipcSend
  const changeLocationButton = screen.getAllByRole("button")[1];
  // eslint-disable-next-line testing-library/await-fire-event
  fireEvent.click(changeLocationButton);
  expect(window.api?.send).toHaveBeenCalledTimes(3);

  // clicking createProject calls create project event
  const createProjectButton = screen.getAllByRole("button")[2];
  // eslint-disable-next-line testing-library/await-fire-event
  fireEvent.click(createProjectButton);
  expect(emitted()["openProjectForm"]).toBeTruthy();
});
