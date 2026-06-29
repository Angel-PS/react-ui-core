import { applyColumnPrefs } from "./applyColumnPrefs";
import type { HeaderColumn } from "../types";

const cols: HeaderColumn[] = [
  { value: "Name", accessor: "name" },
  { value: "Email", accessor: "email" },
  { value: "Status", accessor: "status" },
];

describe("applyColumnPrefs", () => {
  it("returns the catalog unchanged when no pref is given", () => {
    expect(applyColumnPrefs(cols)).toEqual(cols);
  });

  it("reorders by pref.order", () => {
    const r = applyColumnPrefs(cols, {
      order: ["status", "name", "email"],
      hidden: [],
    });
    expect(r.map((c) => c.accessor)).toEqual(["status", "name", "email"]);
  });

  it("drops columns listed in pref.hidden", () => {
    const r = applyColumnPrefs(cols, {
      order: ["name", "email", "status"],
      hidden: ["email"],
    });
    expect(r.map((c) => c.accessor)).toEqual(["name", "status"]);
  });

  it("appends catalog columns missing from the saved order", () => {
    const r = applyColumnPrefs(cols, { order: ["name"], hidden: [] });
    expect(r.map((c) => c.accessor)).toEqual(["name", "email", "status"]);
  });

  it("never hides a locked column", () => {
    const locked: HeaderColumn[] = [
      { value: "Name", accessor: "name", locked: true },
      { value: "Email", accessor: "email" },
    ];
    const r = applyColumnPrefs(locked, {
      order: ["name", "email"],
      hidden: ["name", "email"],
    });
    expect(r.map((c) => c.accessor)).toContain("name");
  });

  it("always keeps at least one column when a pref would hide everything", () => {
    const r = applyColumnPrefs(cols, {
      order: ["name", "email", "status"],
      hidden: ["name", "email", "status"],
    });
    expect(r).toHaveLength(1);
  });
});
