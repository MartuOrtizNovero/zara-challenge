const CART_STORAGE_KEY = "zara-challenge-cart";

export const getStoredCartItems = () => {
  try {
    const storedCartItems = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!storedCartItems) {
      return [];
    }

    const parsedCartItems = JSON.parse(storedCartItems);

    return Array.isArray(parsedCartItems) ? parsedCartItems : [];
  } catch {
    return [];
  }
};

export const saveCartItems = (cartItems) => {
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    return true;
  } catch {
    return false;
  }
};

export const clearStoredCartItems = () => {
  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
};
