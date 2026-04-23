export const CART_ACTION_TYPES = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAR_CART: "CLEAR_CART",
};

export const initialCartState = {
  items: [],
};

export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTION_TYPES.ADD_ITEM:
      return {
        ...state,
        items: [...state.items, action.payload],
      };

    case CART_ACTION_TYPES.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(
          (cartItem) => cartItem.cartItemId !== action.payload,
        ),
      };

    case CART_ACTION_TYPES.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};
