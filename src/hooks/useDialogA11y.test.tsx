import { act, fireEvent, render, screen } from "@testing-library/react";
import { useId, useRef, useState } from "react";
import { useDialogA11y } from "./useDialogA11y";

/** A bare custom dialog built on the hook, the way a consumer would. */
const Dialog = ({
  name,
  onEscape,
  children,
}: {
  name: string;
  onEscape?: () => void;
  children?: React.ReactNode;
}) => {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { onDialogKeyDown } = useDialogA11y({ id, dialogRef: ref, onEscape });
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={name}
      tabIndex={-1}
      onKeyDown={onDialogKeyDown}
    >
      {children}
    </div>
  );
};

describe("useDialogA11y", () => {
  it("calls onEscape on Escape", () => {
    const onEscape = vi.fn();
    render(<Dialog name="a" onEscape={onEscape} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onEscape).toHaveBeenCalledTimes(1);
  });

  it("does nothing on Escape when onEscape is omitted", () => {
    render(<Dialog name="a" />);
    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      cancelable: true,
    });
    document.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
  });

  it("only the top-most of two stacked dialogs reacts to Escape", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Dialog name="first" onEscape={first} />);
    rerender(
      <>
        <Dialog name="first" onEscape={first} />
        <Dialog name="second" onEscape={second} />
      </>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  it("hands Escape back to the lower dialog once the top one unmounts", () => {
    const first = vi.fn();
    const Harness = () => {
      const [open, setOpen] = useState(true);
      return (
        <>
          <Dialog name="first" onEscape={first} />
          {open && <Dialog name="second" onEscape={() => setOpen(false)} />}
        </>
      );
    };
    // mount the lower dialog first so the stack order matches real use
    const { rerender } = render(<Dialog name="first" onEscape={first} />);
    rerender(<Harness />);
    fireEvent.keyDown(document, { key: "Escape" }); // closes "second"
    expect(screen.queryByRole("dialog", { name: "second" })).toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(first).toHaveBeenCalledTimes(1);
  });

  it("focuses the dialog on mount and restores focus to the trigger after unmount", async () => {
    const Harness = () => {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>open</button>
          {open && <Dialog name="d" onEscape={() => setOpen(false)} />}
        </>
      );
    };
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "open" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    await act(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
    expect(trigger).toHaveFocus();
  });

  it("with nothing focusable inside, Tab keeps focus on the dialog shell", () => {
    render(<Dialog name="empty" />);
    const dialog = screen.getByRole("dialog");
    dialog.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(dialog).toHaveFocus();
  });
});
