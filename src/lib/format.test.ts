import {
  formatDate,
  formatDecimal,
  formatRelativeTime,
  getInitials,
  cleanStatusValue,
  capitalizeWords,
  formatCompact,
  formatDateIntl,
  formatDateRangeIntl,
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

  describe("formatCompact", () => {
    it("keeps small numbers whole", () => {
      expect(formatCompact(0)).toBe("0");
      expect(formatCompact(999.4)).toBe("999");
    });
    it("uses K / M with one decimal only while it informs", () => {
      expect(formatCompact(1250)).toBe("1.3K");
      expect(formatCompact(12_500)).toBe("13K");
      expect(formatCompact(4_200_000)).toBe("4.2M");
      expect(formatCompact(42_000_000)).toBe("42M");
    });
    it("keeps the sign of negatives", () => {
      expect(formatCompact(-1500)).toBe("-1.5K");
    });
    it("falls back to 0 for non-finite input", () => {
      expect(formatCompact(Number.NaN)).toBe("0");
      expect(formatCompact(Number.POSITIVE_INFINITY)).toBe("0");
    });
  });

  // Intl may separate with thin / no-break spaces; compare on plain spaces.
  const plain = (s: string) => s.replace(/\s+/g, " ");
  const DAY: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  describe("formatDateIntl", () => {
    it("keeps a bare YYYY-MM-DD on its calendar day in any zone", () => {
      expect(
        plain(formatDateIntl("2026-10-01", DAY, "en-US", "America/Santo_Domingo")),
      ).toBe("Oct 1, 2026");
    });
    it("reads an instant in the given time zone", () => {
      // 03:30Z on Oct 1 is still Sep 30 in Santo Domingo (UTC-4).
      expect(
        plain(formatDateIntl("2026-10-01T03:30:00Z", DAY, "en-US", "America/Santo_Domingo")),
      ).toBe("Sep 30, 2026");
      expect(plain(formatDateIntl("2026-10-01T03:30:00Z", DAY, "en-US", "UTC"))).toBe(
        "Oct 1, 2026",
      );
    });
    it("honours the locale", () => {
      // Exact Spanish punctuation varies across ICU versions ("1 oct 2026",
      // "1 oct de 2026"), so assert the localized month, not the whole string.
      const es = plain(formatDateIntl("2026-10-01", DAY, "es-DO"));
      expect(es).toMatch(/^1 oct/);
      expect(es).toContain("2026");
    });
    it("returns an empty string for missing or invalid input", () => {
      expect(formatDateIntl(null)).toBe("");
      expect(formatDateIntl("")).toBe("");
      expect(formatDateIntl("nope")).toBe("");
    });
  });

  describe("formatDateRangeIntl", () => {
    it("keeps a date-only range on its calendar days", () => {
      expect(
        plain(
          formatDateRangeIntl("2026-10-01", "2026-10-15", DAY, "en-US", "America/Santo_Domingo"),
        ),
      ).toBe("Oct 1 – 15, 2026");
    });
    it("spans months and years", () => {
      expect(plain(formatDateRangeIntl("2025-12-20", "2026-01-15", DAY, "en-US"))).toBe(
        "Dec 20, 2025 – Jan 15, 2026",
      );
    });
    it("reads instants in the given time zone", () => {
      expect(
        plain(
          formatDateRangeIntl(
            "2026-10-01T03:30:00Z",
            "2026-10-15T16:00:00Z",
            DAY,
            "en-US",
            "America/Santo_Domingo",
          ),
        ),
      ).toBe("Sep 30 – Oct 15, 2026");
    });
    it("yields nothing for an invalid end rather than throwing", () => {
      expect(formatDateRangeIntl("2026-10-01", "nope", DAY)).toBe("");
    });
  });
});
