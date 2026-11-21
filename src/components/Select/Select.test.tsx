import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Select } from "./Select";

const options = [
  { value: "do", label: "Dominican Republic" },
  { value: "us", label: "United States" },
];

describe("Select", () => {
  it("renders the options and the placeholder", () => {
    render(<Select options={options} placeholder="Pick one" defaultValue="" />);
    expect(screen.getByRole("option", { name: "Pick one" })).toBeDisabled();
    expect(
      screen.getByRole("option", { name: "United States" }),
    ).toBeInTheDocument();
  });

  it("associates the label with the control by name when no id is given", () => {
    render(<Select label="Country" name="country" options={options} />);
    expect(screen.getByLabelText("Country")).toHaveAttribute("id", "country");
  });

  it("prefers an explicit id over the name", () => {
    render(
      <Select label="Country" id="billing-country" name="country" options={options} />,
    );
    expect(screen.getByLabelText("Country")).toHaveAttribute(
      "id",
      "billing-country",
    );
  });

  it("associates the label even without id or name", () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });

  it("marks the control invalid and describes it with the error", () => {
    render(
      <Select label="Country" name="country" options={options} error="Required" />,
    );
    const select = screen.getByLabelText("Country");
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAccessibleDescription("Required");
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("renders a hint and includes it in the accessible description", () => {
    render(
      <Select
        label="Country"
        name="country"
        options={options}
        hint="Where the company is registered"
      />,
    );
    expect(screen.getByLabelText("Country")).toHaveAccessibleDescription(
      "Where the company is registered",
    );
  });

  it("shows a skeleton while loading", () => {
    const { container } = render(<Select options={options} loading />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(container.querySelector(".skeleton")).toBeInTheDocument();
  });

  it("forwards its ref and change events", () => {
    const ref = createRef<HTMLSelectElement>();
    const onChange = vi.fn();
    render(<Select ref={ref} options={options} onChange={onChange} />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "us" } });
    expect(ref.current?.value).toBe("us");
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
