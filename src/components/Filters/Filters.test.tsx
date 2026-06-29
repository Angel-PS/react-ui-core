import { renderHook, act } from "@testing-library/react";
import { keysForFilter, readFilterValues, writeFilterPatch } from "./serialize";
import { isFilterApplied, filterDisplayValue } from "./helpers";
import { useFilterController } from "./useFilterController";
import type { FilterDef } from "./types";

const segmented: FilterDef = {
  kind: "segmented",
  key: "status",
  options: [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
  ],
};

const select: FilterDef = {
  kind: "select",
  key: "branch",
  options: [
    { value: "", label: "All" },
    { value: "1", label: "Main" },
  ],
};

describe("filters serialize/helpers", () => {
  it("keysForFilter returns from/to for a dateRange", () => {
    const dr: FilterDef = {
      kind: "dateRange",
      key: "d",
      fromKey: "from",
      toKey: "to",
      fromLabel: "From",
      toLabel: "To",
    };
    expect(keysForFilter(dr)).toEqual(["from", "to"]);
  });

  it("readFilterValues seeds the segmented default (first option)", () => {
    const v = readFilterValues([segmented], new URLSearchParams());
    expect(v.status).toBe("");
  });

  it("writeFilterPatch sets non-empty, deletes empty, and resets page", () => {
    const next = writeFilterPatch(new URLSearchParams("page=3&status=old"), {
      status: "active",
    });
    expect(next.get("status")).toBe("active");
    expect(next.get("page")).toBeNull();
  });

  it("isFilterApplied is false for a default segmented and true for a set select", () => {
    expect(isFilterApplied(segmented, { status: "" })).toBe(false);
    expect(isFilterApplied(select, { branch: "1" })).toBe(true);
  });

  it("filterDisplayValue resolves a select's option label", () => {
    expect(filterDisplayValue(select, { branch: "1" })).toBe("Main");
  });
});

describe("useFilterController", () => {
  it("seeds defaults and updates via setValue", () => {
    const { result } = renderHook(() => useFilterController([segmented, select]));
    expect(result.current.values.status).toBe("");
    act(() => result.current.setValue("branch", "1"));
    expect(result.current.values.branch).toBe("1");
  });

  it("clear resets to defaults and fires onChange", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useFilterController([select], { onChange }),
    );
    act(() => result.current.setValue("branch", "1"));
    act(() => result.current.clear());
    expect(result.current.values.branch).toBe("");
    expect(onChange).toHaveBeenCalled();
  });
});
