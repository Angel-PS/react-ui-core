import { fireEvent, renderHook } from "@testing-library/react";
import { useGlobalHotkey } from "./useGlobalHotkey";

const press = (init: KeyboardEventInit) => {
  const event = new KeyboardEvent("keydown", { cancelable: true, ...init });
  document.dispatchEvent(event);
  return event;
};

describe("useGlobalHotkey", () => {
  it("fires on Cmd+K and on Ctrl+K, and prevents the browser default", () => {
    const onTrigger = vi.fn();
    renderHook(() =>
      useGlobalHotkey({ key: "k", meta: true, ctrl: true, onTrigger }),
    );
    const meta = press({ key: "k", metaKey: true });
    const ctrl = press({ key: "K", ctrlKey: true });
    expect(onTrigger).toHaveBeenCalledTimes(2);
    expect(meta.defaultPrevented).toBe(true);
    expect(ctrl.defaultPrevented).toBe(true);
  });

  it("ignores the key without the required modifier, and other keys", () => {
    const onTrigger = vi.fn();
    renderHook(() => useGlobalHotkey({ key: "k", meta: true, onTrigger }));
    const bare = press({ key: "k" });
    press({ key: "j", metaKey: true });
    press({ key: "k", ctrlKey: true }); // ctrl not requested
    expect(onTrigger).not.toHaveBeenCalled();
    expect(bare.defaultPrevented).toBe(false);
  });

  it("matches the bare key when no modifier is requested", () => {
    const onTrigger = vi.fn();
    renderHook(() => useGlobalHotkey({ key: "Escape", onTrigger }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it("detaches when disabled and on unmount", () => {
    const onTrigger = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ enabled }) => useGlobalHotkey({ key: "k", ctrl: true, onTrigger, enabled }),
      { initialProps: { enabled: false } },
    );
    press({ key: "k", ctrlKey: true });
    expect(onTrigger).not.toHaveBeenCalled();
    rerender({ enabled: true });
    press({ key: "k", ctrlKey: true });
    expect(onTrigger).toHaveBeenCalledTimes(1);
    unmount();
    press({ key: "k", ctrlKey: true });
    expect(onTrigger).toHaveBeenCalledTimes(1);
  });

  it("always calls the latest handler without re-subscribing", () => {
    const first = vi.fn();
    const second = vi.fn();
    const add = vi.spyOn(document, "addEventListener");
    const { rerender } = renderHook(
      ({ handler }) => useGlobalHotkey({ key: "k", ctrl: true, onTrigger: handler }),
      { initialProps: { handler: first } },
    );
    const subscriptions = add.mock.calls.filter(([type]) => type === "keydown").length;
    rerender({ handler: second });
    expect(add.mock.calls.filter(([type]) => type === "keydown").length).toBe(
      subscriptions,
    );
    press({ key: "k", ctrlKey: true });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    add.mockRestore();
  });
});
