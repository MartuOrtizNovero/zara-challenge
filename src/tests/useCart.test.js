import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCart } from "../context/cart/useCart.js";

describe("useCart", () => {
  it("throws an error when used outside CartProvider", () => {
    expect(() => renderHook(() => useCart())).toThrow(
      "useCart must be used within a CartProvider.",
    );
  });
});
