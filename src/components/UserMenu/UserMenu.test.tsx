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
});
