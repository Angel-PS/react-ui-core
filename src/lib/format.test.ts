import {
  formatDate,
  formatDecimal,
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
});
