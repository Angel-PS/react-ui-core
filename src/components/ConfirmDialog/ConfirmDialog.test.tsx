import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "./ConfirmDialog";

const base = {
  onCancel: () => {},
  onConfirm: () => {},
  title: "Delete?",
  description: "Are you sure?",
  confirmLabel: "Delete",
  cancelLabel: "Cancel",
};

describe("ConfirmDialog", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<ConfirmDialog isOpen={false} {...base} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders title, description and both buttons when open", () => {
    render(<ConfirmDialog isOpen {...base} />);
    expect(screen.getByText("Delete?")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("fires onConfirm and onCancel", () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    render(
      <ConfirmDialog
        isOpen
        {...base}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("disables the cancel button while loading", () => {
    render(<ConfirmDialog isOpen {...base} isLoading />);
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
  });
});
