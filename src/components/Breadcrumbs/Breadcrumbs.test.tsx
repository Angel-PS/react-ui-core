import { render, screen, fireEvent } from "@testing-library/react";
import { Breadcrumbs, collapseTrail, type BreadcrumbItem } from "./Breadcrumbs";

const trail: BreadcrumbItem[] = [
  { label: "Home", to: "/" },
  { label: "Catalog" },
  { label: "Products", to: "/products" },
  { label: "Edit" },
];

describe("collapseTrail", () => {
  it("keeps short trails intact", () => {
    const r = collapseTrail(trail, 4);
    expect(r).toHaveLength(4);
    expect(r.every((x) => x.kind === "item")).toBe(true);
  });

  it("collapses long trails to first / … / last 2", () => {
    const long = [...trail, { label: "Variant" }, { label: "Pricing" }];
    const r = collapseTrail(long, 4);
    expect(r[0]).toMatchObject({ kind: "item" });
    expect(r[1].kind).toBe("ellipsis");
    expect(r).toHaveLength(4); // head + ellipsis + 2 tail
  });
});

describe("Breadcrumbs", () => {
  it("renders nothing when empty", () => {
    const { container } = render(<Breadcrumbs items={[]} onNavigate={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the current page non-clickable and links elsewhere", () => {
    render(<Breadcrumbs items={trail} onNavigate={() => {}} />);
    const current = screen.getByText("Edit");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).not.toBe("A");
    expect(screen.getByText("Products").tagName).toBe("A");
  });

  it("calls onNavigate for a clickable crumb", () => {
    const onNavigate = vi.fn();
    render(<Breadcrumbs items={trail} onNavigate={onNavigate} />);
    fireEvent.click(screen.getByText("Products"));
    expect(onNavigate).toHaveBeenCalledWith("/products");
  });
});
