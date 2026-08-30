import {
  formatDate,
  formatDecimal,
  formatRelativeTime,
  getInitials,
  cleanStatusValue,
  capitalizeWords,
} from "./format";

describe("format", () => {
  describe("formatDate", () => {
    it("reformats a bare YYYY-MM-DD string to DD-MM-YYYY without timezone shift", () => {
      expect(formatDate("2026-06-28")).toBe("28-06-2026");
    });
    it("keeps YYYY-MM-DD when requested", () => {
      expect(formatDate("2026-06-28", "YYYY-MM-DD")).toBe("2026-06-28");
    });
    it("returns empty string for empty/nullish input", () => {
      expect(formatDate("")).toBe("");
      expect(formatDate(null)).toBe("");
      expect(formatDate(undefined)).toBe("");
    });
  });

  describe("formatDecimal", () => {
    it("formats with thousands separators and two decimals", () => {
      expect(formatDecimal(1234.5)).toBe("1,234.50");
    });
    it("falls back to 0.00 for NaN", () => {
      expect(formatDecimal(NaN)).toBe("0.00");
    });
  });

  describe("getInitials", () => {
    it("takes the first letter of up to two words, uppercased", () => {
      expect(getInitials("john doe")).toBe("JD");
    });
    it("trims and handles a single word", () => {
      expect(getInitials("  alice  ")).toBe("A");
    });
  });

  describe("cleanStatusValue", () => {
    it("humanizes snake_case", () => {
      expect(cleanStatusValue("pending_payment")).toBe("Pending payment");
    });
  });

  describe("capitalizeWords", () => {
    it("capitalizes each word", () => {
      expect(capitalizeWords("hello world")).toBe("Hello World");
    });
    it("returns empty string for empty input", () => {
      expect(capitalizeWords("")).toBe("");
    });
  });

  describe("formatRelativeTime", () => {
    // `now` is passed explicitly everywhere: the function stays pure, so these
    // assertions never depend on the wall clock.
    const now = new Date("2026-08-30T14:32:00Z").getTime();

    it("picks the largest unit that still fits", () => {
      expect(formatRelativeTime(now - 45_000, now)).toBe("45 seconds ago");
      expect(formatRelativeTime(now - 5 * 60_000, now)).toBe("5 minutes ago");
      expect(formatRelativeTime(now - 3 * 3_600_000, now)).toBe("3 hours ago");
    });

    it("uses the numeric:auto wording for a one-unit gap", () => {
      expect(formatRelativeTime(now - 24 * 3_600_000, now)).toBe("yesterday");
    });

    it("formats future instants too", () => {
      expect(formatRelativeTime(now + 2 * 60_000, now)).toBe("in 2 minutes");
    });

    it("honours the locale", () => {
      expect(formatRelativeTime(now - 5 * 60_000, now, "es")).toBe(
        "hace 5 minutos",
      );
    });

    it("accepts Date and ISO string inputs", () => {
      expect(formatRelativeTime(new Date(now - 60_000), now)).toBe(
        "1 minute ago",
      );
      expect(
        formatRelativeTime(new Date(now - 60_000).toISOString(), now),
      ).toBe("1 minute ago");
    });

    it("returns an empty string for missing or invalid input", () => {
      expect(formatRelativeTime(null, now)).toBe("");
      expect(formatRelativeTime(undefined, now)).toBe("");
      expect(formatRelativeTime("not a date", now)).toBe("");
    });
  });
});
