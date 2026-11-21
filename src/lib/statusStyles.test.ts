import { getStatusStyle, statusStyles } from "./statusStyles";

describe("getStatusStyle", () => {
  it("is case-insensitive", () => {
    expect(getStatusStyle("PAID")).toBe(statusStyles.paid);
  });

  it("falls back to a neutral slate badge for unknown keys", () => {
    expect(getStatusStyle("no-such-status").badge).toContain("bg-slate-100");
  });

  it("knows the generic document lifecycle statuses", () => {
    // Without these entries "annulled" would render exactly like "created".
    expect(getStatusStyle("annulled").badge).toContain("bg-red-50");
    expect(getStatusStyle("signed").badge).toContain("bg-blue-50");
    for (const key of [
      "not_processed",
      "sent",
      "critical",
      "recommended",
      "optional",
      "withdrawn",
      "created",
      "received",
      "unknown",
      "paused",
      "not_configured",
    ]) {
      expect({ key, style: statusStyles[key] }).toEqual({
        key,
        style: expect.objectContaining({ badge: expect.any(String) }),
      });
    }
  });

  it("lets overrides add app-specific statuses and win over defaults", () => {
    const overrides = {
      pin_assigned: { badge: "bg-green-50", dot: "bg-green-500" },
      paid: { badge: "custom-paid", dot: "custom-dot" },
    };
    expect(getStatusStyle("pin_assigned", overrides).badge).toBe("bg-green-50");
    expect(getStatusStyle("Paid", overrides).badge).toBe("custom-paid");
    // The shared map is never mutated.
    expect(statusStyles.pin_assigned).toBeUndefined();
    expect(statusStyles.paid.badge).not.toBe("custom-paid");
  });
});
