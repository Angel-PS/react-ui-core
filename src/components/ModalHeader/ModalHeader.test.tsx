import { render, screen, fireEvent } from "@testing-library/react";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { ModalHeader } from "./ModalHeader";

const base = {
  title: "Edit role",
  createTitle: "New role",
  subtitle: "Choose what members of this role can do",
  icon: faUsers,
  onClose: () => {},
};

describe("ModalHeader", () => {
  it("shows the create title and plain subtitle in create mode", () => {
    render(<ModalHeader {...base} isEdit={false} id={42} />);
    expect(screen.getByRole("heading", { name: "New role" })).toBeInTheDocument();
    expect(screen.getByText("Choose what members of this role can do")).toBeInTheDocument();
    expect(screen.queryByText(/ID #42/)).not.toBeInTheDocument();
  });

  it("shows the edit title and prefixes the id in edit mode", () => {
    render(<ModalHeader {...base} isEdit id={42} />);
    expect(screen.getByRole("heading", { name: "Edit role" })).toBeInTheDocument();
    expect(
      screen.getByText("ID #42 · Choose what members of this role can do"),
    ).toBeInTheDocument();
  });

  it("omits the id prefix when editing without an id", () => {
    render(<ModalHeader {...base} isEdit />);
    expect(screen.getByText("Choose what members of this role can do")).toBeInTheDocument();
  });

  it("formats the id through labels.id", () => {
    render(<ModalHeader {...base} isEdit id={7} labels={{ id: (id) => `N.º ${id}` }} />);
    expect(screen.getByText("N.º 7 · Choose what members of this role can do")).toBeInTheDocument();
  });

  it("has a non-submitting, labelled close button", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <ModalHeader {...base} isEdit={false} onClose={onClose} labels={{ close: "Cerrar" }} />
      </form>,
    );
    const close = screen.getByRole("button", { name: "Cerrar" });
    expect(close).toHaveAttribute("type", "button");
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("puts headingId on the h2 so a dialog can be labelled by it", () => {
    render(
      <div role="dialog" aria-labelledby="role-title">
        <ModalHeader {...base} isEdit={false} headingId="role-title" />
      </div>,
    );
    expect(screen.getByRole("dialog", { name: "New role" })).toBeInTheDocument();
  });
});
