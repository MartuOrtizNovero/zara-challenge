import { useEffect, useReducer } from "react";
import { CartContext } from "./cartContext.js";
import {
  CART_ACTION_TYPES,
  cartReducer,
  initialCartState,
} from "./cartReducer.js";
import {
  clearStoredCartItems,
  getStoredCartItems,
  saveCartItems,
} from "./cartStorage.js";

const getInitialCartState = () => {
  return {
    ...initialCartState,
    items: getStoredCartItems(),
  };
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    getInitialCartState,
  );

  useEffect(() => {
    if (state.items.length === 0) {
      clearStoredCartItems();
      return;
    }

    saveCartItems(state.items);
  }, [state.items]);

  const addItemToCart = (cartItem) => {
    dispatch({
      type: CART_ACTION_TYPES.ADD_ITEM,
      payload: cartItem,
    });
  };

  const removeItemFromCart = (cartItemId) => {
    dispatch({
      type: CART_ACTION_TYPES.REMOVE_ITEM,
      payload: cartItemId,
    });
  };

  const totalItems = state.items.length;

  const totalPrice = state.items.reduce((accumulator, cartItem) => {
    return accumulator + cartItem.price;
  }, 0);

  const value = {
    cartItems: state.items,
    totalItems,
    totalPrice,
    addItemToCart,
    removeItemFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
