import { render, screen, fireEvent } from "@testing-library/react";
import { UserMenu, type UserMenuItem } from "./UserMenu";

const items: UserMenuItem[] = [
  { key: "settings", label: "Settings", onClick: () => {} },
  { key: "logout", label: "Logout", onClick: () => {}, variant: "danger" },
];

describe("UserMenu", () => {
  it("renders name, username and derived initials", () => {
    render(<UserMenu fullName="Ada Lovelace" username="ada" items={items} />);
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText("ada")).toBeInTheDocument();
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("opens the menu and fires an item's onClick", () => {
    const onLogout = vi.fn();
    render(
      <UserMenu
        fullName="Ada Lovelace"
        username="ada"
        items={[{ key: "logout", label: "Logout", onClick: onLogout, variant: "danger" }]}
      />,
    );
    expect(screen.queryByRole("menuitem")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "User menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Logout" }));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("shows a busy skeleton instead of the name while loading", () => {
    render(<UserMenu fullName="Unknown Unknown" username="" items={items} loading />);
    expect(screen.queryByText("Unknown Unknown")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "User menu" })).not.toBeInTheDocument();
    expect(screen.getByLabelText("User menu")).toHaveAttribute("aria-busy", "true");
  });

  it("shows the name from `sm` by default", () => {
    render(<UserMenu fullName="Ada Lovelace" username="ada" items={items} />);
    const nameBlock = screen.getByText("Ada Lovelace").parentElement;
    expect(nameBlock).toHaveClass("hidden", "sm:block");
  });

  it("can hold the name back until `xl` (avatar-only on tablets)", () => {
    render(
      <UserMenu fullName="Ada Lovelace" username="ada" items={items} nameBreakpoint="xl" />,
    );
    const nameBlock = screen.getByText("Ada Lovelace").parentElement;
    expect(nameBlock).toHaveClass("hidden", "xl:block");
    expect(nameBlock).not.toHaveClass("sm:block");
  });
});
