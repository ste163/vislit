import {
  cleanup,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/vue";
import { afterEach, expect, it } from "vitest";
import NotificationContainerItem from "./notification-container-item.vue";

afterEach(() => cleanup());

const renderItem = ({
  id = "1",
  type = "success",
  message = "testMessage",
}) => {
  const utils = render(NotificationContainerItem, {
    props: {
      id,
      type,
      message,
    },
  });
  return {
    ...utils,
  };
};

it("only renders if there is a message", () => {
  renderItem({ id: "1", type: "success", message: null as any });
  expect(screen.queryByRole("button")).toBeNull();
});

it("renders error item if type is error", () => {
  renderItem({ id: "1", type: "error", message: "test" });
  // TODO: expect the icon to be X
  expect(screen.getByText("test")).toBeTruthy();
  expect(screen.getByRole("button")).toBeTruthy();
});

it.skip("renders success item if type is success", () => {
  renderItem({ id: "1", type: "success", message: "test" });
  // TODO: expect the icon to be checkmark
  expect(screen.getByText("test")).toBeTruthy();
  expect(screen.getByRole("button")).toBeTruthy();
});

it("clicking close button emits close event", async () => {
  const { emitted } = renderItem({ id: "1", type: "success", message: "test" });
  await fireEvent.click(screen.getByRole("button"));
  expect(emitted()["close"]).toBeTruthy();
});

it("emits close event after timeout", async () => {
  const { emitted } = renderItem({ id: "1", type: "success", message: "test" });
  await waitFor(
    () => {
      expect(emitted()["close"]).toBeTruthy();
    },
    { timeout: 6000 }
  );
});
