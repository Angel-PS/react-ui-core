import { render, screen, fireEvent } from "@testing-library/react";
import { FormActions } from "./FormActions";

describe("FormActions", () => {
  it("renders Cancel + Create by default", () => {
    render(<FormActions />);
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "Create" })).toHaveAttribute("type", "submit");
  });

  it("reads Update in edit mode", () => {
    render(<FormActions isEdit />);
    expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Create" })).not.toBeInTheDocument();
  });

  it("disables the submit button while pending", () => {
    render(<FormActions isPending />);
    const submit = screen.getByRole("button", { name: "Create" });
    expect(submit).toBeDisabled();
    expect(submit).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Cancel" })).not.toBeDisabled();
  });

  it("calls onCancel and does not submit the enclosing form", () => {
    const onCancel = vi.fn();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <FormActions onCancel={onCancel} />
      </form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Create" }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("merges custom labels over the defaults", () => {
    render(<FormActions isEdit labels={{ cancel: "Cancelar", update: "Guardar" }} />);
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar" })).toBeInTheDocument();
  });

  it("disables submit without a spinner via submitDisabled", () => {
    render(<FormActions submitDisabled />);
    const submit = screen.getByRole("button", { name: "Create" });
    expect(submit).toBeDisabled();
    expect(submit).not.toHaveAttribute("aria-busy", "true");
  });

  it("can disable Cancel and give it a neutral style", () => {
    render(<FormActions cancelDisabled cancelVariant="classic" />);
    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toBeDisabled();
    expect(cancel.className).not.toContain("bg-red-500");
  });

  it("lets submitLabel override the create/update verb", () => {
    render(<FormActions isEdit submitLabel="Save" />);
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("type", "submit");
  });

  it("does not leak 'undefined' into the class list", () => {
    const { container } = render(<FormActions />);
    expect((container.firstElementChild as HTMLElement).className).not.toContain("undefined");
  });
});
