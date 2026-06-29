import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "./LanguageSwitcher";

const languages = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

describe("LanguageSwitcher", () => {
  it("shows the current code and opens the menu", () => {
    render(<LanguageSwitcher current="es" languages={languages} onChange={() => {}} />);
    expect(screen.getByText("es")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    expect(screen.getByRole("menuitemradio", { name: "Español" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("calls onChange for a different language only", () => {
    const onChange = vi.fn();
    render(<LanguageSwitcher current="es" languages={languages} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: "Español" }));
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Change language" }));
    fireEvent.click(screen.getByRole("menuitemradio", { name: "English" }));
    expect(onChange).toHaveBeenCalledWith("en");
  });
});
