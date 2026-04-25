import { describe, it, expect, beforeEach } from "vitest";
import {
  getStoredCartItems,
  saveCartItems,
  clearStoredCartItems,
} from "../context/cart/cartStorage.js";

const STORAGE_KEY = "zara-challenge-cart";

const mockItems = [
  {
    cartItemId: "abc-123",
    name: "iPhone 15",
    price: 999,
  },
];

beforeEach(() => {
  localStorage.clear();
});

describe("cartStorage", () => {
  it("getStoredCartItems returns an empty array when storage is empty", () => {
    expect(getStoredCartItems()).toEqual([]);
  });

  it("saveCartItems persists items in localStorage", () => {
    saveCartItems(mockItems);
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toEqual(mockItems);
  });

  it("getStoredCartItems returns the persisted items", () => {
    saveCartItems(mockItems);
    expect(getStoredCartItems()).toEqual(mockItems);
  });

  it("clearStoredCartItems removes the key from localStorage", () => {
    saveCartItems(mockItems);
    clearStoredCartItems();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("getStoredCartItems returns an empty array if stored value is not an array", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ invalid: true }));
    expect(getStoredCartItems()).toEqual([]);
  });

  it("getStoredCartItems returns an empty array if stored value is malformed JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-valid-json");
    expect(getStoredCartItems()).toEqual([]);
  });
});
