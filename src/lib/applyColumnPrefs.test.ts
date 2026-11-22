import {
  applyColumnPrefs,
  defaultHiddenAccessors,
  resolveHiddenAccessors,
} from "./applyColumnPrefs";
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

describe("applyColumnPrefs — optional (defaultHidden) columns", () => {
  const catalog: HeaderColumn[] = [
    { value: "Name", accessor: "name" },
    { value: "RNC", accessor: "rnc" },
    { value: "Address", accessor: "address", defaultHidden: true },
    { value: "Created", accessor: "createdAt", defaultHidden: true },
  ];
  const accessors = (headers: HeaderColumn[]) =>
    headers.map((h) => h.accessor).join(",");

  it("start hidden without a pref", () => {
    expect(accessors(applyColumnPrefs(catalog))).toBe("name,rnc");
    expect(defaultHiddenAccessors(catalog)).toEqual(["address", "createdAt"]);
  });

  it("show once the user switched them on", () => {
    const pref = {
      order: ["name", "address", "rnc", "createdAt"],
      hidden: ["createdAt"],
    };
    expect(accessors(applyColumnPrefs(catalog, pref))).toBe("name,address,rnc");
  });

  it("an optional column shipped after the user saved stays hidden", () => {
    const pref = { order: ["name", "rnc", "address"], hidden: [] };
    expect(resolveHiddenAccessors(catalog, pref)).toEqual(["createdAt"]);
    expect(accessors(applyColumnPrefs(catalog, pref))).toBe("name,rnc,address");
  });

  it("a pinned column is never hidden by default", () => {
    expect(
      defaultHiddenAccessors([
        { value: "ID", accessor: "id", locked: true, defaultHidden: true },
      ]),
    ).toEqual([]);
  });

  it("resolveHiddenAccessors drops pinned and removed columns from a pref", () => {
    const pref = { order: ["name", "rnc"], hidden: ["gone", "name"] };
    const withLocked: HeaderColumn[] = [
      { value: "Name", accessor: "name", locked: true },
      { value: "RNC", accessor: "rnc" },
    ];
    expect(resolveHiddenAccessors(withLocked, pref)).toEqual([]);
  });
});
