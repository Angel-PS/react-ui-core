import { render, screen, fireEvent } from "@testing-library/react";
import { faBox, faFileInvoiceDollar } from "@fortawesome/free-solid-svg-icons";
import { NewActionMenu, type NewActionGroup } from "./NewActionMenu";

const groups: NewActionGroup[] = [
  {
    title: "Sales",
    items: [
      { id: "invoice", label: "Invoice", icon: faFileInvoiceDollar, path: "/invoices/add", primary: true },
    ],
  },
  {
    title: "Catalog",
    items: [
      { id: "product", label: "Product", icon: faBox, path: "/products/add" },
      { id: "soon", label: "Later", icon: faBox, disabled: true },
    ],
  },
];

describe("NewActionMenu", () => {
  it("opens on trigger click and lists options", () => {
    render(<NewActionMenu groups={groups} onSelect={() => {}} />);
    expect(screen.queryByText("Invoice")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /new/i }));
    expect(screen.getByText("Invoice")).toBeInTheDocument();
    expect(screen.getByText("Product")).toBeInTheDocument();
  });

  it("calls onSelect with the option path", () => {
    const onSelect = vi.fn();
    render(<NewActionMenu groups={groups} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /new/i }));
    fireEvent.click(screen.getByText("Product"));
    expect(onSelect).toHaveBeenCalledWith("/products/add");
  });

  it("does not navigate from a disabled option", () => {
    const onSelect = vi.fn();
    render(<NewActionMenu groups={groups} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /new/i }));
    fireEvent.click(screen.getByText("Later"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});
