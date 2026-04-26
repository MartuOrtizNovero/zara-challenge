import { describe, it, expect } from "vitest";
import { formatPrice } from "../utils/formatPrice.js";

describe("formatPrice", () => {
  it("formats a price with EUR code", () => {
    expect(formatPrice(999)).toContain("EUR");
    expect(formatPrice(999)).toContain("999");
  });

  it("formats zero correctly", () => {
    expect(formatPrice(0)).toContain("0");
    expect(formatPrice(0)).toContain("EUR");
  });

  it("rounds decimals and shows no fraction digits", () => {
    expect(formatPrice(999.99)).not.toContain(".");
    expect(formatPrice(999.99)).not.toContain(",99");
  });

  it("formats large numbers", () => {
    const result = formatPrice(1299);
    expect(result).toContain("1");
    expect(result).toContain("299");
    expect(result).toContain("EUR");
  });
});
