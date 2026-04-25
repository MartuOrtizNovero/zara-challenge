import { describe, it, expect } from "vitest";
import {
  cartReducer,
  initialCartState,
  CART_ACTION_TYPES,
} from "../context/cart/cartReducer.js";

const mockItem = {
  cartItemId: "abc-123",
  productId: "1",
  name: "iPhone 15",
  brand: "Apple",
  price: 999,
  storage: "128GB",
  color: { name: "Black", hexCode: "#000000" },
  imageUrl: "https://example.com/image.jpg",
};

describe("cartReducer", () => {
  it("returns the initial state unchanged for unknown actions", () => {
    const state = cartReducer(initialCartState, { type: "UNKNOWN" });
    expect(state).toEqual(initialCartState);
  });

  it("ADD_ITEM adds an item to the cart", () => {
    const state = cartReducer(initialCartState, {
      type: CART_ACTION_TYPES.ADD_ITEM,
      payload: mockItem,
    });
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockItem);
  });

  it("ADD_ITEM allows adding the same product twice (different cart entries)", () => {
    const secondItem = { ...mockItem, cartItemId: "xyz-456" };
    let state = cartReducer(initialCartState, {
      type: CART_ACTION_TYPES.ADD_ITEM,
      payload: mockItem,
    });
    state = cartReducer(state, {
      type: CART_ACTION_TYPES.ADD_ITEM,
      payload: secondItem,
    });
    expect(state.items).toHaveLength(2);
  });

  it("REMOVE_ITEM removes the item with the matching cartItemId", () => {
    const stateWithItem = { items: [mockItem] };
    const state = cartReducer(stateWithItem, {
      type: CART_ACTION_TYPES.REMOVE_ITEM,
      payload: mockItem.cartItemId,
    });
    expect(state.items).toHaveLength(0);
  });

  it("REMOVE_ITEM does not remove other items", () => {
    const secondItem = { ...mockItem, cartItemId: "xyz-456" };
    const stateWithItems = { items: [mockItem, secondItem] };
    const state = cartReducer(stateWithItems, {
      type: CART_ACTION_TYPES.REMOVE_ITEM,
      payload: mockItem.cartItemId,
    });
    expect(state.items).toHaveLength(1);
    expect(state.items[0].cartItemId).toBe("xyz-456");
  });

  it("CLEAR_CART empties the cart", () => {
    const stateWithItems = { items: [mockItem] };
    const state = cartReducer(stateWithItems, {
      type: CART_ACTION_TYPES.CLEAR_CART,
    });
    expect(state.items).toHaveLength(0);
  });
});
