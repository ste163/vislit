import { cleanup, render, screen, waitFor } from "@testing-library/vue";
import { it, expect, afterEach, vi } from "vitest";
import { fireEvent } from "@testing-library/dom";
import Welcome from "./welcome.vue";

const mockSend = vi.fn(() => "");

afterEach(() => cleanup());

const renderWelcome = ({ isLoading = false, mockDataPathResult = "" }) => {
  mockSend.mockReset();
  mockSend.mockImplementationOnce(() => mockDataPathResult as any);
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
    // This is a false-positive error as we're re-defining the mock function
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

it("emits error event if fetching data path fails", async () => {
  const { emitted } = renderWelcome({
    isLoading: false,
  });
  // must wait for the in-flight promise to complete
  await waitFor(() => {
    expect(emitted()["criticalErrorOccurred"]).toBeTruthy();
  });
});

it("renders loading state while isLoading is true", () => {
  renderWelcome({ isLoading: true });
  expect(screen.getByTestId("loading-welcome")).toBeTruthy();
});

it("renders page when loaded; button clicks call: import data, change save location, and create project", async () => {
  const { emitted } = renderWelcome({
    mockDataPathResult: "/default/vislit-data",
  });
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
  await fireEvent.click(importButton);
  expect(window.api?.send).toHaveBeenCalledTimes(2); // called twice as first call is during mount

  // clicking save location calls ipcSend
  const changeLocationButton = screen.getAllByRole("button")[1];
  await fireEvent.click(changeLocationButton);
  expect(window.api?.send).toHaveBeenCalledTimes(3);

  // clicking createProject calls create project event
  const createProjectButton = screen.getAllByRole("button")[2];
  await fireEvent.click(createProjectButton);
  expect(emitted()["openProjectForm"]).toBeTruthy();
});
