const createCartItemId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  const randomValues = new Uint32Array(4);
  window.crypto.getRandomValues(randomValues);

  return `cart-item-${Array.from(randomValues).join("-")}`;
};

export default createCartItemId;
